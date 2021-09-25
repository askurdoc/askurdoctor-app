import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import { getProfile } from '../../../services/user.service';
import { isAuthenticated, updatePassword } from '../../../services/auth.service';
import { get, create, update } from '../../../services/qualification.service';
import Notiflix from 'notiflix';
export default function Profile(props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qualification, setQualification] = useState(null);
  const [profile, setProfile] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const createRecord = async (data) => {
    setIsSubmitting(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await create(data);
      if (response.status === 201 && response.data.msg) {
        getQualification();
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

  const getInfo = async () => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getProfile();
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
    const user = new isAuthenticated();
    getInfo();
  }, []);

  const passwordCondition = (iText) => {
    // if there is no value in input return true, input is VALID
    if (!iText) {
      return true;
    }

    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    if (passw.test(iText)) {
      return true;
    } else {
      return false;
    }
    // in any other case return false, input is INVALID
    return false;
  };

  const onSubmit = async (data) => {
    if(data.newPassword !== data.retypePassword){
      Notiflix.Notify.warning('New Password is not same as retype password"');
      return false;
    }
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await updatePassword(data);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
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
  }

  return (
    <SideMenuLayout title="Profile">
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
                        <a
                          href="/profile/users/edit"
                          className="btn btn-primary btn-sm text-white"
                        >
                          Edit
                        </a>
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
            <div className="col-xl-6">
              <div className="card">
                <div className="card-body">
                  <div className="profile-tab">
                    <div className="custom-tab-1">
                      <div
                        id="profile-settings"
                        className="tab-pane fade active show"
                      >
                        <div className="pt-3">
                          <h4 className="text-primary">Security Setting</h4>
                          <div className="settings-form">
                            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                              <div className="form-row">
                                <div className="form-group col-md-12">
                                  <label>Current Password</label>
                                  <input
                                    type="password"
                                    autocomplete="off"
                                    placeholder="Current Password"
                                    className="form-control"
                                    {...register('oldPassword', {
                                      required: true,
                                      validate: { passwordCondition },
                                    })}
                                  />
                                </div>
                                <div className="form-group col-md-12">
                                  <label>New Password</label>
                                  <input
                                    type="password"
                                    autocomplete="off"
                                    placeholder="New Password"
                                    className="form-control"
                                    {...register('newPassword', {
                                      required: true,
                                      validate: { passwordCondition },
                                    })}
                                  />
                                </div>
                                <div className="form-group col-md-12">
                                  <label>Retype New Password</label>
                                  <input
                                    type="password"
                                    autocomplete="off"
                                    placeholder="Retype New Password"
                                    className="form-control"
                                    {...register('retypePassword', {
                                      required: true,
                                      validate: { passwordCondition },
                                    })}
                                  />
                                </div>
                              </div>

                              <button className="btn btn-primary" type="submit">
                                Update Password
                              </button>
                            </form>
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
