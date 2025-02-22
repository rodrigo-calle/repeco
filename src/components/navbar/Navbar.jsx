// eslint-disable-next-line camelcase
import React, { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFromLocalStorage, logout } from '../../context/actions';
import { useAppDispatch, useAppState } from '../../context/store';

import './Navbar.css';

const Navbar = () => {
  const { user } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleCloseSession = () => {
    logout(dispatch);
    navigate('/');
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    getUserFromLocalStorage(dispatch);
  }, []);

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dwat1o60y',
    },
  });
  const myAvatar = cld.image(user?.avatar);
  return (
    <nav>
      <div className="nav__container">
        <div className="nav__home">
          <Link to="/" className="nav__home__link">
            <img
              src="/logo-Repeco.png"
              alt="Logo"
              className="nav__container__logo"
            />
          </Link>
          <Link to="/" className="nav__home__link">
            <p>INICIO</p>
          </Link>
          {user?.role === 'hotel' ? (
            <Link to="/userhotel" className="nav__home__link">
              <p>ADMIN</p>
            </Link>
          ) : (
            ''
          )}
        </div>
        <ul className="nav__container__menu">
          {user ? (
            <div className="nav__container__menu">
              <li className="nav__container__menu__list">
                <div className="nav__container__menu__list__link">
                  {`Welcome, ${user.fullName}`}
                </div>
              </li>
              <li className="nav__container__menu__list">
                <AdvancedImage className="user-avatar-btn" cldImg={myAvatar} />
                <IconButton
                  size="small"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  style={{ verticalAlign: 'top' }}
                >
                  <i className="fas fa-chevron-circle-down" />
                  {/* <AccountCircle /> */}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  style={{ marginTop: '10px' }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => navigate('/user/account/profile')}>
                    Mi Perfil
                  </MenuItem>
                  {/* <MenuItem onClick={() => navigate('/user/account/edit')}>
                    Editar Perfil
                  </MenuItem> */}
                  <MenuItem onClick={handleCloseSession}>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
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
