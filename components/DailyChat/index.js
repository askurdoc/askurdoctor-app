import React, { useEffect, useState, useContext } from 'react';
import useWindowDimensions from '../window';
import permission from '../../public/images/permission.jpg';

import './index.css';
import Link from 'next/link';

export default function dailychat(props) {
  const [state, setState] = useState('INIT');
  const { height, width } = useWindowDimensions();

  useEffect(() => {}, []);
  const handleClick = () => {
    props.callBack()
    window.open(`https://askurdoctor.daily.co/${props.room}`, "_blank");
    self.focus();
  };

  return (
    <div className="col-xl-12">
      <div className="cam media-body">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="row  mt-5">
              <div className="col-lg-6">
                <h5>Step 1: </h5>
                <p>Please click join button to start the call</p>
              </div>
              <div className="col-lg-6">
                <h5>Step 2: </h5>
                <p>
                  Please enable the browser permission to acccess video and
                  microphone
                </p>
                <img
                  className="logo-abbr"
                  src={permission}
                  alt=""
                  width={300}
                />
              </div>
            </div>
            <div className="col-lg-12 p-5 mt-5">
              <button
                rel="noreferrer noopener"
                onClick={handleClick}
                target="_blank"
                className="btn btn-rounded btn-success tx"
              >
                <span className="btn-icon-left text-success">
                  <i className="fa fa-camera color-success"></i>
                </span>
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
