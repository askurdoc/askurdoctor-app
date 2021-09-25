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
import { getTime } from '../../helpers/utils';
import Notiflix from 'notiflix';

export default function appointment(props) {
  const [box, setBox] = useState(false);
  const [selectedFromDate, handleFromDateChange] = useState(new Date());
  const [selectedToDate, handleToDateChange] = useState(new Date());
  const [week, setWeek] = useState([]);
  const [duration, setDuration] = useState(null);
  const router = useRouter();
  const today = new Date();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const week = [
      { id: 0, value: 'SUNDAY', label: 'Sunday', isChecked: false },
      { id: 1, value: 'MONDAY', label: 'Monday', isChecked: false },
      { id: 2, value: 'TUESDAY', label: 'Tuesday', isChecked: false },
      { id: 3, value: 'WEDNESDAY', label: 'Wednesday', isChecked: false },
      { id: 4, value: 'THURSDAY', label: 'Thursday', isChecked: false },
      { id: 5, value: 'FRIDAY', label: 'Friday', isChecked: false },
      { id: 6, value: 'SATURDAY', label: 'Saturday', isChecked: false },
    ];
    setWeek(week);
    week.forEach((value) => {
      if (value.isChecked) {
        setBox(true);
      }
    });
  }, [props.doctors, props.patients]);

  const addTimings = (data) => {
    let state = false;

    if(getTime(selectedFromDate)===getTime(selectedToDate)){
      Notiflix.Notify.warning('Please select the from and to timings');
      return false;
    }
    if (data.perAppointment=="select") {
      Notiflix.Notify.warning('Please select the appointment duration');
      return false;
    }
    const payload = {};
    payload.daysOfTheWeek = [];
    week.forEach((value) => {
      if (value.isChecked) {
        state = true;
        payload.daysOfTheWeek.push(value.value);
      }
    });

    if (!state) {
      Notiflix.Notify.warning('Please select the atleast a day in the week');
      return false;
    }
    payload.perAppointment = {
      duration: parseInt(data.perAppointment),
    };
    payload.timeSlot = {};
    payload.timeSlot.from = getTime(selectedFromDate);
    payload.timeSlot.to = getTime(selectedToDate);
    props.callBack(payload);
  };

  const handleCheckboxChange = (event) => {
    const id = event.target.getAttribute('data-id');
    week[id].isChecked = !week[id].isChecked;
    setWeek(week);
  };

  const selectChange = (event) => {
    const value = event.target.value;
    if (value == 'Choose duration') {
      setDuration(null);
    }
    setDuration(value);
  };
  const weekdays = () => {
    return week.map((item) => {
      return (
        <div className="form-check form-check-inline">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              data-id={item.id}
              onChange={handleCheckboxChange}
              checked={item.checked}
            />
            {item.label}
          </label>
        </div>
      );
    });
  };
  return (
    <form onSubmit={handleSubmit(addTimings)}>
      <div className="col-xl-12 col-xxl-12">
        <div className="form-content p-4" style={{ width: '50% !important' }}>
          <div className="row  mb-20 pl-3" style={{ marginTop: '20px' }}>
            <h4>Add Timings</h4>
            <p>You can add multiple timing slots. </p>
          </div>
          <div className="row  mb-20" style={{ marginTop: '20px' }}>
            <div className="col-lg-6 mb-2">
              <div className="form-group">
                <label className="text-label">Timing From *</label>
                <br />
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <TimePicker
                    value={selectedFromDate}
                    onChange={handleFromDateChange}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div className="col-lg-6 mb-2">
              <div className="form-group">
                <label className="text-label">Timing to *</label>
                <br />
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <TimePicker
                    value={selectedToDate}
                    onChange={handleToDateChange}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div className="col-lg-6 mb-2">
              <div className="form-group">
                <label className="text-label">Duration Per Appointment *</label>
                <select
                  className="form-control"
                  id="inlineFormCustomSelect"
                  {...register('perAppointment', { required: true })}
                >
                  <option value="select">Choose duration</option>
                  <option value="5">05 min</option>
                  <option value="10">10 min</option>
                  <option value="15">15 min</option>
                  <option value="20">20 min</option>
                  <option value="25">25 min</option>
                  <option value="30">30 min</option>
                </select>
              </div>
            </div>

            <div className="col-lg-12 mb-2">
              <div className="form-group">
                <label className="text-label">Week days</label>
                <br />
                {weekdays()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-4" style={{ paddingLeft: '40px' }}>
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-block">
            Add timing
          </button>
        </div>
      </div>
    </form>
  );
}
