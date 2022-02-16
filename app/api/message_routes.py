from ntpath import join
from time import clock_getres
from flask import Blueprint, jsonify
from flask_socketio import send, emit, join_room, leave_room
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


@message_routes.route("/servers/new", methods=["GET"])
# @login_required
def new_server():
    servers = Server.query.all()
    return {"servers": {s.id: s.to_dict() for s in servers}}
