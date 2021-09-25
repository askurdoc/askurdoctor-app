import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Notiflix from 'notiflix';
import { UserContext } from '../context/UserContext';
import { isAuthenticated } from '../services/auth.service';
import { get } from '../services/qualification.service';
import SideNavbar from '../components/Navbars/SideNavbar';
import HeaderStats from '../components/Headers/BrandHeaderStats.js';
import Footer from '../components/Footers/Footer';

export default function SideMenuLayout({ showCards, isBrand, children, title }) {
  const router = useRouter();
  const { checkAuth } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isQualified, setQualified] = useState(false);
  const [isDoctor, setDoctor] = useState(false);
  const [menuState, setMenuState] = useState(false);

  useEffect(() => {
    Notiflix.Loading.pulse('Loading...');
    if (!checkAuth()) {
      Notiflix.Loading.remove();
      return router.push('/');
    }
    setIsLoading(false);
    Notiflix.Loading.remove();
    const user = isAuthenticated();
    if (user.role.indexOf('DOCTORS') > -1) {
      setDoctor(true)
      checkQualified()
    }
  }, []);

  const checkQualified = async () => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await get();
      if (response.data && response.data.data) {
        if(response.data.data.isVerified !='APPROVED'){
          setQualified(false);
          return router.push('/profile/doctors/edit');
        } else {
          setQualified(true);
        }

      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Load');
      }
    } catch (e) {
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      Notiflix.Loading.remove();
    }
  }

  const clickback = (e) => {
    setMenuState(!menuState)
    console.log(menuState)
  }

  return (
    <>
      {isLoading ? null : (
        <div id="main-wrapper" className={`show relative bg-gray-200 minheight800 ${!menuState? 'menu-toggle': ''}`}>
          <SideNavbar isBrand={isBrand} isQualified={isQualified} isDoctor={isDoctor}/>
          {/* Header */}
          <HeaderStats cards={showCards} title={title} callBack={clickback}/>
          <div className="printme md:px-10 mx-auto w-full -m-24 mb-32">
            {children}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
