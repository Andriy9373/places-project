import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../src/shared/context/authContext';
import { useAuth } from './shared/hooks/useAuth';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner/LoadingSpinner';

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const MainNavigation = React.lazy(() => import('./shared/components/Navigation/MainNavigation/MainNavigation'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

function App() {
  const { userId, token, login, logout } = useAuth();

  let routes = null;
  if (token) {
    routes = (
        <>
          <Route path="/" exact element={<Users />} />
          <Route path="/:userId/places" exact element={<UserPlaces />} />
          <Route path="/places/:placeId" exact element={<UpdatePlace />} />
          <Route path="/places/new" exact element={<NewPlace />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </>
    );
  }
  else {
    routes = (
      <>
        <Route path="/" exact element={<Users />} />
        <Route path="/:userId/places" exact element={<UserPlaces />} />
        <Route path="/auth" exact element={<Auth />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </>
  );
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      userId,
      token,
      login,
      logout,
    }}>
      <BrowserRouter>
        <MainNavigation/>
          <main>
            <Suspense fallback={<div className='center'><LoadingSpinner/></div>}>
              <Routes>
                {routes}
              </Routes>
            </Suspense>
          </main>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App