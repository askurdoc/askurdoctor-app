import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Notiflix from 'notiflix';
import fullLogo from '../../public/images/logo-text.png';
import defaultProfile from '../../public/images/default_profile_pic.jpeg';
import { isAuthenticated } from '../../services/auth.service';
import { profile } from '../../services/profile.service';
import { APP_CONFIG } from '../../config/constants';
// components

export default function HeaderStats(props) {
  const [user, setUser] = useState({});
  const [type, setType] = useState(null);
  const [profileInfo, setProfile] = useState(null);
  const router = useRouter();
  const [show, setShow] = useState(false);

  const showDropDown = () => {
    setShow(!show);
  };

  const { error, data, isLoading } = profile();
  if (error) {

  }


  useEffect(() => {
    const user = isAuthenticated();
    setUser(user);
    if (user.role.indexOf('VISITORS') > -1) {
      setType('User');
    } else if (user.role.indexOf('DOCTORS') > -1) {
      setType('Doctor');
    }


  }, []);



  const loadProfile =  () => {
    if (!isLoading) {
      if (!data || !data.profileImage) {
        return defaultProfile;
      }
      return data.profileImage;
    }
    return defaultProfile;
  };

  return (
    <>
      {/* Header */}
      <div className="no-printme nav-header">
        <a className="brand-logo text-primary">
          <h3 className="brand-title text-primary text-bold">
            {' '}
            {APP_CONFIG.name}
          </h3>

          <h3 className="logo-abbr text-primary text-bold">
            {' '}
            AUD
          </h3>
          <h3 className="logo-compact text-primary text-bold">
            {' '}
            {APP_CONFIG.name}
          </h3>
        </a>

        <div className="nav-control">
          <div className="hamburger" onClick={props.callBack}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
      </div>
      <div className="no-printme header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="dashboard_bar">{props.title}</div>
              </div>

              <ul className="navbar-nav header-right">
                <li className="nav-item dropdown notification_dropdown hide">
                  <a className="nav-link dz-fullscreen" href="#">
                    {/* <svg id="icon-full" viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" className="css-i6dzq1"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                                    <svg id="icon-minimize" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-minimize"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg> */}
                  </a>
                </li>
                <li className="nav-item dropdown notification_dropdown hide">
                  <a className="nav-link bell bell-link" href="#">
                    <i className="flaticon-381-pad"></i>
                  </a>
                </li>
                <li className="nav-item dropdown notification_dropdown hide">
                  <a
                    className="nav-link  ai-icon"
                    href="#"
                    role="button"
                    data-toggle="dropdown"
                  >
                    <i className="flaticon-381-ring"></i>
                    <div className="pulse-css"></div>
                  </a>
                </li>
                <li
                  className={`nav-item dropdown header-profile ${show ? 'show' : ''
                    }`}
                >
                  <a
                    className="nav-link"
                    role="button"
                    data-toggle="dropdown"
                    onClick={showDropDown}
                  >
                    <div className="header-info">
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <small>{type}</small>
                    </div>
                    <img className="imageholder" src={loadProfile()} width="20" alt="" />
                  </a>
                  <div
                    className={`dropdown-menu dropdown-menu-right ${show ? 'show' : ''
                      }`}
                  >
                    {type == 'Doctor' ? (<a href="/profile/doctors" className="dropdown-item ai-icon">

                      <span className="ml-2">Profile </span>
                    </a>) : (<a href="/profile/users" className="dropdown-item ai-icon">

                      <span className="ml-2">Profile </span>
                    </a>)}

                    <a href="/" className="dropdown-item ai-icon">

                      <span className="ml-2">Logout </span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
