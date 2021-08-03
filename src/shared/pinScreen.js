import React from "react";
import { useState } from "react";
import { Button, Form } from "semantic-ui-react";

const PinScreen = ({ setPinCode }) => {
  const [state, setState] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleConfirm = () => {
    setDisabled(true);
    setPinCode(state);
  };

  const formStyle = {
    width: "400px",
    background: "#eee",
    padding: "20px",
    borderRadius: "15px",
    maxWidth: "100%",
    height: "230px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-around",
  }

  return (
    <div
      style={{
        backgroundColor: "#00092a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Form style={formStyle}>
            <Form.Input
              label="POS PIN code"
              placeholder="pin code..."
              onChange={(e, { value }) =>
                setState(value)
              }
              value={state.pin_code}
              required
            />
        <Button
          primary
          disabled={disabled}
          loading={disabled}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </Form>
    </div>
  );
};

export default PinScreen;
