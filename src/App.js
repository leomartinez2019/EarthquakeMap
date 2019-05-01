import React, { Component } from 'react';
import Earthquakes from './components/Earthquakes';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Earthquakes />
      </div>
    );
  }
}

export default App;
