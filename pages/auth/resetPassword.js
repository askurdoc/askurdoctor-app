import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import TopMenuLayout from 'layouts/TopMenuLayout.js';
import { resetPassword } from '../../services/auth.service';
import Notiflix from 'notiflix';
import { APP_CONFIG } from '../../config/constants';

export default function Register(props) {
  const router = useRouter();

  const { userId, code } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState({ show: false });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.retypePassword) {
      Notiflix.Notify.warning('New Password is not same as retype password"');
      return false;
    }
    const obj = {
      resetCode: code,
      userId: userId,
      newPassword: data.newPassword,
    };
    setIsSubmitting(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await resetPassword(obj);
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
  };

  useEffect(() => {
    console.log(code);
    console.log(userId);
  }, [props]);

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
                          {APP_CONFIG.name}
                        </h3>
                      </a>
                    </div>
                    <h4 className="text-center mb-4">Reset Password</h4>
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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

                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          Reset Password
                        </button>
                      </div>
                    </form>
                    <div className="new-account mt-3">
                      <p>
                        Back to{' '}
                        <a className="text-primary" href="/">
                          Login
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
