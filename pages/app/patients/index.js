import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getAllPatients } from '../../../services/patients.service';
import { isAuthenticated } from '../../../services/auth.service';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import Notiflix from 'notiflix';
import _ from 'lodash';

export default function Patients(props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isDoc, setDoc] = useState(false);

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getAllPatients();
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.response) {
        setDoctors(response.data.response);
      } else {
        Notiflix.Notify.warning(
          response.data.error || 'No patients detail available',
        );
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  useEffect(() => {
    console.log('hi');
    init();
    const user = isAuthenticated();
    if (user.role.indexOf('DOCTORS') > -1) {
      setDoc(true);
    } else if (user.role.indexOf('VISITORS') > -1) {
      setDoc(false);
    }
  }, [props.state]);

  const patientClick = (item) => {
    console.log(item);
    const path = `/app/patients/${item.patientId}`;
    router.push({
      pathname: path,
    });
  };

  const loadItems = (list) => {
    if (list && list.length > 0) {
      const response = list.map((item, idx) => {
        console.log(item);
        return (
          <div className="col-lg-6"  onClick={(e) => {
            patientClick(item);
          }}>
            <div className="timeline-panel bg-white p-4 mb-4">
              <div className="media mr-4">
                <img alt="image" className="imageholder" width="90" src={item.profileImage} />
              </div>
              <div className="media-body">
                <a>
                  <h4 className="mb-2">
                    {item.firstName} {item.lastName}
                  </h4>
                </a>
                <p className="mb-2 text-primary">{item.specialization}</p>
                {/* <div className="star-review">
                <i className="fa fa-star text-orange"></i>
                <i className="fa fa-star text-orange"></i>
                <i className="fa fa-star text-orange"></i>
                <i className="fa fa-star text-gray"></i>
                <i className="fa fa-star text-gray"></i>
                <span className="ml-3">451 reviews</span>
              </div> */}
              </div>
            </div>
          </div>
        );
      });
      console.log(response);
      return response;
    }
  };

  const dataList = () => {
    if (doctors && doctors.length > 0) {
      const list = _.map(doctors, (i) => {
        const t = { ...i };
        const name = t.firstName;
        t.char = name[0];
        return t;
      });
      const grouped = _.groupBy(list, 'char');

      console.log(grouped);
      return Object.keys(grouped)
        .sort()
        .map((group, idx) => {
          const list = grouped[group];
          return (
            <div className="accordion__item">
              <div
                className="accordion__header rounded-lg"
                data-toggle="collapse"
                data-target="#default_collapseTwo"
              >
                <span className="accordion__header-alphabet">{group[0]}</span>
                <span className="accordion__header-line flex-grow-1"></span>
                <span className="accordion__header--text">
                  {list.length} Patients
                </span>
                <span className="accordion__header--indicator style_two"></span>
              </div>
              <div
                id="default_collapseOne"
                className="collapse accordion__body show"
                data-parent="#accordion-one"
              >
                <div className="widget-media best-doctor pt-4">
                  <div className="timeline row">{loadItems(list)}</div>
                </div>
              </div>
            </div>
          );
        });
    }
  };

  return (
    <SideMenuLayout title="Patients">
      <div className="content-body">
        <div className="container-fluid">
          <div className="form-head d-flex mb-3  mb-lg-5   align-items-start">
            {!isDoc ? (
              <Link href="/app/patients/add">
                <a className="btn btn-danger">+ New Patients</a>
              </Link>
            ) : null}
            <div className="input-group search-area ml-auto d-inline-flex hide">
              <input
                type="text"
                className="form-control"
                placeholder="Search here"
              />
              <div className="input-group-append">
                <a className="input-group-text">
                  <i className="flaticon-381-search-2"></i>
                </a>
              </div>
            </div>
            <div className="dropdown ml-3 d-inline-block hide">
              <div
                className="btn btn-outline-primary dropdown-toggle"
                data-toggle="dropdown"
              >
                <i className="flaticon-381-controls-3 mr-2"></i> Filter
              </div>
              <div className="dropdown-menu dropdown-menu-left">
                <a className="dropdown-item" href="#">
                  A To Z List
                </a>
                <a className="dropdown-item" href="#">
                  Z To A List
                </a>
              </div>
            </div>
            <select className="form-control style-2 ml-3 default-select hide">
              <option>Newest</option>
              <option>Old</option>
            </select>
            <a className="btn btn-outline-primary ml-3 hide">
              <i className="flaticon-381-menu-1 mr-0 "></i>
            </a>
            <a className="btn btn-light ml-3 hide">
              <i className="flaticon-381-pad mr-0"></i>
            </a>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div id="accordion-one" className="accordion doctor-list ">
                {dataList()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
