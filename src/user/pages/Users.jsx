import React, { useCallback, useEffect, useState } from 'react'
import UserList from '../components/UserList/UserList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import { useHttpRequest } from '../../shared/hooks/useHttpRequest';

function Users() {
    const { sendRequest, isLoading, error, clearError } = useHttpRequest();
    const [users, setUsers] = useState([]);

    const fetchUsers = useCallback(async () => {
        try {
            const data = await sendRequest(`${process.env.REACT_APP_API_URL}/users`);
            setUsers(data.data);
        } catch (err) {
            console.log(err);
        }
    }, [sendRequest]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            { isLoading && <div className='center'>
                <LoadingSpinner/>
            </div> }
            { !isLoading && <UserList items={users}/>}
        </>
    )
}

export default Users