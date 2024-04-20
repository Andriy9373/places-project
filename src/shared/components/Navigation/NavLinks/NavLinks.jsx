import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { AuthContext } from '../../../../shared/context/authContext';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  const onElementClick = (event) => {
    if (props?.onClick && ['A', 'BUTTON'].includes(event.target.nodeName)) {
      props?.onClick();
    }
  }

  return (
    <ul className="nav-links" onClick={onElementClick}>
      <li>
        <NavLink to="/">
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
