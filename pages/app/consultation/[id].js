import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import MobileNumber from '../../../components/MobileNumber';
import Schedule from '../../../components/Schedule';
import { isAuthenticated } from '../../../services/auth.service';
import {
  getAppointmentById,
  updateAppointment,
  refundAppointment,
} from '../../../services/appointment.service';
import { getNotes, createNotes } from '../../../services/notes.service';
import { createToken, createRoom } from '../../../services/videoCall.service';
import { processDateTime } from '.././../../helpers/utils';
import Notiflix from 'notiflix';
import _ from 'lodash';

export default function consulation(props) {
  const [appointment, setAppointment] = useState({});
  const [isDoctor, setIsDoc] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContact, setContactState] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const response = await getAppointmentById(id);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setAppointment(response.data.data);
        if (response.data.data.mobileNo)
          setContactState(response.data.data.mobileNo);
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

  const generateToken = async (e) => {
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    const data = {
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentId: appointment.appointmentId,
      schedule: appointment.schedule,
    };
    try {
      if (!appointment.roomName) {
        let roomName;
        console.log('consultation');
        const response = await createRoom({
          appointmentId: appointment.appointmentId,
        });
        Notiflix.Loading.remove();
        setIsLoading(false);
        if (response.data && response.data.id) {
          roomName = response.data.name;
          let path;
          if (isDoctor) {
            path = `/app/video/doctor/${id}`;
          }
          if (isPatient) {
            path = `/app/video/patient/${id}`;
          }
          router.push({
            pathname: path,
            query: { userId: appointment.userId, room: roomName },
          });
        } else {
          Notiflix.Notify.warning('No appointment detail available');
        }
      } else {
        let path;
        if (isDoctor) {
          path = `/app/video/doctor/${id}`;
        }
        if (isPatient) {
          path = `/app/video/patient/${id}`;
        }
        router.push({
          pathname: path,
          query: { userId: appointment.userId, room: appointment.roomName },
        });
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const refresh = async () => {
    init()
  }

  const decline = async (e) => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await refundAppointment(id, { status: "REJECT" });
      Notiflix.Loading.remove();
      if (response && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        const path = `/home/doctors`;
        router.push({
          pathname: path
        });
      } else {
        Notiflix.Notify.warning('Failed to decline');
      }
    } catch (e) {
      Notiflix.Loading.remove();
    }
  };

  const cancel = async (e) => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await refundAppointment(id, { status: "CANCEL" });
      Notiflix.Loading.remove();
      if (response && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        const path = `/home/visitors`;
        router.push({
          pathname: path
        });
      } else {
        Notiflix.Notify.warning('Failed to decline');
      }
    } catch (e) {
      Notiflix.Loading.remove();
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await updateAppointment(id, { mobileNo: data });
      Notiflix.Loading.remove();
      if (response && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        init()
      } else {
        Notiflix.Notify.warning('No note detail available');
      }
    } catch (e) {
      Notiflix.Loading.remove();
    }
  };

  useEffect(() => {
    console.log('hi');
    const user = isAuthenticated();
    if (user.role.indexOf('DOCTORS') > -1) {
      setIsDoc(true);
    } else if (user.role.indexOf('VISITORS') > -1) {
      setIsPatient(true);
    }
    init();
  }, []);

  const patientVisit = (id) => {
    const path = `/app/patients/${id}`;
    router.push({
      pathname: path,
    });
  }

  return (
    <SideMenuLayout title="Doctor Consultation">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            {Object.keys(appointment).length > 0 ? (
              <>
                <div className="col-xl-8">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex doctor-info-details mb-sm-5 mb-3">
                            <div className="media align-self-start">
                              <i className="flaticon-381-heart"></i>
                            </div>
                            <div className="col-lg-10">
                              <h2 className="mb-2">
                                Appointment with{' '}
                                {isDoctor ? <a onClick={(e) => {
                                  patientVisit(appointment.patientDetail.patientId)
                                }}>{appointment.patientDetail.firstName}{' '}
                                  {appointment.patientDetail.lastName}</a> : <a onClick={(e) => {
                                    patientVisit(appointment)
                                  }}>{appointment.docDetail.firstName}{' '}
                                  {appointment.docDetail.lastName}</a>
                                }

                              </h2>
                              {/* <p className="mb-md-2 mb-4">#P-00016</p> */}
                              <span className="mb-md-0 mb-3 d-block">
                                <i className="flaticon-381-clock"></i> Date{' '}
                                {processDateTime(appointment.schedule)}
                              </span>
                            </div>
                            <div className="col-lg-2">
                              <div className="dropdown mb-md-3 mb-2">
                                <a
                                  className="btn btn-success text-white"
                                  data-toggle="dropdown"
                                  onClick={refresh}
                                >
                                  <span>Refresh </span>
                                </a>
                              </div>
                              {appointment.enablevideoCall ? (
                                <div className="dropdown mb-md-3 mb-2">
                                  <a
                                    className="btn btn-primary text-white"
                                    data-toggle="dropdown"
                                    onClick={generateToken}
                                  >
                                    <i className="flaticon-381-video-camera mr-2"></i>
                                    <span>Start </span>
                                  </a>
                                </div>
                              ) : null}
                              {appointment.status !== "FOLLOW_UP" ? <> {isDoctor ? (
                                <div className="dropdown mb-md-3 mb-2">
                                  <a
                                    className="btn btn-danger text-white"
                                    data-toggle="dropdown"
                                    onClick={decline}
                                  >
                                    <span>Decline </span>
                                  </a>
                                </div>
                              ) : (
                                <div className="dropdown mb-md-3 mb-2">
                                  <a
                                    className="btn btn-danger text-white"
                                    data-toggle="dropdown"
                                    onClick={cancel}
                                  >
                                    <span>Cancel </span>
                                  </a>
                                </div>
                              )}</> : null}
                              <div className="star-review hide">
                                <i className="fa fa-star text-orange"></i>
                                <i className="fa fa-star text-orange"></i>
                                <i className="fa fa-star text-orange"></i>
                                <i className="fa fa-star text-orange"></i>
                                <i className="fa fa-star text-gray"></i>
                                <span className="ml-3">238 reviews</span>
                              </div>
                            </div>
                          </div>
                          <div className="doctor-info-content mx-5 mb-3">
                            <div className="row">
                              <div className="col-md-6">
                                {!isContact && !isDoctor ? (
                                  <>
                                    <h5 className="text-black mb-3">
                                      Please update your mobile number to get
                                      notified about the appointment related
                                      notifications.
                                    </h5>

                                    <MobileNumber callBack={onSubmit} />
                                  </>
                                ) : (
                                  <>
                                    <h5 className="text-black mb-3">
                                      Patients Contact No
                                    </h5>

                                    {appointment.mobileNo ? (
                                      <p>{appointment.mobileNo}</p>
                                    ) : (
                                      <p>No mobile number found</p>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="col-md-6">
                                <p className="mb-2"></p>
                              </div>
                            </div>
                          </div>

                          <div className="doctor-info-content hide">
                            <h3 className="text-black mb-3">
                              Story About Disease
                            </h3>
                            <p className="mb-3">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris nisi ut
                              aliquip ex ea commodo consequat. Duis aute irure
                              dolor in reprehenderit in voluptate velit esse
                              cillum dolore eu fugiat nulla pariatur. Excepteur
                              sint occaecat cupidatat non proident, sunt in
                              culpa qui officia deserunt mollit anim id est
                              laborum
                            </p>
                            <p className="mb-2">
                              Sed ut perspiciatis unde omnis iste natus error
                              sit voluptatem accusantium doloremque laudantium,
                              totam rem aperiam, eaque ipsa quae ab illo
                              inventore veritatis et quasi architecto beatae
                              vitae dicta sunt explicabo. Nemo enim ipsam
                              voluptatem quia voluptas sit aspernatur aut odit
                              aut fugit, sed quia consequuntur magni dolores eos
                              qui ratione voluptatem sequi nesciunt. Neque porro
                              quisquam est, qui dolorem ipsum quia dolor sit
                              amet, consectetur, adipisci velit, sed quia non
                              numquam eius modi{' '}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="iconbox">
                            <i className="flaticon-381-user-7 mr-2"></i>
                            <small>Patient</small>
                            <p>
                              {appointment.patientDetail.firstName}{' '}
                              {appointment.patientDetail.lastName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="iconbox mb-2">
                            <i className="las la-phone"></i>
                            <small>Age</small>
                            <p>
                              {appointment.patientDetail.details
                                && appointment.patientDetail.details.age
                                ? appointment.patientDetail.details.age
                                : 'Not Available'}
                            </p>
                          </div>
                          <div className="iconbox mb-2">
                            <small>Height</small>
                            <p>
                              {appointment.patientDetail.details && appointment.patientDetail.details.height
                                ? appointment.patientDetail.details.height
                                : 'Not Available'}
                            </p>
                          </div>
                          <div className="iconbox mb-2">
                            <small>Weight</small>
                            <p>
                              {appointment.patientDetail.details && appointment.patientDetail.details.weight
                                ? appointment.patientDetail.details.weight
                                : 'Not Available'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 hide">
                      <div className="card">
                        <div className="card-body">
                          <div className="iconbox">
                            <i className="las la-envelope-open"></i>
                            <small>Email</small>
                            <p>example@mail.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 hide">
                      <div className="card bg-secondary">
                        <div className="card-header border-0 pb-0">
                          <h4 className="card-title text-white mt-1">
                            Note for Patient
                          </h4>
                        </div>
                        <div className="card-body text-white">
                          <p className="mb-0 fs-14">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
