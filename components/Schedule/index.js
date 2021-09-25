import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  getSchedule,
  getFollowUpSchedule,
} from '../../services/doctors.service';
import Notiflix from 'notiflix';
import './schedule.css';

export default function Schedule(props) {
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [day, setDay] = useState(null);
  const [aptState, setAptState] = useState(null);
  const router = useRouter();
  const today = new Date();
  const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log('hi');
    // setAptState(props.state)
    console.log(props.schedule.timings);
    if (props.doctorId && props.date) init();
  }, [props.schedule, props.doctorId, props.date]);

  const init = async () => {
    const dt = new Date(props.date);
    const dayValue = dt.getDay();
    const dayName = days[dayValue];
    setDay(dayName);

    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      let response;
      if (props.state && props.state == 'REQUIRED_FOLLOW_UP') {
        response = await getFollowUpSchedule(
          props.schedule.doctorId,
          props.date,
        );
      } else {
        response = await getSchedule(props.schedule.doctorId, props.date);
      }
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.response) {
        setSchedule(response.data.response);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No schedule available');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const selectSlot = (id, key) => {
    console.log("ckl")
    const selected = schedule[key]
    const keyBy = _.keyBy(selected, 'id');
    const slot = keyBy[id];
    console.log(slot);
    const payload = {};
    payload.doctorId = props.doctorId;
    payload.date = props.date;
    payload.slot = slot;
    props.callBack(payload);
  };

  const calculate = (watchFee) => {
    let addAmount = 0;
    if (props.config.applicationFee.metric == 'PERCENTAGE') {
      addAmount += (watchFee * props.config.applicationFee.amount) / 100;
    } else {
      addAmount += props.config.applicationFee.amount;
    }
    if (props.config.serviceFee.metric == 'PERCENTAGE') {
      addAmount += (watchFee * props.config.serviceFee.amount) / 100;
    } else {
      addAmount += props.config.serviceFee.amount;
    }
    return addAmount;
  };
  
  const onSubmit = (data) => {
    data.date = date;
    if (data.doctors == 'select' || data.patients == 'select') {
      Notiflix.Notify.warning(
        'Please select both doctor and patient from the list',
      );
    }
    props.callBack(data);
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function renderHolders(list, key) {
    return list.map((slot, idx) => {
      return (
        <div className="row">
          {slot.slotAvailable ? (
            <div
              className="col-lg-12 col-sm-12 slot"
              style={{ padding: '0px' }}
            >
              <button
                className="btn btn-square btn-sm light btn-info btn-block"
                onClick={(e) => {
                  if (slot.slotAvailable) {
                    selectSlot(slot.id, key);
                  }
                }}
              >
                Book at {slot.time}
              </button>
            </div>
          ) : (
            <div className="col-lg-12 col-sm-12 slot text-black bg-warning">
              Not Available
            </div>
          )}
        </div>
      );
    });
  }

  function renderBlocks() {
    return Object.keys(schedule).map((value, index) => {
      return (
        <div className="col">
          <h3>Consultation {index + 1}</h3>
          {renderHolders(schedule[value], value)}
        </div>
      );
    });
  }

  function renderSchedule() {
    return props.schedule.timings.map((value, index) => {
      return (
        <div className="col">
          <div class="col-xl-12 col-xxl-12 col-sm-12">
            <div class="card">
              <div class="social-graph-wrapper widget-linkedin">
                {value.daysOfTheWeek.join(', ')}
              </div>
              <div class="row">
                <div class="col-6 border-right">
                  <div class="pt-3 pb-3 pl-0 pr-0 text-center">
                    <h4 class="m-1">
                      <span class="counter">{value.timeSlot.from}</span>
                    </h4>
                    <p class="m-0">From</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="pt-3 pb-3 pl-0 pr-0 text-center">
                    <h4 class="m-1">
                      <span class="counter">{value.timeSlot.to}</span>
                    </h4>
                    <p class="m-0">To</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }


  return (
    <>
      <div className="row">
        {props.schedule.fees ? (
          <div className="col-lg-12 col-xl-12">
            <h4 className="card-title text-black"> Doctor's Fees</h4>
            <div className="row">   <div className="col">
              <div class="col-xl-12 col-xxl-12 col-sm-12">
                <div class="card">
                  <div class="social-graph-wrapper text-black">
                    <bold>Rs  <strong>{parseInt(props.schedule.fees.amount) + calculate(props.schedule.fees.amount)}</strong>  </bold>
                  </div>
                </div></div></div></div>
          </div>
        ) : null}
        {props.schedule.timings ? (
          <div className="col-lg-12 col-xl-12">
            <h4 className="card-title text-black"> Doctor's Consultation</h4>
            <div className="row"> {renderSchedule()}</div>
          </div>
        ) : null}


        <div className="col-lg-12 col-xl-12">
          {Object.keys(schedule).length > 0 && !schedule.error ? (
            <div className="card baseColor">
              <div className="card-header border-0 pb-0 justify-content-center">
                <h4 className="card-title text-black">
                  {' '}
                  Schedule for {toTitleCase(day)}
                </h4>
              </div>
              <div className="card-body patient-calender  pb-2">
                <div className="row">{renderBlocks()}</div>
              </div>
            </div>
          ) : (
            <div className="card baseColor">
              <div className="card-body patient-calender  pb-2">
                <h4 className=" text-black text-center p-4">
                  {' '}
                  Please pick a date for doctor's schedule.
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
