import React, { useContext, useEffect, useState } from 'react'
import { Icon, Modal } from 'semantic-ui-react';
import StateContext from '../context/stateContext';

const PaymentSuccessModal = () => {
    const { showModal, setShowModal } = useContext(StateContext);
    const [open, setOpen] = useState(false);
    useEffect(() => {
      let isMounted = true;
      if (!isMounted || showModal === "") return;
      if (showModal === "paymentConfirmed") {
        setOpen(true);
      } else {
        setOpen(false);
      }
      return () => {
        isMounted = false;
      };
    }, [showModal]);
    return (
      <Modal
        id="paymentConfirmed"
        dimmer={"blurring"}
        open={open}
        onClose={() => {
          setShowModal("");
          setOpen(false);
        }}
      >
        <Modal.Content>
                <div className='paymentConfirmed-container'>
                    <Icon name='check circle' size='massive'  />
                    <p>CONFIRMED</p>
                    <p style={{fontSize: "12px",fontWeight: "400"}}>Please wait we are proceeding with your order ....</p>
            </div>
        </Modal.Content>
      </Modal>
    );
}
 
export default PaymentSuccessModal;