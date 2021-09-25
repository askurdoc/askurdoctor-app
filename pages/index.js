import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Auth from '../layouts/TopMenuLayout.js';
import { login, storeUser } from '../services/auth.service';
import { get } from '../services/qualification.service';
import { UserContext } from '../context/UserContext';
import Notiflix from 'notiflix';
import { APP_CONFIG } from '../config/constants';

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await login(data);
      console.log(response);

      if (response.status === 200) {
        storeUser(response.data);
        setUser(response.data);
        if (response.data.role.indexOf('VISITORS') > -1) {
          router.push('/home/visitors');
        } else if (response.data.role.indexOf('DOCTORS') > -1) {
          const path = await checkQualified();
          router.push(path);
        } else if (response.data.role.indexOf('ADMIN') > -1) {
          router.push('/home/admin');
        }
      }
    } catch (e) {
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      Notiflix.Loading.remove();
      setIsSubmitting(false);
    }
  };

  const checkQualified = async () => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await get();
      if (response.data && response.data.data) {
        if(response.data.data.isVerified == "APPROVED"){
          return '/home/doctors';
        } else {
          return '/profile/doctors/edit';
        }
      } else {
        return '/profile/doctors/edit';
      }
    } catch (e) {
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      Notiflix.Loading.remove();
    }
  }

  return (
    <Auth>
      <div className="container h-100 mt-100">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6 col-sm-12">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-sm-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <a href="index.html">
                        {/* <img src="images/logo-full.png" alt="" /> */}
                        <h3 className="text-primary text-bold">  {APP_CONFIG.name}</h3>
                      </a>
                    </div>
                    <h4 className="text-center mb-4">Sign in your account</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-group">
                        <label className="mb-1">
                          <strong>Username</strong>
                        </label>
                        <input
                          type="username"
                          className="form-control"
                          placeholder="E.g John123"
                          {...register('username', { required: true })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="mb-1">
                          <strong>Password</strong>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          {...register('password', { required: true })}
                        />
                      </div>
                      <div className="form-row d-flex justify-content-between mt-4 mb-2">
                        {/* <div className="form-group">
                          <div className="custom-control custom-checkbox ml-1">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="basic_checkbox_1"
                            />
                            <label
                              className="custom-control-label"
                              for="basic_checkbox_1"
                            >
                              Remember my preference
                            </label>
                          </div>
                        </div> */}
                        <div className="form-group">
                          <a href="/auth/forgotPassword">
                            Forgot Password?
                          </a>
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          Sign Me In
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Auth>
  );
}
