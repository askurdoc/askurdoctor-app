import React from 'react';
import Link from 'next/link';
import RegisterDropdown from '../Dropdowns/RegisterDropdown';

export default function BasicNavbar(props) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <header className="background-main-color">
        <div className="container">
          <div className="header-output">
            <div className="header-in">
              <div className="row">
                <div className="col-lg-2 col-md-12">
                  <a
                    id="logo"
                    href="index.html"
                    className="d-inline-block margin-tb-5px"
                  >
                    <img src="assets/img/logo-small.png" alt="" />
                  </a>
                  <a
                    className="mobile-toggle padding-13px background-main-color"
                    href="#"
                  >
                    <i className="fas fa-bars"></i>
                  </a>
                </div>
                <div className="col-lg-8 col-md-12 position-inherit">
                  <ul
                    id="menu-main"
                    className="white-link dropdown-dark text-lg-center nav-menu link-padding-tb-23px"
                  >
                    <li>
                      <a href="/">Home</a>
                    </li>
                   
                    <li className="has-dropdown">
                      <a href="#">Create Account</a>
                      <ul className="sub-menu text-left">
                        <li>
                          <a href="/auth/doctors/register">Doctors</a>
                        </li>
                        <li>
                          <a href="/auth/visitors/register">Visitors</a>
                        </li>
                        
                      </ul>
                    </li>
                   
                  </ul>
                </div>
                <div className="col-lg-2 col-md-12 d-none d-lg-block hide">
                  <hr className="margin-bottom-0px d-block d-sm-none" />
                  <a
                    href="add-recipe.html"
                    className="text-white ba-2 box-shadow float-right padding-lr-23px padding-tb-23px text-extra-large"
                  >
                    <i className="fas fa-plus"></i>
                  </a>
                  <a
                    href="/login"
                    className="text-white ba-1 box-shadow float-right padding-lr-23px padding-tb-23px text-extra-large"
                  >
                    <i className="far fa-user"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
