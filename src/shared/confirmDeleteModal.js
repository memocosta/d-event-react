import React, { useContext, useEffect, useState } from "react";
import { Button, Icon, Transition } from "semantic-ui-react";
import StateContext from "../context/stateContext";

const ConfirmDeleteModal = () => {
  const { showModal, setShowModal, setConfirmDelete } = useContext(StateContext);
  const [visible, setVisible] = useState(false);
//   const [type, setType] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    if (showModal === "delete") {
      setVisible(true);
    }
    return () => {
      isMounted = false;
    };
  }, [showModal]);

  const handleOnClick = () => {
    setShowModal("");
    setVisible(false);
  };

  const handleConfirmDeleteClick = () => {
    setShowModal("");
    setVisible(false);
    setConfirmDelete(true);
  };

//   const handleOnClickPOS = (action) => {
//     setRedirect(action);
//     setShowModal("");
//   };

//   const handleOnClickClose = () => {
//     setRedirect("manageProject");
//     setShowModal('')
//   }
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
        <p
          style={{
            color: "#5abdbf",
            fontSize: "25px",
            fontWeight: "bold",
            marginBottom: 0,
          }}
        >
          Warning ! {" "}
          <Icon
            name="delete"
            size="large"
            style={{ marginBottom: "10px", color: "#f00" }}
          />
        </p>
        <p
          style={{
            color: "#5abdbf",
            marginBottom: 0,
          }}
        >
          Are You Sure You Want To Delete It ?
        </p>
        <>
        <Button
            style={{background:"red", color: "#fff"}}
            id="createTicketMBTN"
            onClick={() => handleConfirmDeleteClick()}
        >
            Confirm
        </Button>
        <Button
            id="createTicketMBTN"
            onClick={() => handleOnClick()}
        >
            Ignore
        </Button>
        </>
      </div>
    </Transition>
  );
};

export default ConfirmDeleteModal;
