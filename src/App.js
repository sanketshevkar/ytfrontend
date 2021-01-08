import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path='/' render={props=>(
        <React.Fragment>
          <Landing/>
        </React.Fragment>
        )}/>
        </Router>
    </div>
  );
}

export default App;
