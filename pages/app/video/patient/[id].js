import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import dynamic from 'next/dynamic';

const DailyChat = dynamic(() => import('../../../../components/DailyChat'), {
  ssr: false,
});

import SideMenuLayout from '../../../../layouts/SideMenuLayout';

export default function patientVideo() {
  const router = useRouter();
  const { id, token, userId, room } = router.query;
  const joining = () => {
  };
  return (
    <SideMenuLayout title="Doctor Consultation">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex doctor-info-details mb-sm-5 mb-3">
                    {/* <AgoraVideo id={id} token={token} userId={userId} type="patient" /> */}
                    <DailyChat
                      id={id}
                      token={token}
                      userId={userId}
                      room={room}
                      callBack={joining}
                      type="patient"
                    />
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
