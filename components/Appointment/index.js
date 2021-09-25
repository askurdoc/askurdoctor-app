import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
// import BookingWidget from './BookingWidget/BookingWidget';
// import BookingForm from './BookingForm/BookingForm';
// import PageLoader from './PageLoader/PageLoader';
// import bookingService from '../../lib/services/booking.service';
import DayPicker from 'react-day-picker';
import Notiflix from 'notiflix';
import './appointment.css';

export default function appointment(props) {
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState(false);
  const [isPSingle, setPSingle] = useState(false);
  const [isDSingle, setDSingle] = useState(false);
  const [disclaimer, setDisclaimer] = useState(false);
  const router = useRouter();
  const today = new Date();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleDayClick = (day) => {
    setDate(day);
    // fetchBooking(day);
  };

  useEffect(() => {
    console.log('hi');
    console.log(props.doctors.length);
    if (props.doctors.length == 1) {
      setDSingle(true);
      console.log(props.doctors[0]);
    }
    if (props.patients.length == 1) {
      setPSingle(true);
    }
    init();
  }, [props.doctors, props.patients]);

  const init = () => {
    setStatus('render');
  };

  const onSubmit = (data) => {
    const obj = {};
    obj.date = date;
    if (isDSingle) {
      obj.doctors = props.doctors[0].doctorId
    } else {
      obj.doctors = data.doctors
    }
    if (isPSingle) {
      obj.patients = props.patients[0].patientId
    } else {
      obj.patients = data.patients
    }
    if (obj.doctors == 'select' || obj.patients == 'select') {
      Notiflix.Notify.failure(
        'Please select both doctor and patient from the list',
      );

      return false;
    }

    props.callBack(obj);
  };

  const showDisclaimer = (e) => {
    setDisclaimer(!disclaimer)
  }

  const doctorOptions = () => {
    let optionTemplate = props.doctors.map((v) => (
      <option value={v.doctorId}>
        Dr {v.detail.firstName} {v.detail.lastName}
      </option>
    ));
    return optionTemplate;
  };

  const patientOptions = () => {
    let optionTemplate = props.patients.map((v) => (
      <option value={v.patientId}>
        {v.firstName} {v.lastName}
      </option>
    ));
    return optionTemplate;
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6 col-xl-12">
          <div className="card baseColor">
            <div className="card-header border-0 pb-0 justify-content-center">
              <h4 className="card-title text-black text-center">Appointment Schedule </h4>
              <br />
            </div>
            <div className="card-body patient-calender text-center  pb-2">
            <div className="text-center text-danger" style={{width:"100%"}}>
                Disclaimer  <a class="hover" onClick={showDisclaimer}><i class="fas fa-info-circle"></i></a>
                {disclaimer ? <div class="disclaimerBox">
                  <ol class="olList">
                    <li> Tele-consult has been initiated at your request. You have voluntarily approached for availing the service.</li>
                    <li> Doctor’s advice is given on your request and is based on the symptoms, medical condition and allergies that you have provided over the tele-consult. It is not a legal advice.</li>
                    <li> Tele-consult is not intended to substitute a physical examination by a Doctor at his/her clinic/hospital. If you do not notice any improvement, for further management kindly visit the doctor at Clinic/Hospital.</li>
                    <li> All reasonable care is taken while rendering tele consult based on information provided by you. Doctor and or our askURdoctor owners/admins will not be liable or responsible based on Tele Consult for any negligence, act or omission for reason of any false of fraudulent misstatement, misrepresentation, incomplete or in appropriate profile disclosures or otherwise.</li>

                  </ol>
                  <p > Regards,<br />
                    askURdoctor</p>

                </div> : null} </div>
                <br />
               <div className="lead text-center" style={{width:"100%"}}>
                <small className="text-black">
                  <span className="text-danger">Please note: </span><br /> schedule has to be made atleast 2 hours earlier.
                </small>
              </div>
              <br />
              <form onSubmit={handleSubmit(onSubmit)}>
                {!isDSingle ? (
                  <div className="form-group">
                    <select
                      className="form-control"
                      id="inlineFormCustomSelect"
                      {...register('doctors', { required: true })}
                    >
                      <option value="select" selected>
                        Choose Doctor
                      </option>
                      {doctorOptions()}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="mb-1  text-muted">
                      <strong>Doctor Name</strong>
                    </label>
                    {props.doctors[0] ? (
                      <h3 class=" mb-1">
                        Dr {props.doctors[0].detail.firstName}{' '}
                        {props.doctors[0].detail.lastName}
                      </h3>
                    ) : null}
                  </div>
                )}
                {!isPSingle ? (
                  <div className="form-group">
                    <select
                      className="form-control"
                      id="inlineFormCustomSelect"
                      {...register('patients', { required: true })}
                    >
                      <option value="select" selected>
                        Choose Patient
                      </option>
                      {patientOptions()}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="mb-1  text-muted">
                      <strong>Patient Name</strong>
                    </label>
                    <h3 class=" mb-1">
                      {props.patients[0].firstName} {props.patients[0].lastName}
                    </h3>
                  </div>
                )}
                <div className="form-group text-black">
                  <DayPicker
                    onDayClick={handleDayClick}
                    selectedDays={date}
                    disabledDays={{ before: today }}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-danger btn-block"
                    disabled={date == null}
                  >
                    Fetch Schedule
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
