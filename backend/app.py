from flask import Flask, request, jsonify, make_response
from sqlalchemy import create_engine, select, Text
from sqlalchemy.orm import Session, DeclarativeBase, Mapped, mapped_column, session
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def engine_create():
    return create_engine('mariadb+pymysql://user:password@localhost:3306/database')

class Base(DeclarativeBase):
    pass

class Event(Base):
    __tablename__ = "event"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(Text)
    event: Mapped[str] = mapped_column(Text)
    date: Mapped[str] = mapped_column(Text)

    def __init__(self, user_id, event, date):
        self.user_id = user_id
        self.event = event
        self.date = date

@app.route('/add', methods=['POST'])
def add_event():
    data = request.json

    response = requests.post(f"http://localhost:8080/realms/realm/protocol/openid-connect/token/introspect", {"client_id": "backend", "client_secret": "XxDEzLTNNOvsWlZoMIqDGw02wO3GeDdn", "token": data["token"]}).json()

    if response["active"] == False:
       return jsonify({"message": "Unauthorized user"}), 401

    engine = engine_create()

    user_id = response["sub"]
    event = data.get('user_event')
    date = data.get('date')

    new_event = Event(user_id=user_id, event=event, date=date)

    with Session(engine) as session:
        session.add(new_event)
        session.commit()

    return make_response({"message": f"Event was added successfully"}, 200)

@app.route('/data', methods=['GET'])
def data():
    return jsonify({"message": "Hello from app.py"})

@app.route('/events', methods=['POST'])
def get_events():
    data = request.json
    response = requests.post(f"http://localhost:8080/realms/realm/protocol/openid-connect/token/introspect", {"client_id": "backend", "client_secret": "XxDEzLTNNOvsWlZoMIqDGw02wO3GeDdn", "token": data["token"]}).json()

    events = select(Event)
    events_list = []
    with Session(engine_create()) as session:
        for event in session.execute(events):
            if(event.Event.user_id == response['sub']):
                events_list.append({"id": event.Event.id, "user_id": event.Event.user_id, "event": event.Event.event, "date": event.Event.date})
        return jsonify(events_list), 200

#Base.metadata.create_all(engine_create())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
