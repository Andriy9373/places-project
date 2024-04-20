import React, { useContext } from 'react'
import { useForm } from '../../shared/hooks/useForm';
import Input from '../../shared/components/FormElements/Input/Input'
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './PlaceForm.css';
import { useHttpRequest } from '../../shared/hooks/useHttpRequest';
import { AuthContext } from '../../shared/context/authContext';
import { useNavigate } from 'react-router-dom';

function NewPlace() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { sendRequest, isLoading, error, clearError } = useHttpRequest();
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    },
    address: {
      value: '',
      isValid: false,
    },
    image: {
      value: '',
      isValid: false,
    }
  }, false);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/places`,
        'POST',
        formData,
        { Authorization: `Bearer ${auth.token}` }
      );
      navigate('/');
    } catch(err) {}
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError}/>
      <form className='place-form' onSubmit={submitHandler}>
        { isLoading && <LoadingSpinner asOverlay /> }
        <Input
          id="title"
          element="input"
          label="Title"
          type="text"
          errorText="Please enter a title"
          value={formState?.inputs?.title?.value}
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          errorText="Description must contain at least 6 characters"
          value={formState?.inputs?.description?.value}
          validators={[VALIDATOR_MINLENGTH(6)]}
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          errorText="Please enter an arress"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </>
  )
}

export default NewPlace