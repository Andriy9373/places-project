import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList/PlaceList'
import { useHttpRequest } from '../../shared/hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

function UserPlaces() {
    const { sendRequest, isLoading, error, clearError } = useHttpRequest();
    const params = useParams();
    const [loadedPlaces, setLoadedPlaces] = useState([]);

    const fetchPlaces = useCallback(async () => {
        if (params.userId) {
            try {
                const { data } = await sendRequest(`${process.env.REACT_APP_API_URL}/places/user/${params.userId}`);
                setLoadedPlaces(data);
            } catch (err) {}
        }
    }, [params.userId, sendRequest]);

    const deletePlace = (id) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place._id !== id));
    };
    
    useEffect(() => {
        fetchPlaces();
    }, [fetchPlaces]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            { isLoading && <div className='center'><LoadingSpinner /></div> }
            { !isLoading && <PlaceList items={loadedPlaces} onDelete={(id) => deletePlace(id)} /> }
        </>
    )
}

export default UserPlaces