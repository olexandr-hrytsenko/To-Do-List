import React, { Component } from 'react';
import './App.css';
import Boxs from './Boxs.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  };

  componentDidMount() {
    /*this.timerId = setInterval(
      () => this.tick(),
      1000
    );
  */
  }

  componentWillUnmount() {
    //clearInterval(this.timerId);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div className="field">
        <p className="tdate">Сегодня: {this.state.date.toLocaleDateString()}</p>
        <Boxs />
      </div>
    );
  }
}
export default App;
