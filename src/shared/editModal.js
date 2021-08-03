import React, { useContext, useEffect, useState } from "react";
import { Button, Icon, Transition } from "semantic-ui-react";
import StateContext from "../context/stateContext";

const EditModal = () => {
  const { showModal, setShowModal, setRedirect } = useContext(StateContext);
  const [visible, setVisible] = useState(false);
  const [editType, setEditType] = useState("");
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    if (showModal === "editProjectSuccess") {
      setVisible(true);
      setEditType("project");
    } else if (showModal === "editTicketSuccess") {
      setVisible(true);
      setEditType("ticket");
    } else {
      setVisible(false);
    }
    return () => {
      isMounted = false;
    };
  }, [showModal]);

  const handleOnClick = () => {
    setRedirect("/");
    setShowModal("");
  };
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
          Your edit a your {editType}!
        </p>
        <p
          style={{
            color: "#5abdbf",
          }}
        >
          Now let's go back!
        </p>

        <Button id="createTicketMBTN" onClick={handleOnClick}>
          Go Back
        </Button>
      </div>
    </Transition>
  );
};

export default EditModal;
