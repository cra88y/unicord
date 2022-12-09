from cgi import test
from ntpath import join
from time import clock_getres
from flask import Blueprint, jsonify, request
from flask_socketio import send, emit, join_room, leave_room
from app.api.auth_routes import validation_errors_to_error_messages
from app.forms.channel_form import ChannelForm
from app.forms.edit_message_form import EditMessageForm
from app.forms.server_form import ServerForm
from .. import socketio
from flask_login import current_user, login_required
from app.models import db, User, Message, Channel, Server, Membership

message_routes = Blueprint('messages', __name__)

@socketio.on("message")
def on_message(data):
    if not current_user.is_authenticated:
        return None
    user = current_user
    msg = {
        "user_id": user.id,
        "body": data['message'],
        "chat_type": data['chat_type'],
        "chat_id": data['chat_id'],
    }
    room = f"{data['chat_type']}{data['chat_id']}"
    message = Message(**msg)
    db.session.add(message)
    db.session.commit()
    messages = db.session.query(Message).filter(Message.chat_type ==
                                                "channel", Message.chat_id == data['chat_id']).order_by(Message.created_at).all()
    emit("message", [m.to_dict() for m in messages], room=room)
    return None


@socketio.on("message_changed")
def on_message_change(data):
    if not current_user.is_authenticated:
        return None
    room = f"{data['chat_type']}{data['chat_id']}"
    messages = db.session.query(Message).filter(Message.chat_type ==
                                                "channel", Message.chat_id == data['chat_id']).order_by(Message.created_at).all()
    emit("refresh_messages", [m.to_dict() for m in messages], room=room)
    return None


@socketio.on("join")
def on_join(data):
    if not current_user.is_authenticated:
        return None
    user = current_user
    room = f"{data['chat_type']}{data['chat_id']}"
    join_room(room)
    return None


@socketio.on("leave")
def onLeave(data):
    if not current_user.is_authenticated:
        return None
    user = current_user
    room = f"{data['chat_type']}{data['chat_id']}"
    leave_room(room)
    return None


@message_routes.route("/channel/<int:id>/messages", methods=["GET"])
def get_channel_messages(id):
    messages = db.session.query(Message).filter(Message.chat_type ==
                                                "channel", Message.chat_id == id).all()
    return {"messages": [m.to_dict() for m in messages]}, 200


@message_routes.route("/conversation/<int:id>/messages", methods=["GET"])
def get_conversation_messages(id):
    messages = db.session.query(Message).filter(Message.chat_type ==
                                                "conversation" and Message.chat_id == id).all()
    return {"messages": [m.to_dict() for m in messages]}, 200


@message_routes.route("/servers/joinable", methods=["GET"])
@login_required
def get_joinable_servers():
    joined = current_user.get_server_ids()
    servers = Server.query.filter(~Server.id.in_(joined)).all()
    return {"servers": {s.id: s.to_dict() for s in servers}}, 200


@message_routes.route("/servers/joined", methods=["GET"])
@login_required
def get_user_servers():
    joined = current_user.get_server_ids()
    servers = Server.query.filter(Server.id.in_(joined)).all()
    return {"servers": {s.id: s.to_dict() for s in servers}}, 200


@message_routes.route("/servers/<int:id>/leave", methods=["POST"])
@login_required
def leave_server(id):
    server = Server.query.get(id)
    membership = Membership.query.filter(
        Membership.joinable_type == "server", Membership.joinable_id == id).first()
    if membership is not None and server.owner_id != current_user.id:
        db.session.delete(membership)
        db.session.commit()
        return server.to_dict(), 200
    else:
        return {'errors': ["user isn't a member of this server"]}, 404


@message_routes.route("/servers/new", methods=["POST"])
@login_required
def new_server():
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        server = Server(owner_id=current_user.id,
                        name=form.data["name"], imgUrl=form.data["url"])
        db.session.add(server)
        db.session.commit()
        channel = Channel(
            server_id=server.id, name="general")
        db.session.add(channel)
        membership = Membership(user_id=current_user.id,
                                joinable_type="server", joinable_id=server.id)
        db.session.add(membership)
        db.session.commit()
        return server.to_dict(), 200
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@message_routes.route("/channels/new", methods=["POST"])
@login_required
def new_channel():
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        server_id = form.data["server_id"]
        server = Server.query.get(server_id)
        if(server.owner_id == current_user.id):
            channel = Channel(
                server_id=server_id, name=form.data["name"])
            db.session.add(channel)
            db.session.commit()
            return channel.server.to_dict()
        else:
            return {'errors': ["unauthorized"]}, 401
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@message_routes.route("/channels/messages/<int:id>", methods=["DELETE"])
@login_required
def delete_channel_message(id):
    message = Message.query.get(id)
    if message.user_id == current_user.id:
        channel = Channel.query.get(message.chat_id)
        db.session.delete(message)
        db.session.commit()
        return channel.server.to_dict()
    else:
        return {'errors': ["unauthorized"]}, 401


@message_routes.route("/channels/<int:id>", methods=["DELETE"])
@login_required
def delete_channel(id):
    channel = Channel.query.get(id)
    if channel.server.owner_id == current_user.id:
        db.session.delete(channel)
        db.session.commit()
        return channel.server.to_dict()
    else:
        return {'errors': ["unauthorized"]}, 401


@message_routes.route("/channels/<int:id>", methods=["PATCH"])
@login_required
def edit_channel(id):
    channel = Channel.query.get(id)
    form = ChannelForm()
    form["server_id"].data = channel.server_id
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if channel.server.owner_id == current_user.id:
            channel.name = form.data["name"]
            db.session.commit()
            return channel.server.to_dict()
        else:
            return {'errors': ["unauthorized"]}, 401
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@message_routes.route("/channels/messages", methods=["PATCH"])
@login_required
def edit_message():

    form = EditMessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        message = Message.query.get(form.data["id"])
        if message.user.id == current_user.id:
            message.body = form.data["body"]
            db.session.commit()
            return message.to_dict()
        else:
            return {'errors': ["unauthorized"]}, 401
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@message_routes.route("/servers/<int:id>", methods=["DELETE"])
@login_required
def delete_server(id):
    server = Server.query.get(id)
    if server.owner_id == current_user.id:
        server.delete_self()
        return "success", 200
    else:
        return {'errors': "unauthorized"}, 401


@message_routes.route("/servers/<int:id>", methods=["PATCH"])
@login_required
def edit_server(id):
    server = Server.query.get(id)
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if server.owner_id == current_user.id:
            server.name = form.data["name"]
            server.imgUrl = form.data["url"]
            db.session.commit()
            return server.to_dict()
        else:
            return {'errors': ["unauthorized"]}, 401
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@message_routes.route("/servers/<int:id>/join", methods=["POST"])
@login_required
def join_server(id):
    server = Server.query.get(id)
    membershipExists = db.session.query(Membership).filter(Membership.joinable_type == "server", Membership.joinable_id ==
                                                           server.id, Membership.user_id == current_user.id).first() is not None
    if not membershipExists and server is not None:
        membership = Membership(user_id=current_user.id,
                                joinable_type="server", joinable_id=server.id)
        db.session.add(membership)
        db.session.commit()
        return server.to_dict()
    else:
        return {'errors': ["already joined this server"]}, 401
