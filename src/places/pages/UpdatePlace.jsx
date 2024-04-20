import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../../shared/hooks/useForm';
import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Card from '../../shared/components/UIElements/Card/Card';
import { useHttpRequest } from '../../shared/hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import { AuthContext } from '../../shared/context/authContext';


function UpdatePlace() {
  const { sendRequest, isLoading, error, clearError } = useHttpRequest();
  const params = useParams();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [identifiedPlace, setIdentifiedPlace] = useState(null);
  const [isPlace, setIsPlace] = useState(false);
  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    },
  }, false);

  const fetchPlace = useCallback(async () => {
    try {
      const { data } = await sendRequest(`${process.env.REACT_APP_API_URL}/places/${params.placeId}`);
      setIdentifiedPlace(data);
      setFormData({
        title: {
          value: data.title,
          isValid: true,
        },
        description: {
          value: data.description,
          isValid: true,
        },
      }, true);
      setIsPlace(true);
    } catch (err) {}
  }, [params.placeId, sendRequest, setFormData]);

  useEffect(() => {
    fetchPlace();
  }, [fetchPlace]);

  const updatePlace = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/places/${params.placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        }
      );
      navigate(`/${auth.userId}/places`);
    } catch (err) {}
  }
  
  const submitHandler = async (event) => {
    event.preventDefault();
    if (formState.isValid) {
      await updatePlace();
    }
  }

  if (isLoading && !error) {
    return (
      <div className='center'>
        <Card>
          Loading...
        </Card>
      </div>
    )
  }

  else if (!isPlace) {
    return (
      <div className='center'>
        <Card>
          Not found!
        </Card>
      </div>
    )
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError}/>
      { !isLoading && identifiedPlace && (
        <form className='place-form' onSubmit={submitHandler}>
          <Input
            id="title"
            element="input"
            label="Title"
            type="text"
            errorText="Please enter a title"
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            errorText="Description must contain at least 6 characters"
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
          />
          <Button disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>
      )}
    </>
  )
}

export default UpdatePlace