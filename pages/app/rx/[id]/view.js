import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import SideMenuLayout from '../../../../layouts/SideMenuLayout';
import { getRXbyId } from '../../../../services/rx.service';
import Pagination from '@material-ui/lab/Pagination';
import Notiflix, { Notify } from 'notiflix';
import dynamic from 'next/dynamic';
import RxComponent from '../../../../components/Rx';


// const RxComponent = dynamic(() => import('../../../../components/Rx'), {
//   ssr: false,
// });


export default function RxView(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [rx, setRx] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log('hi');
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getRXbyId(id);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setRx(response.data.data);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No prescription details available');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  return (
    <SideMenuLayout title="Rx">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12 col-xxl-12">
              <div className="row">
                {rx && rx.rxId ? <RxComponent data={rx} /> : <h3>No Data</h3>}
                <div className="col-md-12 ">
                  <hr />
                  <div className="text-right">
                    <button
                      onClick={(e)=>{
                        window.print();
                      }}
                      className="btn btn-default btn-outline no-printme"
                      type="button"
                    >
                      <span>
                        <i className="fa fa-print"></i> Print
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
