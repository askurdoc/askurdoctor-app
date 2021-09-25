import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import List from './List.js';
import TimeAgo from 'timeago-react';

import Notiflix from 'notiflix';
import { getMyTransactions } from '../../services/payment.service';
import ModalBox from './ModalBox';


export default function RecentTransaction({ userDetail }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setType] = useState(null);
  const [user, setUser] = useState({});
  const [gCoinStore, setCoins] = useState([]);
  const [txn, setTxn] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

 

  const cancel = () => {
    setShowModal(false);
    setType(null);
  };

  const getTxnData = async () => {
    setIsLoading(true);
    console.log('txn')
    try {
      const response = await getMyTransactions();
      console.log(response.data);
      if (response.data && response.data.length > 0) {
        setTxn(response.data);
      }
    } catch (e) {
      console.log('ERROR');
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(userDetail)
    getTxnData();
    setUser(userDetail);
  }, []);

  const loadtxn = () => {
    return txn.map((txn, idx) => {
      return (
        <>
          <article className="p-4 flex space-x-4">
            <div className=" pt-1">
              <img
                src={require('assets/img/coin.png')}
                alt=""
                style={{ width: '25px', height: '25px' }}
                className="flex"
                width="25"
                height="25"
              />
            </div>
            <div className="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
              <h2 className="text-lg text-gray-800 mb-0.5">
                Purchased coins for $
                {txn.stripeChargeObj.data.object.amount / 100}
              </h2>
              <dl className="flex flex-wrap text-sm font-medium whitespace-pre">
                <div>
                  <dt className="sr-only">Time</dt>
                  <dd>
                    <abbr title={`${txn.createdAt}`}></abbr>
                  </dd>
                </div>
                {/* <div>
                  <dt className="sr-only">Difficulty</dt>
                  <dd> · {txn.stripeIntentId}</dd>
                </div>
                <div>
                  <dt className="sr-only">Servings</dt>
                  <dd> · {txn.stripeIntentId} </dd>
                </div> */}
                <div className="flex-none w-full mt-0.5 font-normal">
                  <dt className="inline font-thin">
                    Stripe Payment Reference Id:
                  </dt>
                  <dd className="inline text-black"> {txn.stripeIntentId}</dd>
                </div>
                <div className="absolute top-0 right-0 rounded-full bg-amber-50 text-amber-900 px-2 py-0.5 hidden sm:flex lg:hidden xl:flex items-center space-x-1">
                  <dt className="text-amber-500">
                    <span className="sr-only">Rating</span>
                    <TimeAgo datetime={txn.createdAt} locale="en" />
                    <br />
                    <span className="inline font-thin">({txn.createdAt})</span>
                  </dt>
                  {/* <dd>{txn.rating}</dd> */}
                </div>
              </dl>
            </div>
          </article>
        </>
      );
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 w-full  mx-auto">
        {txn ? <List>{loadtxn()}</List> : <>Not Available</>}
      </div>
    </>
  );
}
