import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {select} from '../actions';

class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: this.props.userId
        }
      }

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

function mapDispatchToProps (dispatch) {
    return bindActionCreators({select: select}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);