import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Icon, Image } from "semantic-ui-react";
import StateContext from "../../context/stateContext";
import { _forget } from "../../controllers/AxiosRequests";
import Alert from 'react-bootstrap/Alert'

const Forget = () => {
  const { setIsLogged } = useContext(StateContext);
  const [state, setState] = useState({
    email: "",
    success: "",
    error: ""
  });
  const history = useHistory();
  
  const handleOnClick = () => {
    _forget({ email: state.email }).then((res) => {
      if (res.status === "error") {
        setState({...state, error: res.message, success: ""})
        return;
      } else {
        setState({...state, success: "We sent your password reset link to your mail!", error: ""});
        return;
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
          {state.success !== "" && <Alert variant="success">
            <Alert.Heading>{state.success}</Alert.Heading>
          </Alert>}
          {state.error !== "" && <Alert variant="danger">
            <Alert.Heading>{state.error}</Alert.Heading>
          </Alert>}
          <Form>
            <Form.Group widths="equal">
              <Form.Field className="authForm">
                <Form.Input
                  placeholder="Email"
                  type="email"
                  onChange={(e, { value }) =>
                    setState({ ...state, email: value })
                  }
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field id="submitContainer">
                <Button id="authFormBtn" onClick={handleOnClick}>
                Send Password Reset Link
                </Button>
                <p>
                  Don't have account? <Link to="/auth/signUp">SignUp</Link>
                </p>
              </Form.Field>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Forget;
