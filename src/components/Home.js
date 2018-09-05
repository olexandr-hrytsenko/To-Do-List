import React from "react";
import styled from 'styled-components';

const DivBox = styled.div`
  border: 2px solid #aaa719;
  background-color: #d4d37f;
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  text-align: center;
  &:last-child {
    margin-bottom: 0;
  }
`

const Home = () => {
  return (
    <DivBox>
      <h2>Добрый день!</h2>
    </DivBox>
  );
};

export default Home;