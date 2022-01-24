// eslint-disable-next-line camelcase

import { BiLogOut, BiCaretDown } from 'react-icons/bi';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFromLocalStorage, logout } from '../../context/actions';
import { useAppDispatch, useAppState } from '../../context/store';

import './Navbar.css';

const Navbar = () => {
  const { user } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCloseSession = () => {
    logout(dispatch);
    navigate('/');
  };

  useEffect(() => {
    getUserFromLocalStorage(dispatch);
  }, []);

  return (
    <nav>
      <div className="nav__container">
        <Link to="/">
          <img
            src="https://st2.depositphotos.com/3096625/8799/v/600/depositphotos_87990570-stock-illustration-letter-r-logo-monogram.jpg"
            alt=""
            className="nav__container__logo"
          />
        </Link>
        <ul className="nav__container__menu">
          {user ? (
            <div className="nav__container__menu">
              <li className="nav__container__menu__list">
                <div className="nav__container__menu__list__link">
                  {`${user.fullName}`}
                </div>
              </li>
              <li className="nav__container__menu__list">
                <BiLogOut
                  onClick={handleCloseSession}
                  size="25px"
                  className="logout-btn"
                  title="cerrar sesión"
                />
                <BiCaretDown size="25px" className="toogle-btn" />
              </li>
            </div>
          ) : (
            <div className="nav__container__menu">
              <li className="nav__container__menu__list">
                <Link to="/login" className="nav__container__menu__list__link">
                  Login
                </Link>
              </li>
              <li className="nav__container__menu__list">
                <Link to="/signup" className="nav__container__menu__list__link">
                  Registrarse
                </Link>
              </li>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
