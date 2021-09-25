import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import { APP_CONFIG } from '../../config/constants';

import { getDateString } from '../../helpers/utils';

// import Printer, { print } from 'react-pdf-print';

export default function rx(props) {
  const listDrugs = () => {
    return props.data.drugs.map((item, i) => {
      return (
        <tr>
          <td className="text-center">{i + 1}</td>
          <td>
            <div className="row">
              <div className="col-lg-12 h5">{item.name}</div>
              <div className="col-lg-12 text-muted">
                <strong> Dosage: </strong> {item.quantity} {item.metric} <br />
                {item.phase.length} <strong>times a day</strong> [{' '}
                {item.phase.join(', ')} ]
              </div>
              <div className="col-lg-12 text-muted">{item.meal} Meal</div>
            </div>
          </td>
          <td className="text-right"> {item.totalValue}</td>
        </tr>
      );
    });
  };
  return (
    <div className="col-md-12">
      {/* <Printer> */}
      <div className="white-box">
        <h3>
          <b>Prescription</b>{' '}
          <span className="pull-right">{props.data.rxId}</span>
        </h3>
        <hr />
        <div className="row">
          <div className="pull-left col-sm-12 col-lg-6 col-md-6">
            <address>
              <h3 className="text-primary text-bold"> {APP_CONFIG.name}</h3>
              <p className="text-muted py-0">
                Online Doctor Consultation Platform
              </p>

              <p className="font-bold text-black">
                Doctor Name:{' '}
                <strong>
                  Dr {props.data.doctor.firstName} {props.data.doctor.lastName}
                </strong>
              </p>
              <p className="font-bold text-black">
                Speciality:{' '}
                <strong>
                  {props.data.qualification.degree}{' '}
                  {props.data.qualification.specialization}
                </strong>
                <br />
                Registration Number:{' '}
                <strong>{props.data.qualification.registration}</strong>
              </p>
              <p className="font-bold text-black">
                Teleconsultation Reference: {' '}
                <strong>{props.data.appointmentId}</strong>
                <br />
                <small>(This Consultation is done via Teleconsultation website
                askurdoctor.com)</small>
              </p>
            </address>
          </div>
          <div className="pull-right col-sm-12 col-lg-6 text-right">
            <address>
              {/* <p className="addr-font-h3">To,</p> */}
              <p className="font-bold addr-font-h4">
                {props.data.patient.firstName} {props.data.patient.lastName}
              </p>
              {props.data.patient.address ? (
                <p className="text-muted m-l-30">
                  207, Prem Sagar Appt., <br /> Near Income Tax Office, <br />
                  Ashram Road, <br /> Ahmedabad - 380057
                </p>
              ) : null}
              <p className="m-t-30">
                <b>Prescription Date :</b> {getDateString(props.data.createdAt)}
              </p>
            </address>
          </div>

          <div className="col-md-12 mt-5">
            <h1>
              <span>&#8478;</span>
            </h1>
            <div className="table-responsive m-t-40">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th>Drug Name</th>
                    <th className="text-right">Total Quantity</th>
                  </tr>
                </thead>
                <tbody>{listDrugs()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* </Printer> */}
    </div>
  );
}
