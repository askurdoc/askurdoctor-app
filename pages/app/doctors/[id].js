import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import { getProfileById } from '../../../services/user.service';
import { getById, processRequest } from '../../../services/qualification.service';
import { getDoctorById } from '../../../services/doctors.service';
import Notiflix from 'notiflix';
export default function Profile(props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState(false);
  const [qualification, setQualification] = useState(null);
  const [profile, setProfile] = useState(null);
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const getQualification = async () => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getById(id);
      console.log(response);
      if (response.data && response.data.data) {
        setQualification(response.data.data);
      } else {
      }
    } catch (e) {
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      Notiflix.Loading.remove();
      setIsSubmitting(false);
    }
  };

  const fetchData = async () => {
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const response = await getDoctorById(id, true);
      Notiflix.Loading.remove();
      if (response.data && response.data.data) {
        if(response.data.data.length>0){
          setBooking(true);
        } else {
          setBooking(false);
        }
      } else {
        Notiflix.Notify.warning(
          'No doctor detail available',
        );
      }
    } catch (e) {
      console.log(e)
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.message);
    }
  };

  const getInfo = async () => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getProfileById(id);
      if (response.data && response.data.userId) {
        setProfile(response.data);
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Complete');
      }
    } catch (e) {
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      Notiflix.Loading.remove();
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log('hi');
    getQualification();
    getInfo();
    fetchData();
  }, []);

  const bookAppointment = () => {
    const path = `/app/appointments/${id}`
    router.push({
      pathname: path,
    });
  }

  const submitFeedback = async (data) => {

    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await processRequest(id, { isVerified: data });
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        const path = `/home/admin`;
        router.push({
          pathname: path,
        });
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Complete');
      }
    } catch (e) {
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      Notiflix.Loading.remove();
      setIsSubmitting(false);
    }
  };

  const loadFileList = () => {
    return qualification.files.map((item, i) => {
      console.log(item);
      return (
        <li
          key={i}
          className="list-group-item d-flex px-0 justify-content-between"
        >
          {item && item.url ? (
            <>
              <strong>
                <a href={item.url} target="_blank">
                  View File
                </a>
              </strong>
              <span className="mb-0">{item.fileId}</span>
            </>
          ) : null}
        </li>
      );
    });
  };

  return (
    <SideMenuLayout title="Approval Request">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="profile card card-body px-3 pt-3 pb-0">
                <div className="profile-head">
                  <div className="profile-info">
                    <div className="profile-photo">
                      <img
                        src="images/profile/profile.png"
                        className="img-fluid rounded-circle"
                        alt=""
                      />
                    </div>
                    <div className="profile-details">
                      <div className="profile-name px-3 pt-2">
                        {profile ? (
                          <h4 className="text-primary mb-0">
                            {profile.firstName} {profile.lastName}
                          </h4>
                        ) : null}
                        {qualification && qualification.specialization ? (
                          <p>{qualification.specialization}</p>
                        ) : null}
                      </div>
                      <div className="profile-email px-2 pt-2">
                        {profile && profile.email ? (
                          <h4 className="text-muted mb-0">{profile.email}</h4>
                        ) : null}
                      </div>
                      <div className="ml-auto ">
                       {booking?  <a
                          onClick={(e) => {
                            bookAppointment()
                          }}
                          className="btn btn-success btn-sm text-white"
                        >
                          Book Appointment
                        </a>: <>Doctor havent created his/her consultation schedule, <br />Booking option will be enabled once the doctor submitted the schedule
                        </>}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6">
              <div className="card">
                <div className="card-body">
                  <div className="profile-tab">
                    <div className="custom-tab-1">
                      <div id="about-me">
                        {qualification ? (
                          <>
                            <div className="profile-about-me">
                              <div className="pt-4 border-bottom-1 pb-3">
                                <div className="row">
                                  <div className="col-xl-6">
                                    <h4 className="text-primary">About Me</h4>
                                  </div>
                                </div>

                                <p className="mb-2">{qualification.aboutMe}</p>
                              </div>
                            </div>
                            <div className="profile-skills mb-5">
                              <h4 className="text-primary mb-2">
                                Specialization
                              </h4>
                              {qualification.specialization ? (
                                <a className="btn btn-primary text-white btn-xs mb-1">
                                  {qualification.specialization}
                                </a>
                              ) : null}
                            </div>
                            <div className="profile-skills mb-5">
                              <h4 className="text-primary mb-2">
                                Registration Detail
                              </h4>
                              {qualification.registration ? (
                                <a className="btn btn-primary text-white btn-xs mb-1">
                                  {qualification.registration}
                                </a>
                              ) : null}
                            </div>
                            <div className="profile-lang  mb-5">
                              <h4 className="text-primary mb-2">Degree</h4>

                              {qualification.degree ? (
                                <a className="text-muted pr-3 f-s-16">
                                  {qualification.degree}{' '}
                                </a>
                              ) : null}
                            </div>
                          </>
                        ) : null}
                        {profile ? (
                          <div className="profile-personal-info">
                            <h4 className="text-primary mb-4">
                              Personal Information
                            </h4>
                            <div className="row mb-2">
                              <div className="col-sm-3 col-5">
                                <h5 className="f-w-500">
                                  Name <span className="pull-right">:</span>
                                </h5>
                              </div>
                              <div className="col-sm-9 col-7">
                                <span>
                                  {profile.firstName} {profile.lastName}
                                </span>
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-sm-3 col-5">
                                <h5 className="f-w-500">
                                  Email <span className="pull-right">:</span>
                                </h5>
                              </div>
                              <div className="col-sm-9 col-7">
                                <span>{profile.email}</span>
                              </div>
                            </div>

                            <div className="row mb-2">
                              <div className="col-sm-3 col-5">
                                <h5 className="f-w-500">
                                  Gender <span className="pull-right">:</span>
                                </h5>
                              </div>
                              <div className="col-sm-9 col-7">
                                <span>{profile.gender}</span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 hide">
              <div className="card">
                <div className="card-body">
                  <div className="profile-tab">
                    <div className="custom-tab-1">
                      <div
                        id="profile-settings"
                        className="tab-pane fade active show"
                      >
                        <div className="pt-3">
                          <h4 className="text-primary">Appointment Schedule</h4>
                          <div className="settings-form">
                            <ul className="list-group list-group-flush">

                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
