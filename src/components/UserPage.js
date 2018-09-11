import React from 'react';
import UserList from '../containers/user-list';
import Details from '../containers/deteils';

const WebPage = () => (
    <div style={{ textAlign : "center" }}>
        <h3>Профиль пользователя:</h3>
        <UserList />
        <hr />
        <Details />
    </div>
);

export default WebPage;