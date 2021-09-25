import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import { getAllDrugs, search } from '../../../services/drugs.service';
import Pagination from '@material-ui/lab/Pagination';
import Notiflix from 'notiflix';
import dynamic from 'next/dynamic';

const Keyboard = dynamic(() => import('../../../components/keyboard'), {
  ssr: false,
});

export default function drugs(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [drugs, setDrugs] = useState([]);
  const [text, setSearchText] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    console.log('hi');
    init();
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
    init();
  };

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getAllDrugs(page);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setDrugs(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        Notiflix.Notify.warning(response.data.error ||  'No drugs detail available');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (text != null && text.length >= 3) {
        searchText();
      } else {
        Notiflix.Notify.warning(
          'Please enter minimum 3 characters to start search',
        );
      }
    }
  };

  const changetext = (event) => {
    console.log(event.target.value);
    setSearchText(event.target.value);
  };

  const searchText = async () => {
    setSearchMode(true);
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await search(text);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data) {
        setDrugs(response.data);
      } else {
        Notiflix.Notify.warning(response.data.error ||  'No drugs details available');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const clearSearch = () => {
    setSearchMode(false);
    setSearchText(null)
    setPage(1);
    init();
  };

  const keyHandler = (key) => {
    console.log(key);
    if (key == 'enter' && text != null && text.length >= 3) {
      searchText();
    } else {
      Notiflix.Notify.warning(
        'Please enter minimum 3 characters to start search',
      );
    }
  };

  const loadMedicine = () => {
    return drugs.map((item) => {
      return (
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="widget-stat card">
            <div className="card-body p-4">
              <div className="media ai-icon">
                {item.image ? (
                  <span className="mr-3 bgl-primary text-primary"></span>
                ) : null}
                <div className="media-body">
                  <p className="mb-1">{item.name}</p>
                  <h6 className="mb-1">{item.form}</h6>
                  <div className="badge badge-primary">
                    {item.cost.amount} {item.cost.currency}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };
  return (
    <SideMenuLayout title="Medical Drugs">
      <Keyboard keys={['enter']} callBack={keyHandler} />
      <div className="content-body">
        <div className="container-fluid">
          <div className="form-head d-flex mb-3  mb-lg-5   align-items-start">
            {/* <Link href="/app/patients/add">
              <a className="btn btn-danger">+ New Patients</a>
            </Link> */}
            <Pagination
              count={totalPages}
              page={page}
              color="secondary"
              onChange={handleChange}
            />

            <div className="input-group search-area ml-auto d-inline-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Search here"
                value={text}
                onChange={changetext}
                onKeyPress={handleKeyPress}
              />
              <div className="input-group-append">
                {!searchMode ? (
                  <a
                    className="input-group-text"
                    onClick={(e) => {
                      searchText();
                    }}
                  >
                    <i className="flaticon-381-search-2"></i>
                  </a>
                ) : (
                  <a
                    className="input-group-text"
                    onClick={(e) => {
                      clearSearch();
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </a>
                )}
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

            <a href="javascript:void(0);" className="btn btn-light ml-3 hide">
              <i className="flaticon-381-pad mr-0"></i>
            </a>
          </div>

          <div className="row">{loadMedicine()}</div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
