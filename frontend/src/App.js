import './App.css';
import React, { useEffect, useState } from 'react';

import Keycloak from 'keycloak-js';
/*
let initOptions = {
  url: 'http://localhost:8080/',
  realm: 'realm',
  clientId: 'frontend',
}

let kc = new Keycloak(initOptions);

kc.init({
  onLoad: 'login-required', // Supported values: 'check-sso' , 'login-required'
  pkceMethod: 'S256'
}).then((auth) => {
  if (!auth) {
    //window.location.reload();
  } else {
    // Remove below logs if you are using this on production
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('Keycloak', kc)
    console.log('Access Token', kc.token)

    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  //Notify the user if necessary
  console.error("Authentication Failed");
});
*/
function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = () => {
    fetch('http://localhost:5000/data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data.message))
      .catch(error => setError(error.toString()));
  };

  return (
    <div>
      <header>
        <h1>{data ? data : "Click the button to load data"}</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={fetchData}>Fetch Data</button>
      </header>
    </div>
  );
}

export default App;
