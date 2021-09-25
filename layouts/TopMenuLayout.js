import React from 'react';
import BasicNavbar from 'components/Navbars/BasicNavbar.js';
import FooterSmall from 'components/Footers/FooterSmall.js';

export default function TopMenuLayout({ children }) {
  return (
    <>
      <BasicNavbar transparent />
      <div className=" justify-content-center h-100 align-items-center">
        {children}
      </div>
      <FooterSmall absolute />
    </>
  );
}
