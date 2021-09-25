import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import SideMenuLayout from '../../../layouts/SideMenuLayout';
import Appointment from '../../../components/Appointment';
import Schedule from '../../../components/Schedule';
import { getAllDoctors } from '../../../services/doctors.service';
import { getAllPatients } from '../../../services/patients.service';
import { createAppointment } from '../../../services/appointment.service';
import { getConfig } from '../../../services/config.service';
import Notiflix from 'notiflix';
import _ from 'lodash';

export default function appointment(props) {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [config, setConfig] = useState({});
  const [date, setDate] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [patientId, setPatientId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const monthShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const allDocs = getAllDoctors();
      const allPatients = getAllPatients();
      const config =  getConfig();
      const response = await Promise.all([allDocs, allPatients, config]);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (
        response.length == 3 &&
        response[0].data.data &&
        response[1].data.response &&
        response[2].data.data
      ) {
        setDoctors(response[0].data.data);
        setPatients(response[1].data.response);
        setConfig(response[2].data.data);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No doctor/patients detail available');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const book = async (payload) => {
    const date = new Date(payload.date);
    const day = date.getUTCDate();
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const dt = `${day} ${monthShort[month]} ${year}`;
    const data = {};
    data.doctorId = doctorId;
    data.patientId = patientId;
    data.schedule = {
      time: payload.slot.time,
      date: dt,
    };

    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await createAppointment(data);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        Notiflix.Report.success(
          'Appointment Booking',
          'Your booking is successful. Please join the online consultation session, 15 mins before your schedule.',
          'Close',
          'Click',
        );
      } else {
        // Notiflix.Notify.warning(response.data.error);
        Notiflix.Report.failure(
          'Appointment Booking',
          response.data.error,
          'Close',
          'Click',
        );
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const callBack = (data) => {
    console.log(data);
    const keyBy = _.keyBy(doctors, 'doctorId');
    const schedule = keyBy[data.doctors];
    setDate(data.date);
    setSchedule(schedule);
    if (data && data.patients) setPatientId(data.patients);
    if (schedule && schedule.doctorId) setDoctorId(schedule.doctorId);
  };

  useEffect(() => {
    console.log('hi');
    init();
  }, [props.state]);

  return (
    <SideMenuLayout title="Appointments">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-4">
              {!isLoading ? (
                <Appointment
                  doctors={doctors}
                  patients={patients}
                  callBack={callBack}
                />
              ) : (
                <>Loading...</>
              )}
            </div>
            <div className="col-xl-8">
              <Schedule
                schedule={schedule}
                doctorId={doctorId}
                config = {config}
                date={date}
                callBack={book}
              />
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
