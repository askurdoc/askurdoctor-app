import React from 'react';

import Link from 'next/link';
import UserDropdown from '../Dropdowns/UserDropdown';

export default function AuthNavbar({ isBrand }) {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/app/dashboard">
              <img
                alt="..."
                style={{ width: '150px', height: '20px' }}
                className="align-middle border-none cursor-pointer h-auto rounded-lg mr-4 py-2"
                src={require('assets/img/logo.png')}
              />
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="text-white fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              'lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none'
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-wrap list-none md:justify-end  justify-center">
              <li>
                <Link href="/app/dashboard">
                  <span className="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3 cursor-pointer">
                    Home
                  </span>
                </Link>
              </li>
              {!isBrand && (
                <li>
                  <Link href="/app/accounts">
                    <span className="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3 cursor-pointer">
                      Accounts
                    </span>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/app/campaigns">
                  <span className="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3 cursor-pointer">
                    Campaigns
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/app/wallet">
                  <span className="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3 cursor-pointer">
                    Wallet
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>

      {/* End Navbar */}
    </>
  );
}
