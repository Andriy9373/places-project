import React from 'react'
import './UserList.css';
import UserItem from '../UserItem/UserItem';

function UserList(props) {
    if (props.items.length === 0) {
        return (
            <div className='center'>
                <h2>No users found.</h2>
            </div>
        )
    }

    return <ul className='user-list'>
        {props.items?.map(user => 
            <UserItem
                key={user._id}
                id={user._id}
                image={user.image}
                name={user.name}
                placeCount={user.places.length}
            />
        )}
    </ul>
}

export default UserList