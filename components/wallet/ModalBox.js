import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useForm } from 'react-hook-form';

export default function ModalBox({ coinsStore, type, cancel, payment }) {
  const [item, setItem] = useState(0);
  const [cash, setCash] = useState(null);
  const [coins, setCoins] = useState([]);
  const [otherAmount, setOtherAmount] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
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

  useEffect(() => {
    setOtherAmount(0);
    setCoins(coinsStore);
  }, [coinsStore]);

  const loadCoins = (type) => {
    const list = [];

    coins.map((coin) => {
      list.push(
        <div className="">
          <button
            className="px-4 py-2 text-gray-600 font-semibold border rounded w-full"
            onClick={() => {
              setItem(coin.item);
            }}
          >
            {coin.count} <span className="font-light text-xs">Coins for</span> $
            {coin.amount}
          </button>
        </div>,
      );
    });
    return list;
  };

  const loadCash = (type) => {
    const list = [];

    amount.map((value) => {
      list.push(
        <div className="">
          <button
            className="px-4 py-2 text-gray-600 font-semibold border rounded w-full"
            onClick={() => {
              setCash(value);
            }}
          >
            ${value.display}
          </button>
        </div>,
      );
    });
    return list;
  };

  if (type == 'COIN') {
    return (
      <div className="">
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-10 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"></div>
        <div
          className="absolute z-20 py-3 min-w-200 max-w-400 h-200 mx-auto"
          style={{ left: '35%' }}
        >
          <div className="bg-white shadow-lg  border sm:rounded-3xl p-8 flex space-x-8">
            <div className="flex flex-col rounded-lg ">
              <div className="flex flex-row justify-between p-6  rounded-tl-lg rounded-tr-lg">
                <p className="font-semibold text-gray-800">Add Coins</p>
                <button
                  className="active:bg-gray-700   text-gray-800   outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    cancel();
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 m-4 gap-4 ">{loadCoins()}</div>

              <div className="mt-5 flex flex-row items-center justify-center p-5 border-t border-gray-200 rounded-bl-lg rounded-br-lg">
                <button
                  className="px-4 py-2 text-white font-semibold bg-blue-500 rounded"
                  onClick={() => {
                    const keyValue = _.keyBy(coins, 'item');
                    payment(keyValue[item], type);
                  }}
                >
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="">
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-10 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"></div>
        <div
          className="absolute z-20 py-3 w-200 h-200 mx-auto"
          style={{ left: '35%' }}
        >
          <div className="bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-8 flex space-x-8">
            <div className="flex flex-col rounded-lg ">
              <div className="flex flex-row justify-between p-6  border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
                <p className="font-semibold text-gray-800">Add Fund</p>
                <button
                  className="active:bg-gray-700   text-gray-800   outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    cancel();
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 m-4 gap-4 ">{loadCash()}</div>
              <div className="grid grid-cols-1 m-4 gap-4 ">
                <input
                  type="number"
                  className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                  placeholder="Other Amount"
                  onChange={(e) => {
                    setOtherAmount(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-row items-center justify-between p-5 border-t border-gray-200 rounded-bl-lg rounded-br-lg">
                <button
                  className="px-4 py-2 text-white font-semibold bg-blue-500 rounded"
                  onClick={() => {
                    let data;
                    if (otherAmount > 0) {
                      data = {};
                      data.amount = otherAmount;
                      data.type = 'otherAmount';
                    } else {
                      data = { ...cash };
                    }
                    payment(data, type);
                  }}
                >
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
