import React, { useContext, useEffect, useState } from "react";
import { Icon, Transition } from "semantic-ui-react";
import StateContext from "../context/stateContext";

const UpdateSuccess = () => {
  const { showModal, setShowModal, setRedirect } = useContext(StateContext);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("");
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    if (showModal === "updateSuccess") {
      setVisible(true);
      setType("Ticket");
    } else if (showModal === "updateProjectSuccess") {
      setVisible(true);
      setType("Project");
    }else if (showModal === "updatePosSuccess") {
      setVisible(true);
      setType("POS");
    } else if (showModal === "updateItemSuccess") {
      setVisible(true);
      setType("Item");
    } else if (showModal === 'updateAccountSuccess') {
      setVisible(true);
      setType("Account");
    } else if (showModal === 'updateWalletSuccess') {
      setVisible(true);
      setType("Wallet");
    } else if (showModal === 'moneySent') {
      setVisible(true);
      setType("moneySent");
    } else if (showModal === 'moneyReceive') {
      setVisible(true);
      setType("moneyReceive");
    } else {
      setVisible(false);
    }
    return () => {
      isMounted = false;
    };
  }, [showModal]);

  const handleOnClick = () => {
    setRedirect("manageProject");
    setShowModal("");
  };
  const handleOnClickClose = () => {
    setRedirect("manageProject");
    setShowModal('')
  }
  return (
    <Transition visible={visible} duration={300} animation="scale">
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "42%",
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
          {type === "moneySent" ?   "Money Successfully sent" : type === "moneyReceive" ? "The Request has been sent successfully": `${type} Updated Successfully`} 
        </p>
        <Icon
          name="check circle"
          style={{
            marginTop: "26px",
            color: "#5abdbf",
            fontSize: "120px",
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            alignItems: "center",
            width: "100%",
          }}
          onClick={handleOnClick}
        />
      </div>
    </Transition>
  );
};

export default UpdateSuccess;
