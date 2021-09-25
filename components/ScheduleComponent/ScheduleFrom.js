import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
export default function appointment(props) {
  const [timings, setTimings] = useState([]);
  const [checked, setChecked] = useState(false);
  const [fee, setFee] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchFee = watch(['fee']);

  useEffect(() => {
    console.log('hi');
    setTimings(props.timings);
  }, [props.timings, props.count]);

  const onSubmit = async (data) => {
    data.intakesOnPublicHoliday = checked;
    props.callBack(data);
  };

  const onchangeHandle = (e) => {
    setChecked(!checked);
  };
  const onFeeHandle = (e) => {
    console.log(e.target.value);
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

  const loadTimings = () => {
    console.log(watchFee);
    return timings.map((value) => {
      return (
        <tr>
          <td>{value.daysOfTheWeek.join(', ')}</td>
          <td>
            {value.timeSlot.from} - {value.timeSlot.to}
          </td>
          <td>{value.perAppointment.duration} min</td>
        </tr>
      );
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="col-xl-12 col-xxl-12">
        <div className="form-content p-4" style={{ width: '50% !important' }}>
          <div className="row  mb-20 pl-3" style={{ marginTop: '20px' }}>
            <h4>Schedule Details</h4>
            <p>Please add the timings before submitting the Form </p>
          </div>
          <div className="row mb-20" style={{ marginTop: '20px' }}>
            <div className="col-lg-12 mb-2">
              <div className="form-group">
                <label className="text-label">Schedule Name*</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="e.g Daily"
                  {...register('name', { required: true })}
                />
              </div>
            </div>
            <div className="col-lg-6 mb-2">
              <div className="form-group">
                <label className="text-label">Consulation Fee in Rs*</label>
                <input
                  type="number"
                  name="fee"
                  className="form-control"
                  placeholder="e.g 400"
                  onChange={onFeeHandle}
                  {...register('fee', { required: true })}
                />
              </div>
              <h6>
                Please note: there will be an additional amount will be added
                together with the given fee.
              </h6>
            </div>
            <div className="col-lg-6 mb-2">
              <label className="form-check-label">Total consultation fee</label>
              <br />
              {watchFee && !isNaN(parseInt(watchFee)) ? (
                <label className="form-check-label pt-3">
                  {watchFee} + {calculate(watchFee)} ={' '}
                  <strong>{parseInt(watchFee) + calculate(watchFee)}</strong>
                </label>
              ) : (
                <label className="form-check-label pt-3">0 </label>
              )}
            </div>
            <div className="col-lg-12 mb-2 pt-2">
              <div className="form-group">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checked}
                    onChange={onchangeHandle}
                  />
                  <label className="form-check-label">
                    Are you available on public holidays? *
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row  mb-20 pl-3" style={{ marginTop: '20px' }}>
            <h4>Timings</h4>
          </div>
          <div className="row mb-20">
            <div className="col-xl-12">
              <div className="table-responsive">
                <table className="table table-responsive-md">
                  <thead>
                    <tr>
                      <th>
                        <strong>Days of the week</strong>
                      </th>
                      <th>
                        <strong>Time slot</strong>
                      </th>
                      <th>
                        <strong>Duration</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>{loadTimings()}</tbody>
                </table>
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
            disabled={props.count == 0}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
