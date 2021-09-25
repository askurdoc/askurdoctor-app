import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import AdminWithdrawal from '../../../components/TransactionTable/AdminRequests';
import Notiflix from 'notiflix';
import { RAZOR } from '../../../config/constants';

import {
  createPaymentSession,
  approveRequest
} from '../../../services/payment.service';
import { getMyWallet } from '../../../services/wallet.service';
import { isAuthenticated } from '../../../services/auth.service';
const razorKey = RAZOR();
export default function Wallet(props) {
  const [checkAmount, setAmount] = useState(null);
  const [modal, setModal] = useState(false);
  const [id, setId] = useState(null);
  const [calculated, setCalculated] = useState(null);
  const [user, setUser] = useState({});
  const [order, setOrder] = useState({});
  const [wallet, setWallet] = useState({});
  const [payment, setPaymentAmount] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchAmount = watch(['amount']);


  const init = async () => {

  };



  const onSubmit = async (data) => {
    setModal(false)
    console.log(data)
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await approveRequest(id, data);
      Notiflix.Loading.remove();
      if (response.data && response.data.msg) {
        Notiflix.Notify.success('Successfully approved');
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Create Payment Order');
      }
    } catch (e) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };



  const onApproval = (id) => {
    setId(id)
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  useEffect(() => {
    const user = isAuthenticated();
    console.log(watchAmount);
    setUser(user);
  }, [props, watch]);

  return (
    <SideMenuLayout title="Wallet">
      {modal ? <div class="overlay"></div> : null}
      <div className="content-body">
        <div className="container-fluid">
          {modal ? <div class="modal fade show" id="exampleModalCenter">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                  <div class="modal-header">
                    <h5 class="modal-title">Confirmation</h5>
                    <button type="button" class="close" data-dismiss="modal" onClick={closeModal}><span>&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">

                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label>Reference Id</label>
                        <input
                          type="text"
                          placeholder="I90754990"
                          className="form-control"
                          {...register('referenceId', {
                            required: true,
                          })}
                        />
                      </div>
                    </div>
               
                  </div>
                  <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Submit</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
            : null}
          <div className="row">
            <div className="col-lg-12 card">

              <div className="card-body  p-4">
                <div className="welcome-text">
                  <h4>Amount Withdrawal Request</h4>
                </div>
                {/* <div className="row">{loadCash()}</div> */}

                <div className="form-group col-md-12 col-sm-12 px-0">
                  <AdminWithdrawal callBack={onApproval} />
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}
