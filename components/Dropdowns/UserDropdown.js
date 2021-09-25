import React, { useContext } from 'react';
import { createPopper } from '@popperjs/core';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';

const UserDropdown = () => {
  const { logout } = useContext(UserContext);
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom-start',
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-gray-600 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-gray-300 inline-flex items-center justify-center rounded-full">
            <img
              alt="..."
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={require('assets/img/team-1-800x800.jpg')}
            />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          'bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48'
        }
      >
        <span
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800 cursor-pointer'
          }
          onClick={(e) => e.preventDefault()}
        >
          <Link href="/app/profile">Profile</Link>
        </span>
        <span
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800 cursor-pointer'
          }
          onClick={(e) => e.preventDefault()}
        >
          <Link href="/app/settings">Settings</Link>
        </span>
        <div className="h-0 my-2 border border-solid border-gray-200" />
        <span
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800 cursor-pointer'
          }
          onClick={(e) => logout()}
        >
          Logout
        </span>
      </div>
    </>
  );
};

export default UserDropdown;
