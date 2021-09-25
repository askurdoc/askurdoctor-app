import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import UserDropdown from '../Dropdowns/UserDropdown';
import useWindowDimensions from '../../components/window/';
import { getWindowDimensions } from '../../helpers/utils';
import { isAuthenticated } from '../../services/auth.service';
import 'assets/styles/sideMenu.css';

export default function SideNavbar(props) {
  const [selected, setSelected] = useState(null);
  const [isDoc, setIsDoc] = useState(false);
  const [isVisitors, setIsVisitor] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  const menu = [
    'home',
    'doctors',
    'patients',
    'appointments',
    'prescriptions',
    'receipts',
    'wallet',
  ];

  const router = useRouter();

  useEffect(() => {
    const user = isAuthenticated();
    if (user.role.indexOf('DOCTORS') > -1) {
      setIsDoc(true);
    } else if (user.role.indexOf('VISITORS') > -1) {
      setIsVisitor(true);
    } else if (user.role.indexOf('ADMIN') > -1) {
      setAdmin(true);
    }
    menu.forEach((mn) => {
      if (router.pathname && router.pathname.indexOf(mn) > -1) {
        setSelected(mn);
      }
    });

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    console.log(windowDimensions.height);
  }, []);

  const trigger = (selection) => {
    setSelected(selection);
  };

  const mmState = (check) => {
    // if (check === selected) {
    //   return 'mm-active';
    // }
    return router.pathname.indexOf(check) > -1 || check === selected
      ? 'mm-active'
      : '';
  };
  const mmShow = (check) => {
    // if (check === selected) {
    //   return 'mm-show';
    // }
    return router.pathname.indexOf(check) > -1 || check === selected
      ? 'mm-show'
      : '';
  };

  const visitorMenu = () => {
    return (
      <ul className="metismenu" id="menu">
        <li className={`${mmState('home')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/home/visitors"
          >
            <i className="fas fa-home"></i>
            <span className="nav-text">Home</span>
          </a>
        </li>
        <li className={`${mmState('doctors')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/doctors"
          >
            <i className="fas fa-user-md"></i>
            <span className="nav-text">Doctors</span>
          </a>
        </li>
        <li className={`${mmState('patients')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/patients"
          >
            <i className="fas fa-user"></i>
            <span className="nav-text">Patient</span>
          </a>
        </li>
        <li className={`${mmState('appointments')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/appointments"
          >
            <i className="fas fa-calendar"></i>
            <span className="nav-text">Appointments</span>
          </a>
        </li>
        <li className={`${mmState('rx')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/rx"
          >
            <i className="fas fa-file-prescription"></i>
            <span className="nav-text">Prescriptions</span>
          </a>
        </li>
        <li className={`${mmState('receipts')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/receipts"
          >
            <i className="fas fa-receipt"></i>
            <span className="nav-text">Receipts</span>
          </a>
        </li>
        <li className={`${mmState('wallet')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/wallet"
          >
            <i className="fas fa-wallet"></i>
            <span className="nav-text">Wallet</span>
          </a>
        </li>
      </ul>
    );
  };

  const doctorsMenu = () => {
    if (props.isDoctor && props.isQualified) {
      return (
        <ul className="metismenu" id="menu">
          <li className={`${mmState('home')}`}>
            <a
              className=" ai-icon"
              aria-expanded="false"
              id="home"
              href="/home/doctors/"
            >
              <i className="fas fa-home"></i>
              <span className="nav-text">Home</span>
            </a>
          </li>
          <li className={`${mmState('schedule')}`}>
            <a
              className=" ai-icon"
              aria-expanded="false"
              id="home"
              href="/app/schedule"
            >
              <i className="flaticon-381-clock"></i>
              <span className="nav-text">My Schedule</span>
            </a>
          </li>
          <li className={`${mmState('patients')}`}>
            <a
              className=" ai-icon"
              aria-expanded="false"
              id="home"
              href="/app/patients"
            >
              <i className="fas fa-user"></i>
              <span className="nav-text">My Patients</span>
            </a>
          </li>
          <li className={`hide ${mmState('appointments')}`}>
            <a
              className=" ai-icon"
              aria-expanded="false"
              id="home"
              href="/app/appointments"
            >
              <i className="fas fa-calendar-check"></i>
              <span className="nav-text">My Today's Consulation</span>
            </a>
          </li>
          <li className={`${mmState('drugs')}`}>
            <a
              className=" ai-icon"
              aria-expanded="false"
              id="home"
              href="/app/drugs"
            >
              <i className="fas fa-pills"></i>
              <span className="nav-text">Drugs</span>
            </a>
          </li>
          <li className={`${mmState('wallet')}`}>
            <a
              className=" ai-icon"
              aria-expanded="false"
              id="home"
              href="/app/wallet"
            >
              <i className="fas fa-wallet"></i>
              <span className="nav-text">Wallet</span>
            </a>
          </li>
        </ul>
      );
    } else {
      return null;
    }
  };

  const adminMenu = () => {
    return (
      <ul className="metismenu" id="menu">
        <li className={`${mmState('home')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/home/admin/"
          >
            <i className="fas fa-home"></i>
            <span className="nav-text">Home</span>
          </a>
        </li>
        <li className={`${mmState('receipts')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/ledger"
          >
            <i className="fas fa-paper-plane"></i>
            <span className="nav-text">Withdrawal</span>
          </a>
        </li>
        <li className={`${mmState('rx')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/rx"
          >
            <i className="fas fa-file-prescription"></i>
            <span className="nav-text">Prescriptions</span>
          </a>
        </li>
        <li className={`${mmState('receipts')}`}>
          <a
            className=" ai-icon"
            aria-expanded="false"
            id="home"
            href="/app/receipts"
          >
            <i className="fas fa-receipt"></i>
            <span className="nav-text">Receipts</span>
          </a>
        </li>
      </ul>
    );
  };

  return (
    <>
      <div
        className="no-printme deznav"
        style={{ height: windowDimensions.height - 120 }}
      >
        <div className="deznav-scroll">
          {isVisitors ? visitorMenu() : null}
          {isDoc ? doctorsMenu() : null}
          {isAdmin ? adminMenu() : null}
        </div>
      </div>
    </>
  );
}
