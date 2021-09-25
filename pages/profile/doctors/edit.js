import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import defaultProfile from '../../../public/images/default_profile_pic.jpeg';
import Link from 'next/link';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import ProfilePicture from '../../../components/ProfilePicture';
import { getConfig } from '../../../services/config.service';
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
    'Oncologist',
    'Paediatric surgeon',
    'Cardiologist',
    'Nephrologist',
    'Family medicine',
    'Oncosurgeon',
    'Diabetiologist',
    'Neurologist',
    'Pulmonologist',
    'Cardio thoracic surgeon',
    'Maxillofacial surgeon',
    'Endocrinologist',
    'Haematologist',
    'Transfusion medicine',
    'Neuro surgeon',
    'Gastroenterologist',
    'Vascular surgeon',
    'General physician',
    'Rheumatologist',
    'Infectious Disease',
    'Dietician',
    'Physiotherapist',
  ];
  
  const onSubmit = async (data) => {
    console.log(data);
    const pList = ['firstName', 'lastName', 'email', 'gender'];
    const pData = {};
    const qList = ['aboutMe', 'degree', 'specialization', 'registration'];
    const qData = {};
    Object.keys(data).forEach((item) => {
      if (pList.indexOf(item) > -1 && data[item] != '') {
        pData[item] = data[item];
      }
      if (qList.indexOf(item) > -1 && data[item] != '') {
        qData[item] = data[item];
      }
    });
    console.log(pData);
    console.log(qData);
    try {
      Notiflix.Loading.pulse('Loading...');
      let calls = [];
      if (Object.keys(qData).length > 0) {
        const call = update(qData);
        calls.push(call);
      }
      if (Object.keys(pData).length > 0) {
        const call = updateProfile(pData);
        calls.push(call);
      }
      const response = await Promise.all(calls);
      if (response.length == calls.length) {
        Notiflix.Loading.remove();
        Notiflix.Notify.success('successfully Updated');
      } else {
        Notiflix.Loading.remove();
        Notiflix.Notify.warning('Update Failed');
      }
    } catch (e) {
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const getQualification = async () => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await get();
      console.log(response);
      if (response.data && response.data.data) {
        setQualification(response.data.data);
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
    getQualification();
    getInfo();
  }, []);

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

  const loaddrList = () => {
    const list = selectList.sort().map((item) => {
      return (
        <option
          key={item}
          value={item}
          selected={qualification.specialization == item}
        >
          {item}
        </option>
      );
    });
    return list;
  };

  const loadProfile =  () => {
    if (!isLoading) {
      if (!profile || !profile.profileImage) {
        return defaultProfile;
      }
      return profile.profileImage;
    }
    return defaultProfile;
  };


  const loadFileList = () => {
    return qualification.files.map((item, i) => {
      console.log(item);
      if (item && item.url) {
        return (
          <li
            key={i}
            className="list-group-item d-flex p-0 justify-content-between"
          >
            <strong>
              <a href={item.url} target="_blank">
                View File
              </a>
            </strong>
            <span className="mb-0">{item.fileId}</span>
          </li>
        );
      }

    });
  };
  return (
    <SideMenuLayout title="Edit Profile">
      <div className="content-body">
        <div className="container-fluid">
          <>
            {qualification.isVerified === 'PENDING' ? <div className="row">
              <div className="col-lg-12 col-sm-12" style={{ padding: "0px !important" }}>
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Profile & Qualification</h4>
                    <div className="ml-auto ">
                      <a
                        onClick={(e) => {
                          submitFeedback('SUBMITTED');
                        }}
                        className="btn btn-success btn-sm text-white"
                      >
                        Submit for verfication
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div> : null}
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
                          <div className="form-group col-md-12">
                            <label>About me</label>
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                rows="4"
                                id="comment"
                                defaultValue={qualification.aboutMe || ''}
                                {...register('aboutMe')}
                              ></textarea>
                            </div>
                          </div>
                          <div className="form-group col-md-12">
                            <label>Medical Registration Detail</label>
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={qualification.degree || ''}
                                {...register('registration')}
                              />
                            </div>
                          </div>
                          <div className="form-group col-md-6">
                            <label>Specialized</label>
                            <select
                              id="inputState"
                              className="form-control default-select"
                              defaultValue={qualification.qualification}
                              {...register('specialization', {
                                validate: selectCheck,
                              })}
                            >
                              <option
                                value="select"
                                selected={!qualification.specialization}
                              >
                                Physician Type
                              </option>
                              {loaddrList()}
                            </select>
                          </div>
                          <div className="form-group col-md-12">
                            <label>Degree Qualification</label>
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={qualification.degree || ''}
                                {...register('degree')}
                              />
                            </div>
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
              <div className="col-lg-6  col-sm-12">
                <div className="">
                  <div className="card-header">
                    <h4 className="card-title">Documents</h4>
                  </div>
                  <div className="card-body">
                    <form method="post">
                      <div className="form-group mt-3">
                        <label className="mr-2 ">
                          Upload your verification documents such as education
                          certificate, Medical Registration Certs etc.
                        </label><br />
                        <div class="upload-btn-wrapper">
                          <button class="cbtn">Upload a file</button>
                          <input type="file" name="file"
                            onChange={handleFileChange()} />
                        </div>

                      </div>
                      {/* <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={uploadFile}
                      >
                        Upload
                      </button> */}
                    </form>
                  </div>
                </div>
                <div className="">
                  <div className="card-header border-0 pb-0">
                    <h2 className="card-title">Uploaded Documents</h2>
                  </div>
                  <div className="card-body pb-0">
                    <ul className="list-group list-group-flush">
                      {qualification.files ? loadFileList() : null}
                    </ul>
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
