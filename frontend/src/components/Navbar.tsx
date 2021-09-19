import React from 'react';
import { useIsAuthenticated, useSignOut, useAuthUser } from 'react-auth-kit';
import { Link } from 'react-router-dom';
import picspyLogo from '../assets/PicSpyLogo.png';

// import './Navbar.css';

function Navbar() {
  const signOut = useSignOut();
  const isAuth = useIsAuthenticated();
  const getUserSession = useAuthUser();

  return (
    <nav className="t-4 max-h-16 h-16  bg-gray-600 grid grid-cols-10 gap-4 overflow-hidden shadow-sm border-b-2fixed w-full z-50 shadow-lg">
      <Link
        to="/"
        className="col-span-4 text-left  max-h-full font-sans text-3xl flex flex-row"
      >
        <img
          src={picspyLogo}
          className="max-h-full h-16 object-contain"
          alt="logo"
        />
        <span className="my-auto flex content-center">PicSpy</span>
      </Link>

      <div className="m-auto">
        {/* This is a test route and it will be replaced with real ones when the site is done  */}
        <Link to="/challenges" className="nav-links">
          <i className="fas fa-th-list pr-2" />
          Challenges
        </Link>
      </div>

      {isAuth() && (
        <div className="m-auto">
          <Link to="/series" className="nav-links">
            <i className="fas fa-list-ul pr-2" />
            Series
          </Link>
        </div>
      )}

      {isAuth() && (
        <div className="m-auto">
          <Link to="/create/challenge" className="nav-links">
            <i className="fas fa-plus pr-2" />
            Create challenge
          </Link>
        </div>
      )}

      {isAuth() && (
        <div className="m-auto">
          <Link to="/create/serie" className="nav-links">
            <i className="fas fa-plus pr-2" />
            Create series
          </Link>
        </div>
      )}

      {isAuth() && (
        <div className="m-auto">
          <Link to={`/profile/${getUserSession()?.sub}`} className="nav-links">
            <i className="fas fa-user pr-2" />
            My profile
          </Link>
        </div>
      )}

      {isAuth() ? (
        <div className="m-auto">
          <Link to="/" className="" onClick={(_) => signOut()}>
            <i className="fas fa-sign-out-alt pr-2" />
            Sign out
          </Link>
        </div>
      ) : (
        <div className="m-auto">
          <Link to="/sign-up" className="nav-links">
            <i className="fas fa-sign-in-alt pr-2" />
            Login or register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
