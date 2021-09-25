import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import SideMenuLayout from '../../../layouts/SideMenuLayout';
import Appointment from '../../../components/Appointment';
import Schedule from '../../../components/Schedule';
import { getDoctorById } from '../../../services/doctors.service';
import { getConfig } from '../../../services/config.service';
import {
  getAllPatients,
  getPatientById,
} from '../../../services/patients.service';
import {
  createAppointment,
  createFollowUPAppointment,
  getAppointmentById,
} from '../../../services/appointment.service';
import Notiflix from 'notiflix';
import _ from 'lodash';

export default function appointment(props) {
  const router = useRouter();
  const [appointment, setAppointment] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [config, setConfig] = useState({});
  const [patients, setPatients] = useState([]);
  const [date, setDate] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [patientId, setPatientId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id, appointmentId } = router.query;
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

  const defaultInit = () => {
    fetchData(id, null);
  };
  const fetchData = async (doctorId, patientId) => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const getDoctor = getDoctorById(doctorId, true);
      let getPatients;
      let isById = false;
      if (patientId) {
        getPatients = getPatientById(patientId);
        isById = true;
      } else {
        getPatients = getAllPatients();
        isById = false;
      }

      const config =  getConfig();
      const response = await Promise.all([getDoctor, getPatients, config]);
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
        Notiflix.Notify.warning(
          'No doctor/patients detail available',
        );
      }
    } catch (e) {
      console.log(e)
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.message);
    }
  };

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const response = await getAppointmentById(appointmentId);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setAppointment(response.data.data);
        console.log(response.data.data.doctorId);
        fetchData(response.data.data.doctorId, response.data.data.patientId);
      } else {
        Notiflix.Notify.warning(
          response.data.error || 'No appointment detail available',
        );
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
      let response;
      if (appointment.status == 'REQUIRED_FOLLOW_UP') {
        data.previousAppointmentId = appointment.appointmentId
        response = await createFollowUPAppointment(data);
      } else {
        response = await createAppointment(data);
      }

      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
      } else {
        Notiflix.Notify.warning(response.data.error);
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
    if (appointmentId && id) {
      init();
    } else if (id) {
      defaultInit();
    } else {
      console.log('params error');
    }
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
                  appointment={appointment}
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
                state={appointment.status}
                callBack={book}
              />
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
