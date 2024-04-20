import React, { useContext, useState } from 'react'
import Input from '../../shared/components/FormElements/Input/Input'
import Button from '../../shared/components/FormElements/Button/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import { useForm } from '../../shared/hooks/useForm'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Card from '../../shared/components/UIElements/Card/Card';
import { AuthContext } from '../../shared/context/authContext';
import { useHttpRequest } from '../../shared/hooks/useHttpRequest'
import './Auth.css';
import { useNavigate } from 'react-router-dom'
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload'

function Auth() {
    const { sendRequest, isLoading, error, clearError } = useHttpRequest();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false,
        },
        password: {
            value: '',
            isValid: false,
        }
    }, false);

    const submitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const { data, token } = await sendRequest(
                    `${process.env.REACT_APP_API_URL}/users/login`,
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    { 'Content-Type': 'application/json' }
                );
                auth.login(data._id, token);
                navigate('/');
            } catch (err) {}
        }
        else {
            try {
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const { data, token } = await sendRequest(
                    `${process.env.REACT_APP_API_URL}/users/signup`,
                    'POST',
                    formData,
                );
                auth.login(data._id, token);
                navigate('/');
            } catch(err) {}
        }
    }

    const switchModeHandler = () => {
        if (isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false,
                },
                image: {
                    value: null,
                    isValid: false,
                }
            }, false);
        }
        else {
            setFormData({
                ...formState.inputs,
                name: null,
                image: null,
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        }
        setIsLoginMode(prev => !prev);
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            <Card className='authentication'>
                { isLoading && <LoadingSpinner asOverlay/> }
                <h2>Login Required</h2>
                <hr/>
                <form onSubmit={submitHandler}>
                    {!isLoginMode && <Input
                        id="name"
                        element="input"
                        label="Name"
                        type="text"
                        errorText="Please enter a valid name"
                        validators={[VALIDATOR_REQUIRE]}
                        onInput={inputHandler}
                    />}
                    {!isLoginMode && <ImageUpload
                        center
                        id="image"
                        onInput={inputHandler}
                        errorText="Please provide an image."
                    />}
                    <Input
                        id="email"
                        element="input"
                        label="E-Mail"
                        type="email"
                        errorText="Please enter a valid email"
                        validators={[VALIDATOR_EMAIL()]}
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        label="Password"
                        type="password"
                        errorText="Password must contain at least 6 characters"
                        initialValue={formState.inputs.password.value}
                        initialValid={formState.inputs.password.isValid}
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        onInput={inputHandler}
                    />
                    <Button disabled={!formState.isValid} onClick={() => {}}>
                        {isLoginMode ? 'SIGN IN' : 'SIGN UP'}
                    </Button>
                </form>
                <Button
                    inverse
                    onClick={switchModeHandler}
                >
                    SWITCH TO {isLoginMode ? 'REGISTER' : 'LOGIN'}
                </Button>
            </Card>
        </>
    )
}

export default Auth