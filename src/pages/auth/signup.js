import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Icon, Image } from "semantic-ui-react";
import { _signUpUser } from "../../controllers/AxiosRequests";

const SignUp = () => {
  const [state, setState] = useState({
    companyName: "",
    companyVAT: "",
    email: "",
    password: "",
    confirmpassword: "",
    disabled: false,
    error: "",
  });
  const history = useHistory();

  const handleOnSubmit = () => {
    setState({ ...state, disabled: true });
    if (state.password !== state.confirmpassword) {
      setState({ ...state, error: "password", disabled: false });
      return;
    }
    const signUpData = {
      password: state.password,
      name: state.companyName,
      email: state.email,
      VAT: state.companyVAT,
    };
    _signUpUser(signUpData).then((res) => {
      if (res.status !== "error") {
        setState({ ...state, disabled: false });
        history.push("/auth/login");
      }else{
        setState({ ...state, error: res.message , disabled: false});
      }
    });
  };
  return (
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
          height: "529px",
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
          width: "455px",
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        <div className="sign-upForm">
          <p>Create your Account</p>
        </div>
        <Form>
          <Form.Group widths="equal">
            <Form.Field className="authForm">
              <Form.Input
                placeholder="Company Name"
                type="text"
                onChange={(e, { value }) =>
                  setState({ ...state, companyName: value })
                }
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field className="authForm">
              <Form.Input
                placeholder="Company VAT"
                type="tex"
                onChange={(e, { value }) =>
                  setState({ ...state, companyVAT: value })
                }
              />
            </Form.Field>
          </Form.Group>
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
            <Form.Field className="authForm">
              <Form.Input
                placeholder="Password"
                type="password"
                error={
                  state.error === "password"
                    ? {
                        content: "Wrong Password",
                        pointing: "below",
                      }
                    : null
                }
                onChange={(e, { value }) =>
                  setState({ ...state, password: value })
                }
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field className="authForm">
              <Form.Input
                placeholder="Confirm Password"
                type="password"
                onChange={(e, { value }) =>
                  setState({ ...state, confirmpassword: value })
                }
              />
            </Form.Field>
          </Form.Group>
          {state.error !== "" && <div style={{color:"red",textAlign: "center",padding: "10px"}}>{state.error}</div>}
          <Form.Group widths="equal">
            <Form.Field id="submitContainer">
              <Button
                id="authFormBtn"
                disabled={state.disabled}
                loading={state.disabled}
                onClick={handleOnSubmit}
              >
                Sign up
              </Button>
              <p>
                Already have account? <Link to="/auth/login">SignIn</Link>
              </p>
            </Form.Field>
          </Form.Group>
        </Form>
        <div className="credentials">
          <p>
            By creating an account you agree to our <br />
            Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
