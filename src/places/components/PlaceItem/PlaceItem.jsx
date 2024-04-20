import React, { useContext, useState } from 'react'
import Card from '../../../shared/components/UIElements/Card/Card'
import Modal from '../../../shared/components/UIElements/Modal/Modal'
import Button from '../../../shared/components/FormElements/Button/Button'
import ErrorModal from '../../../shared/components/UIElements/ErrorModal/ErrorModal'
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import { AuthContext } from '../../../shared/context/authContext'
import './PlacesItem.css'
import { useHttpRequest } from '../../../shared/hooks/useHttpRequest'

function PlaceItem(props) {
    const auth = useContext(AuthContext);
    const { sendRequest, isLoading, error, clearError } = useHttpRequest();
    const [showMap, setShowMap] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deletePlace = async () => {
        try {
            setShowDeleteModal(false);
            await sendRequest(
                `${process.env.REACT_APP_API_URL}/places/${props.id}`,
                'DELETE',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );
            props.onDelete(props.id);
        } catch (err) {}
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            <li className="place-item">
                <Card className="place-item__content">
                    { isLoading && <LoadingSpinner asOverlay /> }
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${props.image}`} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={() => setShowMap(true)}>
                            VIEW IMAGE
                        </Button>
                        {auth.userId === props.creatorId && (
                            <Button inverse to={`/places/${props.id}`}>EDIT</Button>
                        )}
                        {auth.userId === props.creatorId && (
                            <Button inverse onClick={() => setShowDeleteModal(true)}>
                                DELETE
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
            <Modal 
                show={showMap}
                onCancel={() => setShowMap(false)}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={() => setShowMap(false)}>CLOSE</Button>}
            >
                <div className='map-container'>
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${props.image}`} alt={props.title} />
                    </div>
                </div>
            </Modal>
            <Modal 
                show={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                header="Are you sure?"
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<>
                    <Button inverse onClick={() => setShowDeleteModal(false)}>CLOSE</Button>
                    <Button danger onClick={deletePlace}>DELETE</Button>
                </>}
            >
                <div className='map-container'>
                    <p className='delete-text'>Are you sure you want to delete this place? This action cannot be undone and the place will not be recoverable.</p>
                </div>
            </Modal>
        </>
    )
}

export default PlaceItem