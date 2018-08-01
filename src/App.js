import React, { Component } from 'react'
import styled from 'styled-components'
import './App.css'
import Boxs from './Boxs.js'


const DivField = styled.div`
  display: flex;
  padding: 10px;
  width: 50%;
  margin-left: 25%;
  color: #fff;
  font-size: 1.3em;
  flex-direction: column;
  align-items: center;
`

const Pdate = styled.p`
  margin-bottom: 5px;
  margin-top: 0px;
  color: rgb(4, 66, 186);
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
    }
  }

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
      date: new Date(),
    })
  }

  render() {
    return (
      <DivField>
        <Pdate>Сегодня: {this.state.date.toLocaleDateString()}</Pdate>
        <Boxs />
      </DivField>
    )
  }
}
export default App
