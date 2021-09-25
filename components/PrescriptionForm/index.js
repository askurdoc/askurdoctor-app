import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { getTime } from '../../helpers/utils';
import Notiflix from 'notiflix';

export default function appointment(props) {
  const [phase, setPhase] = useState([]);
  const [formFactor, setForm] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const phases = [
      { id: 0, value: 'Morning', label: 'Morning', isChecked: false },
      { id: 1, value: 'Afternoon', label: 'Afternoon', isChecked: false },
      { id: 2, value: 'Evening', label: 'Evening', isChecked: false },
      { id: 3, value: 'Night', label: 'Night', isChecked: false },
    ];
    setPhase(phases);
    phase.forEach((value) => {
      if (value.isChecked) {
        setBox(true);
      }
    });
  }, []);

  const onSubmit = async (data) => {
    let state = false;
    const payload = {};
    payload.drugId = props.drug.drugId;
    payload.name = props.drug.name;
    payload.phase = [];
    payload.meal = data.meal;
    payload.metric = formFactor;
    payload.quantity = data.quantity;
    payload.days = data.days;
    phase.forEach((value) => {
      if (value.isChecked) {
        state = true;
        payload.phase.push(value.value);
      }
    });
    payload.times = payload.phase.length;

    payload.totalValue = data.days * (data.quantity * payload.phase.length);
    if (!state) {
      Notiflix.Notify.warning('Please select the atleast a "time of the day"');
      return false;
    }
    console.log(payload);
    props.callBack(payload);
  };

  const phasedays = () => {
    return phase.map((item) => {
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

  const onChangeValue = (event) => {
    console.log(event.target.value);
    setForm(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const id = event.target.getAttribute('data-id');
    phase[id].isChecked = !phase[id].isChecked;
    setPhase(phase);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="post-title" href="post-details.html">
        <h3 className="text-black">{props.drug.name}</h3>
      </div>
      <div className="form-row  mb-2">
        <div className="form-group col-md-12">
          <label className="mb-3">Time of the Day</label>
          <br />
          {phasedays()}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group  col-md-4">
          <label>Meal</label>
          <select
            className="form-control default-select form-control-lg"
            {...register('meal', { required: true })}
          >
            <option value="Before">Before</option>
            <option value="After">After</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-3">
          <label>Dosage Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            placeholder="E.g: 4"
            {...register('quantity', { required: true })}
          />
        </div>
        <div className="form-group col-md-9">
          <div className="form-group  mt-5 px-4" onChange={onChangeValue}>
            <label className="radio-inline mr-3">
              <input type="radio" name="optradio" value="Tablet" /> Tablet
            </label>
            <label className="radio-inline mr-3">
              <input type="radio" name="optradio" value="Spoon" /> Spoon
            </label>
            <label className="radio-inline mr-3">
              <input type="radio" name="optradio" value="ml" /> ml
            </label>
            <label className="radio-inline mr-3">
              <input type="radio" name="optradio" value="Injection" /> Injection
            </label>
          </div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-3">
          <label>Number of Days</label>
          <input
            type="number"
            className="form-control"
            name="totalValue"
            placeholder="E.g: 10"
            {...register('days', { required: true })}
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={formFactor == null}
      >
        Add Drugs
      </button>
    </form>
  );
}
