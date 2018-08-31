import React from "react";
import { NavLink } from 'react-router-dom'; 

const Navigation = () => {
  return (
    <div>
      <NavLink to="/" exact activeStyle={
              { color:'red' }
            }>Home</NavLink><br />
      <NavLink to="/about" exact activeStyle={
              { color:'orange' }
            }>About</NavLink><br />
      <NavLink to="/program" exact activeStyle={
              { color:'green' }
            }>Program</NavLink><br />
      <br />
      <hr />

    </div>
  );
};

export default Navigation;