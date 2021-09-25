import React from 'react';

export default function Footer() {
  return (
    <>
       <div className="footer np-printme">
            <div className="copyright no-printme">
                <p>Copyright © {new Date().getFullYear()}{' '} <a href="https://askurdoctor.com" target="_blank">askurdoctor</a> <br />Designed &amp; Developed by <a href="https://higglerslab.com/" target="_blank">Higglerslab</a></p>
                <br />
                <p>For queries and support, email at <a href = "mailto: support@askurdoctor.com">support@askurdoctor.com</a></p>
            </div>
        </div>
      </>
  );
}
