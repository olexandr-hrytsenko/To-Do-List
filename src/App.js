import React, { Component } from 'react'
import styled from 'styled-components'
import axios from "axios";
import './App.css'
//import Boxs from './Boxs.js'
import localForage from 'localforage/dist/localforage'

import { css } from 'react-emotion';
import { PulseLoader } from 'react-spinners';

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
  font-size: 1.1em;
  flex-direction: column;
  align-items: center;
`
const DivCenter = styled.div`
  text-align: center;
`

const Pdate = styled.p`
  margin-bottom: 5px;
  margin-top: 0px;
  color: rgb(4, 66, 186);
`

const Label = styled.label`
  color: green;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 5px;
  display:"block";
`

const API = axios.create({
  baseURL: "http://localhost:3000/api"
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      loading: true,
      loggedIn:false,
      repos: null,
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }


  componentDidMount() {
    /*this.timerId = setInterval(
      () => this.tick(),
      1000
    );
  */
    var user_auth = {};
    localForage.setDriver(localForage.LOCALSTORAGE).then(() => {
    localForage.setItem('user_auth', user_auth);
    })

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

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
}

  loginHandle = () => {
    /*this.setState(prevState => ({
      loggedIn: !prevState.loggedIn
     }))*/

    if (!this.state.loggedIn) { 
      const user = this.state.username;
      const password = this.state.password;
      if (user.length > 0 & password === 'admin') {
        axios.get(`https://api.github.com/users/${user}`)
        .then((res) => {
          this.setState({ loggedIn: true });
        })
        .catch(function (error) {
          console.log(error);
        });
      } else alert('Логин или пароль не верны!');
    } else {
      this.setState({ loggedIn: false });
    }
  }
  
  getUser = (e) => {
    e.preventDefault();
    const user = e.target.elements.username.value;
    if (user) {
      API.get(`/Users/${user}?access_token=9FHFwYrGEcPiPZ5qZRkDGWbi38z5RqTmFl1JRHNCUIB5RcY9AV6PSZBMyyf11cBw`)
      .then((res) => {
        console.log(res)
        // const repos = res.data.public_repos;
        // this.setState({ repos });
      }).catch(err => {
        console.log(err)
      })
    } else return;
  }

  render() {
    const { loading, loggedIn, username, password } = this.state;

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
      if (!loggedIn) {
        return (
          <DivField>
            <Label>Логин: </Label>
            <input style={{ display:"block" }} type="text" name="username" value={username} onChange={this.handleChange} />
            <Label>Пароль: </Label>
            <input style={{ display:"block" }} type="password" name="password" value={password} onChange={this.handleChange} />
            <input style={{ margin:"20px auto", display:"block" }} type="button" value={this.state.loggedIn ? 'Выход': 'Вход'} onClick={this.loginHandle}/>
            
          </DivField>
        )
        
      } else {
        return (
          <DivField>
            <input style={{ margin:"20px auto", display:"block" }} type="button" value={this.state.loggedIn ? 'Выход': 'Вход'} onClick={this.loginHandle}/>
            <Pdate>Сегодня: {this.state.date.toLocaleDateString()}</Pdate>
            <BrowserRouter>
              <div>
              <DivCenter>
                <Navigation />
                
                <UserForm getUser={this.getUser} />
                { this.state.repos ? <p>Количество репозиториев: { this.state.repos }</p> : <p>Введите имя пользователя..</p> }
              </DivCenter>

                <Switch>
                  <Route path="/" exact strict component={Home} />
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
}
export default App
