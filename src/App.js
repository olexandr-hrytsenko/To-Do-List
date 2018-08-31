import React, { Component } from 'react'
import styled from 'styled-components'
import axios from "axios";
import './App.css'
import Boxs from './Boxs.js'

import { css } from 'react-emotion';
// First way to import
import { PulseLoader } from 'react-spinners';
// Another way to import

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from "./components/Home";
import About from "./components/About";
import Program from "./components/Program";
import Error from "./components/Error";
import Navigation from "./components/Navigation";

import UserForm from "./components/UserForm";


const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;


const DivLoad = styled.div`
  position: absolute;
  top: calc(50% - 4em);
  left: calc(50% - 4em);
`

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
      loading: true,
      loggedIn:false,
      repos: null
    }
  }


  componentDidMount() {
    /*this.timerId = setInterval(
      () => this.tick(),
      1000
    );
  */
    setTimeout(() => this.setState({ loading: false }), 2000); // simulates an async action, and hides the spinner
  }

  componentWillUnmount() {
    //clearInterval(this.timerId);
  }

  tick() {
    this.setState({
      date: new Date(),
    })
  }


  loginHandle = () => {
    this.setState(prevState => ({
     loggedIn: !prevState.loggedIn
    }))
  }
  
  getUser = (e) => {
    e.preventDefault();
    const user = e.target.elements.username.value;
    if (user) {
      axios.get(`https://api.github.com/users/${user}`)
      .then((res) => {
        const repos = res.data.public_repos;
        this.setState({ repos });
      })
    } else return;
  }

  render() {
    const { loading } = this.state;

    if(loading) {
      return (
        <DivLoad>
          <PulseLoader
            className={override}
            sizeUnit={"px"}
            size={40}
            margin={'5px'}
            color={'#02b107'}
            
            loading={this.state.loading}
          />
        </DivLoad> 
      )
    } else {
      return (
        <DivField>
          <Pdate>Сегодня: {this.state.date.toLocaleDateString()}</Pdate>
          <BrowserRouter>
            <div>
              <Navigation />
              <input style={{ margin:"20px auto", display:"block" }} type="button" value={this.state.loggedIn ? 'Выход': 'Вход'} onClick={this.loginHandle}/>
              <UserForm getUser={this.getUser} />
              { this.state.repos ? <p>Number of repos: { this.state.repos }</p> : <p>Please enter a username.</p> }
              
              <Switch>
                <Route path="/" exact strict component={Home} exact />
                <Route path="/about" exact strict render={({match})=>(
                this.state.loggedIn ? ( <About />) : (<Redirect to='/' />)
                )} />
                <Route path="/program" exact strict render={({match})=>(
                this.state.loggedIn ? ( <Program />) : (<Redirect to='/' />)
                )} />
                <Route component={Error} />
              </Switch>
            </div>
          </BrowserRouter>
        </DivField>
      )
    }
   
  }
}
export default App
