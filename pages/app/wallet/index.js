import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import Transactions from '../../../components/TransactionTable';
import Ledgers from '../../../components/TransactionTable/ledgers';
import Withdrawal from '../../../components/TransactionTable/withdrawal';
import Notiflix from 'notiflix';
import { RAZOR } from '../../../config/constants';

import {
  createPaymentSession,
  submitPaymentId,
  createMyRequests
} from '../../../services/payment.service';
import { getMyWallet } from '../../../services/wallet.service';
import { isAuthenticated } from '../../../services/auth.service';
const razorKey = RAZOR();
export default function Wallet(props) {
  const [checkAmount, setAmount] = useState(null);
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

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const amount = [
    {
      amount: 50,
      display: '50',
      item: 1,
      type: 'default',
    },
    {
      amount: 100,
      display: '100',
      item: 2,
      type: 'default',
    },

    {
      amount: 500,
      display: '500',
      item: 3,
      type: 'default',
    },
    {
      amount: 1000,
      display: '1,000',
      item: 4,
      type: 'default',
    },
    {
      amount: 5000,
      display: '5,000',
      item: 5,
      type: 'default',
    },
    {
      amount: 10000,
      display: '10,000',
      item: 6,
      type: 'default',
    },
  ];

  const init = async () => {
    await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  };

  const loadCash = (type) => {
    const list = [];

    amount.map((value) => {
      list.push(
        <label className="com-form-label-lg radio-inline mr-5 mx-3">
          <input type="radio" name="optradio" value={value.amount} /> {'  '}
          Rs {value.display}
        </label>,
      );
    });
    return list;
  };
  const onChangeValue = (event) => {
    console.log(event.target.value);
    setAmount(event.target.value);
    const pasedInt = parseInt(event.target.value)
    const finalValue = (pasedInt - ((pasedInt * 0.02) + (pasedInt * 0.02) * 0.18)).toFixed(2)
    setCalculated(finalValue)
  };

  const onSubmit = async (data) => {
    let amount;
    if (data.amount) {
      amount = parseInt(data.amount);
    } else if (checkAmount != null) {
      amount = checkAmount;
    } else {
      Notiflix.Notify.warning('Please select the amount');
      return false;
    }
    setPaymentAmount(amount);

    Notiflix.Loading.pulse('Loading...');
    const obj = {
      amount: amount * 100,
      currency: 'INR',
    };
    try {
      const response = await createPaymentSession(obj);
      Notiflix.Loading.remove();
      if (response.data && response.data.id) {
        setOrder(response.data);
        loadRazor(response.data, amount);
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Create Payment Order');
      }
    } catch (e) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const loadRazor = (orderObj, amount) => {
    const options = {
      key: razorKey,
      currency: 'INR',
      amount: payment || amount,
      name: 'Top Up',
      description: 'User Topup',
      image: 'http://localhost:1337/logo.png',
      order_id: orderObj.id,
      handler: function (response) {
        submitPaymentdetails(response);
      },
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: `${user.email}`,
      },
    };
    console.log(options);
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const submitPaymentdetails = async (data) => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await submitPaymentId(data);
      Notiflix.Loading.remove();
      if (response.data && response.data.paymentId) {
        Notiflix.Notify.success('Payment Successfully Completed');
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Submit Payment Details');
      }
    } catch (e) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const withdraw = async (e)=>{
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await createMyRequests();
      Notiflix.Loading.remove();
      if (response.data && response.data.msg) {
        Notiflix.Notify.success('Request has been successfully created');
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Submit withdrawal request');
      }
    } catch (e) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  }

  const getWallet = async () => {
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const response = await getMyWallet();
      Notiflix.Loading.remove();
      if (response.data && response.data.walletId) {
        setWallet(response.data);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No wallet detail available');
      }
    } catch (e) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  useEffect(() => {
    const user = isAuthenticated();
    console.log(watchAmount);
    setUser(user);
    init();
    getWallet();
  }, [props, watch]);

  return (
    <SideMenuLayout title="Wallet">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            {user.role && user.role.indexOf('DOCTORS') == -1 ? (
              <div className="col-lg-5">
                <div className="col-lg-12  card">
                  <div className="card-body  p-4">
                    <div className="welcome-text">
                      <h4>Add Funds</h4>
                    </div>
                    {/* <div className="row">{loadCash()}</div> */}

                    <div className="form-group col-md-12 px-0">
                      <div className="form-group  mt-5" onChange={onChangeValue}>
                        {loadCash()}
                      </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <label>Other Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            name="amount"
                            min="50"
                            placeholder="E.g: 4"
                            {...register('amount')}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Add Funds
                      </button>
                    </form>
                    <br />
                    <div className="welcome-text">
                      Approximate amount you will get in your wallet after deducting (2% service charge + 18% GST) <br />
                      <h4>
                        {watchAmount != '' ? <>Rs {(watchAmount - ((watchAmount * 0.02) + (watchAmount * 0.02) * 0.18)).toFixed(2)}</> : ""}
                        {watchAmount == '' && calculated ? <>Rs {calculated}</> : ""}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ) : <div className="col-lg-5">
              <div className="col-lg-12  card">
                <div className="card-body  p-4">
                  <div className="welcome-text">
                    <h4>Amount Withdrawal Request</h4>
                  </div>
                  {/* <div className="row">{loadCash()}</div> */}

                  <div className="form-group col-md-12 col-sm-12 px-0">
                  <Withdrawal />
                  </div>

                </div>
              </div>
            </div>
            }
            <div className="col">
              <div className="row">
                <div className="col-lg-6 widget-stat card">
                  <div className="card-body  p-4">
                    <div className="media ai-icon">
                      <span className="mr-3 bgl-danger text-danger">
                        <svg
                          id="icon-revenue"
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-dollar-sign"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </span>
                      <div className="media-body">
                        <p className="mb-1">Amount</p>
                        {wallet && wallet.currency ? (
                          <h4 className="mb-0">
                            {wallet.currency.displayAs}{' '}
                            {wallet.availableFunds / 100}
                          </h4>
                        ) : (
                          <h4 className="mb-0"></h4>
                        )}

                        {/* <span className="badge badge-danger">-3.5%</span> */}
                        {user.role && user.role.indexOf('DOCTORS') != -1 && wallet.availableFunds / 100 > 100 ? (
                          <div className="mt-2">
                            <button
                              type="submit"
                              className="btn btn-sm btn-primary btn-block"
                              onClick={withdraw}
                            >
                              Request Withdrawal
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {user.role && user.role.indexOf('DOCTORS') == -1 ? (<div className="row">
                <div className="col-lg-12 card">
                  <div className="card-body">
                    <h3>Topup</h3>
                    <Transactions />
                  </div>
                </div>
              </div>) : null}
              <div className="row">
                <div className="col-lg-12 card">
                  <div className="card-body">
                    <h3>Transactions</h3>
                    <Ledgers />
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
