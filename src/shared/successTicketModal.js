import React, { useContext, useEffect, useState } from "react";
import { Button, Icon, Transition } from "semantic-ui-react";
import StateContext from "../context/stateContext";

const SuccessTicketModal = () => {
  const { showModal, setShowModal, setRedirect } = useContext(StateContext);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('')

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    if (showModal === "successTicket") {
      setVisible(true);
      setType('Ticket')
    } else if (showModal === 'successItem') {
      setVisible(true)
      setType('Item')
    } else {
      setVisible(false);
    }
    return () => {
      isMounted = false;
    };
  }, [showModal]);

  const handleOnClick = (action) => {
    console.log('====================================');
    console.log(action);
    console.log('====================================');
    if(action === "Ticket"){
      setRedirect("createTicket");
    }else if(action === "addItems"){
      setRedirect("addItems");
    }else if(action === "POS/createPOS"){
      setRedirect("POS/createPOS");
    }
    setShowModal("");

    // if (action === "another") {
    //   window.location.reload();
    // } else {
    //   setRedirect(action);
    //   setShowModal("");
    // }
  };

  const handleOnClickClose = () => {
    setRedirect('/')
    setShowModal('')
  }
  return (
    <Transition visible={visible} duration={300} animation="scale">
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "37%",
          background: "#eee",
          zIndex: "999999",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div style={{ position: 'absolute', top: '15px', right: '25px', cursor: 'pointer' }} onClick={handleOnClickClose}>
          <span style={{ color: '#5abdbf', fontSize: '25px', fontWeight: 'bold' }}>&times;</span>
        </div>
        <p
          style={{
            color: "#5abdbf",
            fontSize: "25px",
            fontWeight: "bold",
            marginBottom: 0,
          }}
        >
          Congratulations{" "}
          <Icon
            name="thumbs up outline"
            size="large"
            style={{ marginBottom: "10px", color: "#5abdbf" }}
          />
        </p>
        <p
          style={{
            color: "#5abdbf",
            marginBottom: 0,
          }}
        >
          Your created a new {type}!
        </p>
        <br />
        {type === 'Ticket' && (
          <>
            <p
              style={{
                color: "#5abdbf",
                marginBottom: 0,
              }}
            >

              Now let's create some items to sell during your project.
          </p>
            <br />
          </>
        )}


        <Button id="createTicketMBTN" onClick={() => handleOnClick(type)}>
          Create Another {type}
        </Button>
        <Button id="createTicketMBTN" onClick={() => handleOnClick(type === 'Ticket' ? 'addItems' : 'POS/createPOS')}>
          Create {type === 'Item' ? 'Point Of Sale' : 'Items'}
        </Button>
      </div>
    </Transition>
  );
};

export default SuccessTicketModal;
