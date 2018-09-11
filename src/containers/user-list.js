import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {select} from '../actions';

class UserList extends Component {
    showList () {
        return this.props.users.map ((user) =>{
            if (user.id === 1) {
                return (
                    <p onClick={ () => this.props.select (user) }
                    key={user.id}>{user.name}</p>
                );    
            } else return null;
            
        });
    }


    render () {
        return (
            <div>
                {this.showList ()}
            </div>
        );
    }

}

function mapStateToProps (state) {
    return {
        users: state.users
    }
}

function matchDispatchToProps (dispatch) {
    return bindActionCreators({select: select}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(UserList);