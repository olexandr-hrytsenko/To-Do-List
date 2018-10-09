import React, {Component} from 'react';
import {connect} from 'react-redux';
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
  width: 100%;
  text-align: center;
`

class Details extends Component {
    render() {
        if (!this.props.user) {
            return (<p>Для подробной информации, нажмите на пользователя...</p>)
        }
        return (
            <DivBox>
                <h2>
                    {this.props.user.name}
                </h2>


                <Table>
                <tbody>
                    <tr>
                    <Td FirstCol>
                        <img style={{ width: "100%" }} src={this.props.user.img} alt="Foto" />
                    
                    </Td>
                    <Td>
                        <p>{this.props.user.desc}</p>
                        <p>Email: {this.props.user.email}</p>
                        <p>Телефон: {this.props.user.tel}</p>
                    </Td>
                    </tr>
                </tbody>
                </Table>

                
            </DivBox>
        );
    }
}

function mapStateToProps (state) {
    return {
        user: state.active
    }
}

export default connect(mapStateToProps)(Details);