import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Icon, Image } from "semantic-ui-react";
import { _storeToken } from "../../controllers/functions";
import { _reset } from "../../controllers/AxiosRequests";
import Alert from 'react-bootstrap/Alert'

const Reset = ({ match }) => {
  const [state, setState] = useState({
    password: "",
    error: "",
    disabled: false
  });
  const history = useHistory();
  
  const handleOnClick = () => {
    setState({ ...state, disabled: true });
    _reset({ password: state.password, token: match.params.id }).then((res) => {
      if (res.status === "error") {
        setState({...state, error: res.message, success: ""})
        return;
      } else {
        setState({ ...state, disabled: false });
        window.location.replace('http://bydotpy.com/d-event/auth/login');
        //history.push("/auth/login");
      }
    });
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "#eee",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#00092a",
            padding: "70px",
            height: "406px",
            width: "455px",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
            position: "relative",
          }}
        >
          <div className="logo-img">
            <Image src="/images/devent-logo-text-300x123.png" />
            {/* <h2>VENT</h2> */}
          </div>
          <div className="welcome-title">
            <p>Welcome to d-event</p>
          </div>
          <div className="login-footer">
            <a target="_blank" href="https://web.facebook.com/decentralizedevent"><Icon name="facebook f" /></a>
            <a target="_blank" href="https://www.instagram.com/devent.io/"><Icon name="instagram" /></a>
            <a target="_blank" href="https://twitter.com/deventplatform"><Icon name="twitter" /></a>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "70px",
            position: "relative",
            height: "406px",
            width: "455px",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          <div className="sign-upForm">
            <p>Reset Password</p>
          </div>
          {state.error !== "" && <Alert variant="danger">
            <Alert.Heading>{state.error}</Alert.Heading>
          </Alert>}
          <Form>
            <Form.Group widths="equal">
              <Form.Field className="authForm">
                <Form.Input
                  placeholder="Password"
                  type="password"
                  onChange={(e, { value }) =>
                    setState({ ...state, password: value })
                  }
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field id="submitContainer">
                <Button id="authFormBtn" disabled={state.disabled} loading={state.disabled} onClick={handleOnClick}>
                  Reset Password
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Reset;
