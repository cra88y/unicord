from cgi import test
from ntpath import join
from time import clock_getres
from flask import Blueprint, jsonify, request
from flask_socketio import send, emit, join_room, leave_room
from app.api.auth_routes import validation_errors_to_error_messages
from app.forms.channel_form import ChannelForm

from app.forms.server_form import ServerForm
from .. import socketio
from flask_login import current_user, login_required
from app.models import db, User, Message, Channel, Server, Membership

message_routes = Blueprint('messages', __name__)


# @socketio.on('connect')
# def connect_handler():
#     print("SOCKET CONNECT", current_user.is_authenticated)
#     if current_user.is_authenticated:
#         print("VALID USER CONNECTED")
#         emit('my response',
#              {'message': '{0} has joined'.format(current_user.id)},
#              broadcast=True)
#     else:
#         return False  # not allowed here


@socketio.on("message")
def onMessage(data):
    if not current_user.is_authenticated:
        return None
    user = current_user
# server = Server(owner_id=user.id, name="test server")
# db.session.add(server)
# db.session.commit()
# channel = Channel(server_id=server.id, name="my test channel")
# db.session.add(channel)
# db.session.commit()
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
    emit("message", message.to_dict(), room=room)
    return None


@socketio.on("join")
def onJoin(data):
    # print("@@@@@@@@@@@@@", data['chat_type'])
    if not current_user.is_authenticated:
        return None
    user = current_user
    room = f"{data['chat_type']}{data['chat_id']}"
    print("JOINING ROOM", room)
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
    return {"messages": [m.to_dict() for m in messages]}


@message_routes.route("/conversation/<int:id>/messages", methods=["GET"])
def get_conversation_messages(id):
    messages = db.session.query(Message).filter(Message.chat_type ==
                                                "conversation" and Message.chat_id == id).all()
    return {"messages": [m.to_dict() for m in messages]}


@message_routes.route("/servers", methods=["GET"])
@login_required
def get_servers():
    # memberships = current_user.memberships
    servers = Server.query.all()
    return {"servers": {s.id: s.to_dict() for s in servers}}


@message_routes.route("/servers/new", methods=["POST"])
@login_required
def new_server():
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        server = Server(owner_id=current_user.id, name=form.data["name"])
        db.session.add(server)
        db.session.commit()
        membership = Membership(user_id=current_user.id,
                                joinable_type="server", joinable_id=server.id)
        db.session.add(membership)
        db.session.commit()
        return server.to_dict()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@message_routes.route("/channels/new", methods=["POST"])
@login_required
def new_channel():
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel = Channel(
            server_id=form.data["server_id"], name=form.data["name"])
        db.session.add(channel)
        db.session.commit()
        return channel.server.to_dict()
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
        return {'errors': "unauthorized"}, 401


@message_routes.route("/channels/<int:id>", methods=["DELETE"])
@login_required
def delete_channel(id):
    channel = Channel.query.get(id)
    # print("@@@@@@@@@@@@@@@@@@@@", channel.server.owner_id)
    if channel.server.owner_id == current_user.id:
        db.session.delete(channel)
        db.session.commit()
        return channel.server.to_dict()
    else:
        return {'errors': "unauthorized"}, 401


@message_routes.route("/channels/<int:id>", methods=["PATCH"])
@login_required
def edit_channel(id):
    channel = Channel.query.get(id)
    form = ChannelForm()
    form["server_id"].data = channel.server_id
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        print("@@@@@@", channel.server.owner_id == current_user.id)
        if channel.server.owner_id == current_user.id:
            channel.name = form.data["name"]
            db.session.commit()
            return channel.server.to_dict()
        else:
            return {'errors': "unauthorized"}, 401
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@message_routes.route("/servers/<int:id>", methods=["DELETE"])
@login_required
def delete_server(id):
    server = Server.query().get(id)
    if server.owner_id == current_user.id:
        db.session.delete(server)
        db.session.commit()
    else:
        return {'errors': "unauthorized"}, 401
