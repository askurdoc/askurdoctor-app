import React, { useEffect, useState, useContext } from 'react';
import { search } from '../../services/drugs.service';
import './index.css';
import Notiflix from 'notiflix';

import { useForm } from 'react-hook-form';
export default function dropdown(props) {
  const [drugs, setDrugs] = useState([]);
  const [sText, setText] = useState(null);
  const [drop, setDrop] = useState(false);
 

  const drugSearch = (event) => {
    if (event.target.value.length >= 3) {
      setText(event.target.value);
      setDrop(true);
    } else {
      setDrop(false);
    }
  };

  const searchText = async (text) => {
    Notiflix.Loading.pulse('Loading...');
    try {
      if (sText == '') {
        return false;
      }
      const response = await search(sText);
      Notiflix.Loading.remove();
      console.log(response)
      if ( response.data) {
        setDrugs(response.data);
      } else {
        Notiflix.Notify.warning('No drugs details available');
      }
    } catch (e) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (sText != null && sText != '') searchText();
    }, 500);
  }, [sText]);

  const addMedicine = (item) => {
    setDrop(false);
    props.callBack(item);
  };

  const loadMedicine = () => {
    return drugs.map((item) => {
      return (
        <div className="col-xl-12 col-lg-12 col-sm-12">
          <div className="widget-stat">
            <div className="px-2 py-3">
              <div className="row">
                <div className="col ">
                  <div className="media ai-icon">
                    <div className="media-body">
                      <p className="mb-0">{item.form}</p>
                      <h6 className="mb-1">{item.name}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-2 ">
                  <a
                    className="btn btn-rounded btn-xs btn-info text-white"
                    onClick={(e) => {
                      addMedicine(item);
                    }}
                  >
                    <i className="fa fa-plus color-info"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="form-group mt-5">
      <label className="mb-1">
        <strong>Search Drugs*</strong>
      </label>
      <input
        type="text"
        className="form-control"
        placeholder="Drugs"
        onChange={drugSearch}
      />
      {drop ? (
        <div className="list col-lg-12 mt-2 mb-2 px-0">{loadMedicine()}</div>
      ) : null}
    </div>
  );
}
