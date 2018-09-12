import React, {Component} from 'react';
import UserList from '../containers/user-list';
import Details from '../containers/deteils';


class UserPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: this.props.userId
        }
      }
    render () {
        
        return(
            <div style={{ textAlign : "center" }}>
                <h3>Профиль пользователя:</h3>
                <UserList userId={this.state.userId} />
                <hr />
                <Details />
            </div>
        )
    }
};
/*
const UserPage = () => (
    <div style={{ textAlign : "center" }}>
        <h3>Профиль пользователя:</h3>
        <UserList />
        <hr />
        <Details />
    </div>
);
*/
export default UserPage;