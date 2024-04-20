import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from '../MainHeader/MainHeader';
import NavLinks from '../NavLinks/NavLinks';
import SideDrawer from '../SideDrawer/SideDrawer';
// import SideDrawer from './SideDrawer';
// import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';
import Backdrop from '../../UIElements/Backdrop/Backdrop';

const MainNavigation = props => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // const openDrawerHandler = () => {
  //   setDrawerIsOpen(true);
  // };

  // const closeDrawerHandler = () => {
  //   setDrawerIsOpen(false);
  // };

  return (
    <>
      {isDrawerOpen && <Backdrop onClick={() => setIsDrawerOpen(false)}/>}
      <SideDrawer show={isDrawerOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks onLink={() => setIsDrawerOpen(false)}/>
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={() => setIsDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
