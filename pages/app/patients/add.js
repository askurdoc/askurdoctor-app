import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getAllPatients, createPatients} from '../../../services/patients.service';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import Notiflix from 'notiflix';
import _ from 'lodash';

export default function AddPatients(props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [type, setType] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();


  const onTypeChange = (event) => {
    setType(event.target.value);
  };

  const onSubmit = async (data) => {
    console.log(data);
    const payload = {}
    payload.areYouthePatient = type=="Myself"? true: false
    payload.firstName = data.firstName;
    payload.lastName = data.lastName;
    payload.gender = data.gender;
    payload.details = {} 
    payload.details.height = data.height;
    payload.details.weight = data.weight;
    payload.details.age = data.age;
    payload.details.allergicTo = data.allergic;
    payload.details.previousMedications = data.medication;
    payload.details.medicalHistory = data.history;
    setIsSubmitting(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await createPatients(payload);
      if (response.status === 201) {
        router.push('/app/patients');
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
  }, [props.state]);

  return (
    <SideMenuLayout title="Patient Record">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row page-titles mx-0">
            <div className="col-sm-6 p-md-0">
              <div className="welcome-text">
                <h4>Create Record</h4>
                <p className="mb-0">
                  Please provide the patient details to proceed
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="col-xl-12 col-xxl-12">
                    <div
                      className="form-content p-4"
                      style={{ width: '50% !important' }}
                    >
                      <div className="welcome-text1">
                        <h4>Who is the Patient</h4>
                      </div>
                      <div className="row mb-20">
                        <div className="col-lg-6 mt-2 col-push-2">
                          <div className="form-group mb-0">
                            <label className="radio-inline mr-3">
                              <input
                                type="radio"
                                name="optradio"
                                value="Myself"
                                checked={type === 'Myself'}
                                onChange={onTypeChange}
                              />{' '}
                              Myself
                            </label>
                            <label className="radio-inline mr-3">
                              <input
                                type="radio"
                                name="optradio"
                                value="Others"
                                checked={type === 'Others'}
                                onChange={onTypeChange}
                              />{' '}
                              Family / Friends
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 mt-2"></div>
                      </div>
                      <div className="row mb-20" style={{ marginTop: '20px' }}>
                        <div className="col-lg-6 mb-2">
                          <div className="form-group">
                            <label className="text-label">First Name*</label>
                            <input
                              type="text"
                              name="firstName"
                              className="form-control"
                              placeholder="Parsley"
                              {...register('firstName', { required: true })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-2">
                          <div className="form-group">
                            <label className="text-label">Last Name*</label>
                            <input
                              type="text"
                              name="lastName"
                              className="form-control"
                              placeholder="Montana"
                              {...register('lastName', { required: true })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-2">
                          <div className="form-group">
                            <label className="text-label">Gender</label>
                            <select
                              className="form-control"
                              id="inlineFormCustomSelect"
                              {...register('gender', { required: true })}
                            >
                              <option selected>Choose Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row  mb-20" style={{ marginTop: '20px' }}>
                        <div className="col-lg-6 mb-2">
                          <div className="form-group">
                            <label className="text-label">Height in cm</label>
                            <input
                              type="text"
                              name="height"
                              className="form-control"
                              placeholder="E.g 155"
                              {...register('height')}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-2">
                          <div className="form-group">
                            <label className="text-label">Weight in kg</label>
                            <input
                              type="number"
                              name="weight"
                              className="form-control"
                              placeholder="E.g 55"
                              {...register('weight')}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-2">
                          <div className="form-group">
                            <label className="text-label">Age</label>
                            <input
                              type="number"
                              className="form-control"
                              name="age"
                              id="inputGroupPrepend2"
                              placeholder="E.g 20"
                              {...register('age')}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-2">
                          <div className="form-group">
                            <label className="text-label">Allergic to</label>
                            <input
                              type="text"
                              name="allergic"
                              className="form-control"
                              placeholder="E.g Pencilin"
                              {...register('allergic', { required: true })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-2">
                          <div className="form-group">
                            <label className="text-label">
                              Previous Medications
                            </label>
                            <input
                              type="text"
                              name="medication"
                              className="form-control"
                              placeholder="E.g Taking B.P Medication"
                              {...register('medication')}
                            />
                          </div>
                        </div>

                        <div className="col-lg-12 mb-2">
                          <div className="form-group">
                            <label className="text-label">Medical History</label>
                            <textarea
                              className="form-control"
                              rows="4"
                              id="comment"
                              {...register('history')}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4" style={{ paddingLeft: '40px' }}>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={type == null}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
