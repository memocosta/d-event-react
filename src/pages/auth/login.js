import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Icon, Image } from "semantic-ui-react";
import StateContext from "../../context/stateContext";
import { _storeToken } from "../../controllers/functions";
import { _getTokenID } from "../../controllers/AxiosRequests";

const Login = () => {
  const { setIsLogged } = useContext(StateContext);
  const [state, setState] = useState({
    email: "",
    password: "",
    rememberMe: false,
    error: ""
  });
  const history = useHistory();

  // useEffect(() => {
  //   let isMounted = true;
  //   if (!isMounted) return;

  //   if (isLogged !== "") {
  //     history.push("/");
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [isLogged]);
  const handleOnClick = () => {
    _getTokenID({ email: state.email, password: state.password }).then((res) => {
      console.log(res);
      if (res.status === "error") {
        console.log(res);
        setState({...state, error: res.message})
        return;
      }
      _storeToken({ token: res.data }).then((res) => {
        console.log(res);
        if (!res || !res.success || !res.success.token) {
          return;
        }
        setIsLogged(res.success.token);
        history.push("/");
      });
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
            width: "455px",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          <div className="sign-upForm">
            <p>Sign in to your account</p>
          </div>
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
              <Form.Field>
                <Form.Checkbox
                  id="rememberMe"
                  label="Remember me"
                  onChange={(e, { checked }) =>
                    setState({ ...state, rememberMe: checked })
                  }
                />
              </Form.Field>
              <Form.Field style={{ textAlign: "right" }}>
                <Link to="/auth/forget" style={{ fontSize: "13px" }}>
                  Forget Password?
                </Link>
              </Form.Field>
            </Form.Group>
          {state.error !== "" && <div style={{color:"red",textAlign: "center",padding: "10px"}}>{state.error}</div>}
            <Form.Group widths="equal">
              <Form.Field id="submitContainer">
                <Button id="authFormBtn" onClick={handleOnClick}>
                  Sign in
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

export default Login;
