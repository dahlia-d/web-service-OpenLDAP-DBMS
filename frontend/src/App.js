import "./App.css";
import React, { useState, useEffect } from "react";

import Keycloak from "keycloak-js";

let initOptions = {
  url: "http://localhost:8080/",
  realm: "realm",
  clientId: "frontend",
};

let kc = new Keycloak(initOptions);

kc.init({
  onLoad: "login-required", // Supported values: 'check-sso' , 'login-required'
});

function App() {
  const [message, setMessage] = useState("Befoe adding event");
  const [user_event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  
  const fetchEvents = async (event) => {
    event.preventDefault();
      const token = kc.token;
      console.log(token);
      const response = await fetch('http://localhost:5000/events', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token}),
      });
      const data = await response.json();
      setEvents(data);
  };

  const handleSubmit = async () => {
    const token = kc.token;
      const json_body = JSON.stringify({
        token, user_event, date,
      });
      const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json_body,
      });
      const data = await response.json();
  };

  return (
    <div className="App">
      <h1>Add event</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Event:
            <input
              type="event"
              value={user_event}
              onChange={(e) => setEvent(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add event</button>
      </form>
      <h1>Show events</h1>
      <button onClick={fetchEvents}>Show events</button>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <p>Event: {event.event}</p>
            <p>Date: {event.date}</p>
          </li>
        ))}
      </ul>
      <button onClick={() => {kc.logout()}}>Log out</button>
    </div>
  );
}


export default App;


