import React, { useContext, useEffect, useState } from "react";
import { Button, Icon, Transition } from "semantic-ui-react";
import StateContext from "../context/stateContext";

const SuccessModal = () => {
  const { showModal, setShowModal, setRedirect } = useContext(StateContext);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    if (showModal === "success") {
      setVisible(true);
      setType("Project");
    } else if (showModal === "successPOS") {
      setVisible(true);
      setType("POS");
    }else if (showModal === "successOrder") {
      setVisible(true);
      setType("Order");
    } else {
      setVisible(false);
    }
    return () => {
      isMounted = false;
    };
  }, [showModal]);

  const handleOnClick = () => {
    setRedirect("createTicket");
    setShowModal("");
  };

  const handleOnClickPOS = (action) => {
    setRedirect(action);
    setShowModal("");
  };

  const handleOnClickClose = () => {
    if(type !== "Order"){
      setRedirect("manageProject");
    }
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
          You created a new {type}!
        </p>
        {type === "Project" && (
          <p
            style={{
              color: "#5abdbf",
              marginBottom: 0,
            }}
          >
            You can select it from the drop-down menu in the header.
          </p>
        )}
        <br />
        <p
          style={{
            color: "#5abdbf",
          }}
        >
          {type === "Project" && "Now let's create a ticket"}
          {type === "POS" && "Now you can manage your event"}
        </p>

        {type === "Order"? "" : type === "POS" ? (
          <>
            <Button
              id="createTicketMBTN"
              onClick={() => handleOnClickPOS("POS/createPOS")}
            >
              Create Another POS
            </Button>
            <Button
              id="createTicketMBTN"
              onClick={() => handleOnClickPOS("manageProject")}
            >
              Manage Event
            </Button>
          </>
        ) : (
            <Button id="createTicketMBTN" onClick={handleOnClick}>
              Create a Ticket
            </Button>
          )}
      </div>
    </Transition>
  );
};

export default SuccessModal;
