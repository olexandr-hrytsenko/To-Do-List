import React, {Component} from 'react';
import styled from 'styled-components'

const Table = styled.table`
  width: 100%;
  text-align: center;
`
const Td = styled.td`
  vertical-align: middle;
  width: ${props => () => {
    return props.FirstCol ? '30%' : '70%'
  }};
  text-align: ${props => (props.FirstCol ? 'left' : 'inherit')};
`
const DivBox = styled.div`
  border: 1px solid #aaa719;
  background-color: #d4d37f;
  margin-bottom: 20px;
  padding: 10px;
  width: 80%;
  text-align: center;
  &:last-child {
    margin-bottom: 0;
  }
`


class DropDown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsOpened: false
        }
        this.toggleState = this.toggleState.bind(this);
      }

  toggleState() {
    this.setState({ IsOpened: !this.state.IsOpened });
  }

  render () {
    let DropDownText;
    if (this.state.IsOpened) {
        DropDownText = <Table>
          <tbody>
            <tr>
              <Td FirstCol>
              <img style={{ width: "100%" }} src='https://static-s.aa-cdn.net/img/gp/20600007740473/HKtQ5WjczxJz5lffo1tIR_5pgxVcv4J9EXEdAZFLR8pB55oHYSifXfmPcL2jgsQ75g=w300?v=1' alt='Foto'/>
              
              </Td>
              <Td>
                <p> Иванов Иван Иванович </p>
              </Td>
            </tr>
          </tbody>
        </Table>


    }
    return (
        <DivBox onClick={this.toggleState}>
          Профиль &dArr;
          {DropDownText}
        </DivBox>
     )
  }
};

export default DropDown;