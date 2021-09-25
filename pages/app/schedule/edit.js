import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import MomentUtils from '@date-io/moment'; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Link from 'next/link';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import TimingForm from '../../../components/ScheduleComponent/TimingForm';
import ScheduleForm from '../../../components/ScheduleComponent/ScheduleFrom';
import { getTime } from '../../../helpers/utils';
import { createDoctors } from '../../../services/doctors.service';
import Notiflix from 'notiflix';

export default function addSchedule(props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payload, setPayload] = useState({});
  const [timings, setTimings] = useState([]);
  const [count, setCount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.timings = timings;
    data.fees = {
      amount: data.fee,
    };
    console.log(data);
    setIsSubmitting(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await createDoctors(data);
      if (response.status === 201) {
        router.push('/app/schedule');
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

    // init();
  }, []);

  const timingCallBack = (data) => {
    timings.push(data);
    setTimings(timings);
    setCount(timings.length);
  };

  return (
    <SideMenuLayout title="Add Schedule">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row page-titles mx-0">
            <div className="col-sm-6 p-md-0">
              <div className="welcome-text">
                <h4>Create Schedule</h4>
                <p className="mb-0">
                  Please provide the configuration details to proceed
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                <div className="card">
                  <div className="card-body">
                    <ScheduleForm
                      timings={timings}
                      count={count}
                      callBack={onSubmit}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <TimingForm callBack={timingCallBack} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
