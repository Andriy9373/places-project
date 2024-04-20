import React from 'react'
import Card from '../../../shared/components/UIElements/Card/Card'
import PlaceItem from '../PlaceItem/PlaceItem';
import Button from '../../../shared/components/FormElements/Button/Button';
import './PlaceList.css';

function PlaceList(props) {
    if (!props.items?.length) {
        return (
            <div className='place-list center'>
                <Card>
                    <h2>No places found. Maybe create one?</h2>
                    <Button to="/places/new">Share place</Button>
                </Card>
            </div>
        )
    }

    return (
        <ul className='place-list'>
            {props.items.map(place => {
                return (
                <PlaceItem
                    key={place._id}
                    id={place._id}
                    image={place.image}
                    name={place.name}
                    description={place.description}
                    address={place.address}
                    creatorId={place.creator}
                    coordinates={place.location}
                    onDelete={(id) => props.onDelete(id)}
                />)
            }
            )}
        </ul>
    )
}

export default PlaceList