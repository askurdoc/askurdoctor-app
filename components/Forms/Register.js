import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import TopMenuLayout from 'layouts/TopMenuLayout.js';
import { registerDoctor, registerUser } from '../../services/auth.service';
import Notiflix from 'notiflix';
import { APP_CONFIG } from '../../config/constants';

export default function Register({ isDoctor }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState({ show: false });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const watchPassword = watch("password", null);
  const watchUsernamePassword = watch("username", null);

  const onSubmit = async (data) => {
    console.log(data);
    setIsSubmitting(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = isDoctor
        ? await registerDoctor(data)
        : await registerUser(data);
      console.log(response);
      if (response.status === 201) {
        Notiflix.Report.success(
          'Registration',
          'Your registration is successful. Please check your email inbox for a verification link. You can proceed to login once verification is complete.',
          'Back to Login',
          function () {
            router.push('/');
          },
        );
      }
    } catch (e) {
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      Notiflix.Loading.remove();
      setIsSubmitting(false);
    }
  };

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

  const emailCheck = (iText) => {
    // if there is no value in input return true, input is VALID
    if (!iText) {
      return true;
    }
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(iText)) {
      return true;
    } else {
      return false;
    }
  };

  const usernameCheck = (iText) => {
    // if there is no value in input return true, input is VALID
    if (!iText) {
      return false;
    }
    // if (/[^a-zA-Z0-9\.]/.test(iText)) {
    //   return false;
    // }
    const filter = /[^a-zA-Z0-9\.]/;

    if (filter.test(iText)) {
      return false;
    } else {
      return true;
    }

  };

  const selectCheck = (iText) => {
    if (iText != 'select') {
      return true;
    }
    return false;
  };

  return (
    <TopMenuLayout>
      <div className="container h-100  mt-100">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <a>
                        <h3 className="text-primary text-bold">
                          {' '}
                          {APP_CONFIG.name}
                        </h3>
                      </a>
                    </div>
                    <h4 className="text-center mb-4">
                      Sign up as a {isDoctor ? 'doctor' : 'visitor'}
                    </h4>
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-group">
                        <label className="mb-1">
                          <strong>First Name</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="First Name"
                          {...register('firstName', { required: true })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="mb-1">
                          <strong>Last Name</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last Name"
                          {...register('lastName', { required: true })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="mb-1">
                          <strong>Username</strong>
                        </label>
                        <input
                          type="text"
                          autoComplete="username"
                          className="form-control"
                          placeholder="username"
                          {...register('username', {
                            required: true,
                            minLength: 5,
                            maxLength: 30,
                            validate: { usernameCheck },
                          })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="mb-1">
                          <strong>Email</strong>
                        </label>
                        <input
                          type="email"
                          autoComplete="off"
                          className="form-control"
                          placeholder="hello@example.com"
                          {...register('email', {
                            required: true,
                            validate: { emailCheck },
                          })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="mb-1">
                          <strong>Gender</strong>
                        </label>
                        <select
                          id="inputState"
                          className="form-control default-select"
                          {...register('gender', {
                            validate: selectCheck,
                          })}
                        >
                          <option
                            value="select"
                          >
                            Select Gender
                          </option>
                          <option
                            value="male"
                          >
                            Male
                          </option>
                          <option
                            value="female"
                          >
                            Female
                          </option>
                          <option
                            value="others"
                          >
                            Others
                          </option>
                        </select>

                      </div>
                      <div className="form-group">
                        <label className="mb-1">
                          <strong>Password</strong>
                        </label>
                        <br />
                        <small className="">
                          Minimum of 8 characters, with at least 1 Capital
                          letter, 1 number and 1 special character
                        </small>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          autoComplete="off"
                          {...register('password', {
                            required: true,
                            validate: { passwordCondition },
                          })}
                        />
                      </div>
                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={isSubmitting}
                        >
                          Sign me up
                        </button>
                      </div>
                    </form>
                    <div className="new-account mt-3">
                      <p>
                        Already have an account?{' '}
                        <a className="text-primary" href="/">
                          Sign in
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TopMenuLayout>
  );
}
