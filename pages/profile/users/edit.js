import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import Link from 'next/link';

import defaultProfile from '../../../public/images/default_profile_pic.jpeg';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import { getConfig } from '../../../services/config.service';
import ProfilePicture from '../../../components/ProfilePicture';
import { getProfile, updateProfile } from '../../../services/user.service';
import { get, update, submitRequest } from '../../../services/qualification.service';
import { upload } from '../../../services/resource.service';
import Notiflix from 'notiflix';

export default function EditProfile(props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qualification, setQualification] = useState({});
  const [profile, setProfile] = useState({});
  const [file, setFile] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectList = [
    'Anesthesiologists',
    'General Medicine',
    'General surgery',
    'Orthopaedic',
    'Obstetrics & Gynecologist',
    'ENT',
    'Pediatric',
    'Ophthalmology',
    'Anaesthesia',
    'Dermatologist',
    'Psychiatrist',
    'Nutritionist',
    'Speech therapist',
    'Psychologist',
    'Plastic surgeon',
    'Urologist',
    'Dentist',
  ];

  const onSubmit = async (data) => {
    const pList = ['firstName', 'lastName', 'email', 'gender'];
    const pData = {};

    Object.keys(data).forEach((item) => {
      if (pList.indexOf(item) > -1 && data[item] != '') {
        pData[item] = data[item];
      }
    });
    console.log(pData);
    try {
      Notiflix.Loading.pulse('Loading...');

      const response = await updateProfile(pData);
      if (response) {
        Notiflix.Loading.remove();
        Notiflix.Notify.success('successfully Updated');
      }
    } catch (e) {
      Notiflix.Notify.failure(e.response.data.message);
    }
  };


  const getInfo = async () => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getProfile();
      if (response.data && response.data.userId) {
        setProfile(response.data);
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to load');
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
    getInfo();
  }, []);

  const loadProfile =  () => {
    if (!isLoading) {
      if (!profile || !profile.profileImage) {
        return defaultProfile;
      }
      return profile.profileImage;
    }
    return defaultProfile;
  };


  const handleFileChange = () => (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0])
  };

  const uploadFile = async (file) => {

    const form = new FormData();
    form.append('category', 'documents');
    form.append('file', file);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await upload(form);
      if (response.data && response.data.url) {
        // setUrl(response.data);
        onSubmitFiles(response.data);
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

  const submitFeedback = async (data) => {

    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await submitRequest(profile.userId, { isVerified: data });
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
  };

  const onSubmitFiles = async (file) => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await update({ file: { url: file.url } });
      if (response.data && response.data.msg) {
        getQualification();
        Notiflix.Notify.success('Successfullly Submitted');
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

  const selectCheck = (iText) => {
    if (iText != 'select') {
      return true;
    }
    return false;
  };

  return (
    <SideMenuLayout title="Edit Profile">
      <div className="content-body">
        <div className="container-fluid">
          <>
           
            <div className="col-lg-12 col-sm-12" style={{ padding: "0px !important" }}>
              <div className="card">
                <div className="card-header">
                  <ProfilePicture default={loadProfile()}/>
                </div>
              </div>
            </div>
            <div className="row ">

              <div className="col-lg-6 col-sm-12">

                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Profile & Qualification</h4>


                  </div>

                  <div className="card-body">
                    <div className="basic-form">
                      <form
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label>First Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profile.firstName || ''}
                              {...register('firstName')}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label>Last Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profile.lastName || ''}
                              {...register('lastName')}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label>Gender </label>
                            <select
                              id="inputState"
                              className="form-control default-select"
                              defaultValue={profile.gender}
                              {...register('gender', {
                                validate: selectCheck,
                              })}
                            >
                              <option
                                value="select"
                                selected={!profile.gender}
                              >
                                Select Gender
                              </option>
                              <option
                                value="male"
                                selected={profile.gender == 'male'}
                              >
                                Male
                              </option>
                              <option
                                value="female"
                                selected={profile.gender == 'female'}
                              >
                                Female
                              </option>
                              <option
                                value="others"
                                selected={profile.gender == 'others'}
                              >
                                Others
                              </option>
                            </select>
                          </div>


                        </div>
                        <button type="submit" className="btn btn-primary">
                          Update
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </SideMenuLayout>
  );
}
