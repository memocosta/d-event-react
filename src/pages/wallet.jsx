import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Grid, Icon, Message, TextArea } from "semantic-ui-react";
import StateContext from "../context/stateContext";
import {
  _getWallet,
  _getWalletChart,
  _sendMoney,
  _withdraw,
  _findUser,
  _getUser,
  _editUser,
} from "../controllers/AxiosRequests";
import { _isExist, _newChart } from "../controllers/functions";
import MainContent from "../shared/mainContent";
import moment from "moment";

const options = [
  { key: "1", text: "Past 7 days", value: "past7days" },
  { key: "2", text: "Past 30 days", value: "past30days" },
  { key: "3", text: "Full year", value: "fullYear" },
];
const Wallet = () => {
  const { isLogged, setToastAlert, setShowModal } = useContext(StateContext);
  const [withdrowState, setwithdrow] = useState({
    amount: "",
    serviceFee: "",
    net: "",
  });
  const [balanceState, setBalanceState] = useState({ amount: 0 });
  const [disabled, setDisabled] = useState(false);
  const [sendState, setSendState] = useState({
    user: "",
    amount: "",
    message: "",
    password: "",
  });
  const [transactionType, setTransactionType] = useState("send");
  const [Withdrawal, setWithdrawal] = useState("");
  const [validateUser, setValidateUser] = useState(false);
  const [bankAcountStatus, setBankAcountStatus] = useState(false)
  const [bankAcount, setBankAcount] = useState("")

  const handleAmountChange = (e) => {
    console.log(Number(e.target.value) - Number((e.target.value * 2.75) / 100));
    let value =
      e.target.value <= balanceState.amount
        ? e.target.value
        : balanceState.amount;
    setwithdrow({
      amount: value,
      serviceFee: Number((value * 2.75) / 100),
      net: Number(value) - Number((value * 2.75) / 100),
    });
  };
  const handleSetMax = () => {
    console.log(
      Number(balanceState.amount) - Number((balanceState.amount * 2.75) / 100)
    );
    setwithdrow({
      amount: balanceState.amount,
      serviceFee: Number((balanceState.amount * 2.75) / 100),
      net:
        Number(balanceState.amount) -
        Number((balanceState.amount * 2.75) / 100),
    });
  };

  const handle_withdraw = () => {
    setDisabled(true);
    if (withdrowState.amount === "") return;
    _withdraw(isLogged, withdrowState.amount).then((response) => {
      setDisabled(false);
      console.log(response);
      if (response.status === "success") {
        setBalanceState({ amount: balanceState.amount + response.data.amount });
        setwithdrow({ amount: "", serviceFee: "", net: "" });
        setShowModal("updateWalletSuccess");
      } else {
        setToastAlert({
          show: true,
          title: "Somthing Went Wrong",
          message: response.message,
        });
      }
    });
  };
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const checkUser = (value) => {
    if (validateEmail(value)) {
      _findUser(isLogged, value).then((res) => {
        if (res.status === "success") {
          console.log("user id is", res.data.id);
          setValidateUser(true);
        } else {
          console.log(res.message);
          setValidateUser(false);
        }
      });
    }
  };
  const handle_send = () => {
    if (sendState.amount === "") {
      setToastAlert({
        show: true,
        title: "Somthing Went Wrong",
        message: "Please Set the amount first",
      });
      return;
    }

    if (sendState.user === "") {
      setToastAlert({
        show: true,
        title: "Somthing Went Wrong",
        message: "Please Set the user email first",
      });
      return;
    }

    if (transactionType === "send" && sendState.password === "") {
      setToastAlert({
        show: true,
        title: "Somthing Went Wrong",
        message: "Please enter your password",
      });
      return;
    }

    if (transactionType === "send" && sendState.amount > balanceState.amount) {
      setToastAlert({
        show: true,
        title: "Somthing Went Wrong",
        message: "You don't have this amount in your wallet",
      });
      return;
    }
    setDisabled(true);

    _findUser(isLogged, sendState.user).then((res) => {
      if (res.status === "success") {
        let data = {
          partner_id: res.data.id,
          amount: sendState.amount,
          message: sendState.message,
          password: sendState.password,
        };
        if (transactionType === "receive") {
          data.qr = Math.floor(100000 + Math.random() * 900000);
        }
        console.log(data);
        _sendMoney(isLogged, data).then((response) => {
          setDisabled(false);
          console.log(response);
          if (response.status === "success") {
            if (transactionType === "send") {
              setBalanceState({
                amount: balanceState.amount - sendState.amount,
              });
              setShowModal("moneySent");
            }
            setSendState({ user: "", amount: "", message: "" });
            if (transactionType !== "send") {
              setShowModal("moneyReceive");
            }
          } else {
            setDisabled(false);
            setToastAlert({
              show: true,
              title: "Somthing Went Wrong",
              message: response.message,
            });
          }
        });
      } else {
        setDisabled(false);
        setToastAlert({
          show: true,
          title: "Somthing Went Wrong",
          message: "No User Found With This Email",
        });
      }
    });
  };

  const handleAutoWithdrawal = () => {
    if (Withdrawal === "") return;
    _editUser({ withdrawal: Withdrawal }, isLogged).then((response) => {
      setDisabled(false);
      console.log(response);
      if (response.status === "success") {
        setShowModal("updateWalletSuccess");
      } else {
        setDisabled(false);
        setToastAlert({
          show: true,
          title: "Somthing Went Wrong",
          message: response.message,
        });
      }
    });
  };
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    _isExist().then((user) => {
      if (user) {
        _getUser(user.token).then((data) => {
          if (data.status === "success") {
            setWithdrawal(user.withdrawal);
            if(data.data.bankAccount && data.data.bankAccount != null && data.data.bankAccount.IBAN && data.data.bankAccount.BIC){
              setBankAcountStatus(true);
              setBankAcount(JSON.parse(data.data.bankAccount).IBAN)
            }
          }
        });
      }
    });
    const walletChart = {
      chartCanvas: document.querySelector("#walletChart").getContext("2d"),
      data: [],
    };
    _getWallet(isLogged).then((response) => {
      if (response.status === "success") {
        setBalanceState({ amount: response.data.my_wallet });
      }
    });

    _getWalletChart(isLogged).then((response) => {
      if (response.status === "success") {
        walletChart.data = response.data;
        const chartWidgets = [walletChart];

        _newChart(chartWidgets);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isLogged]);
  return (
    <MainContent id="wallet">
      {bankAcountStatus === false ? <Message color="green">
        Make sure you get paid out by <b>completing your <Link to='/account/settings'>banking details</Link>.</b>{" "}
      </Message> : ""}
      <Grid>
        <Grid.Row columns="1">
          <Grid.Column>
            <div className="walletCard">
              <p>Wallet</p>
              <Grid verticalAlign="middle">
                <Grid.Row columns="2">
                  <Grid.Column>
                    <div className="walletSummary-text">
                      <p>ACCOUNT BALLANCE</p>
                      <p className="balance">&euro; {balanceState.amount.toFixed(2)}</p>
                      <div className="walletBalance-percentage">
                        <p>60%</p>
                        <span>Higher (past 7 days)</span>
                      </div>
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    {/* <Form.Select
                      fluid
                      options={options}
                      defaultValue="past7days"
                    /> */}
                    <div className="walletChart-container">
                      <div className="walletChart-header">
                        <div className="walletChart-title">
                          <p>Balance chart</p>
                          <p>{moment().format()}</p>
                        </div>
                        <div className="walletChart-data">
                          <p>
                            <Icon name="dropdown" size="small" className="up" />
                            260
                          </p>
                          <p>+12.5 (2.8%)</p>
                        </div>
                      </div>
                      <div className="walletChart-chart">
                        <canvas
                          id="walletChart"
                          style={{ padding: "5px" }}
                        ></canvas>
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns="2">
          <Grid.Column>
            <div className="walletCard walletCard-funds">
              <p >Add funds</p>
              <div className="addFunds-details">
                <p>Follow the instructions below:</p>
                <p>Send the desired amount to the following bank account:</p>
                <p>{bankAcount != "" ? bankAcount : "(not added)"}</p>
                <p style={{marginTop: "15px"}}>with your following user ID in communication: </p>
                <Form.Field width="16">
                  <Form.Input
                    width="16"
                    readOnly
                    value="ID0395959"
                    icon="copy"
                  />
                </Form.Field>
                <p style={{ marginTop: "43px" }}>
                  Any questions? <Link to="/contactus">Contact us</Link>
                </p>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="walletCard walletCard-funds">
              <p className="withdrawFunds-title">Withdraw funds</p>
              <div className="withdrawFunds-details">
                <Form className="withdrawalFunds-form">
                  <Form.Group widths="5">
                      <Form.Input
                        width="5"
                        type="number"
                        min={1}
                        label=" "
                        max={balanceState}
                        action={{ content: "MAX", onClick: handleSetMax }}
                        onChange={handleAmountChange}
                        value={withdrowState.amount}
                      />
                      <Form.Input
                        width="4"
                        type="number"
                        placeholder="Service fee"
                        label="Service fee: 2.75%"
                        disabled
                        value={withdrowState.serviceFee}
                      />
                      <Form.Input type="number" placeholder="VAT" disabled 
                        label="VAT"
                        width="4"
                      />
                      <Form.Input
                        type="number"
                        label="Net Amount"
                        placeholder="Net Amount"
                        disabled
                        value={withdrowState.net}
                        width="4"
                      />
                  </Form.Group>
                  {/* <Form.Group widths="equal"> */}
                  {/* <Form.Field>
                      <Form.Input type="text" placeholder="VAT" />
                    </Form.Field> */}
                  {/* <Form.Field>
                      <Form.Input type="text" placeholder="Net Amount" />
                    </Form.Field> */}
                  {/* </Form.Group> */}
                  <div style={{ textAlign: "right" }}>
                    <Button
                      primary
                      id="withdrawalBtn"
                      content="WITHDRAW"
                      onClick={handle_withdraw}
                      disabled={disabled}
                      loading={disabled}
                      style={{marginRight: "-.2em"}}
                    />
                  </div>
                </Form>
              </div>
              <hr />
              <p
                style={{
                  fontSize: "13px",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Set automatic withdrawal
              </p>
              <div className="withdrawFunds-automatic ">
                <Form style={{ width: "100%" }}>
                  <Form.Group widths="16">
                    <Form.Field width="8">
                      <Form.Input
                        type="number"
                        min={1}
                        placeholder="Set withdrawal threshold"
                        value={Withdrawal}
                        onChange={(e, { value }) => setWithdrawal(value)}
                      />
                    </Form.Field>
                    <Form.Field width="8" style={{ textAlign: "right" }}>
                      <Button
                        primary
                        id="confirmBtn"
                        content="CONFIRM"
                        onClick={handleAutoWithdrawal}
                        disabled={disabled}
                        loading={disabled}
                      style={{marginRight: "-.2em"}}
                      />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </div>
              <div className="withdrawalFunds-desc">
                <p>
                  Everytime your wallet balance reaches the threshold amount,
                  the money is automatically withdrawn to your bank account.
                </p>
              </div>
              <p style={{ fontSize: "10px", color: "#5abdbf" }}>
                Your current bank account is {bankAcount != "" ? bankAcount : "(not added)"}{" "}
                <Link to="/account/settings">click here</Link> to update it
              </p>
            </div>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns="1">
          <Grid.Column>
            <div className="walletCard">
              <p>Manage Transactions</p>
              <div className="money-actions">
                <ul>
                  <li
                    className={transactionType === "send" ? "active" : ""}
                    onClick={() => setTransactionType("send")}
                  >
                    Send Money
                  </li>
                  <li
                    className={transactionType === "receive" ? "active" : ""}
                    onClick={() => setTransactionType("receive")}
                  >
                    receive Money
                  </li>
                </ul>
              </div>
              <div className="transaction-form">
                <p>
                  Send{" "}
                  {transactionType === "receive"
                    ? "an invitation to pay"
                    : "Money"}
                </p>
                <Form>
                  <Form.Field>
                    <Form.Input
                      type="email"
                      placeholder="Search user"
                      value={sendState.user}
                      onChange={(e, { value }) => {
                        checkUser(value);
                        setSendState({ ...sendState, user: value });
                      }}
                      autoComplete="nope"
                      icon={validateUser && "check circle"}
                    />
                  </Form.Field>
                  {transactionType === "send" && (
                    <Form.Field>
                      <Form.Input
                        type="password"
                        placeholder="Password"
                        value={sendState.password}
                        onChange={(e, { value }) =>
                          setSendState({ ...sendState, password: value })
                        }
                        autoComplete="nope"
                      />
                    </Form.Field>
                  )}
                  <Form.Field>
                    <Form.Input
                      type="number"
                      min="1"
                      placeholder="Amount"
                      value={sendState.amount}
                      onChange={(e, { value }) =>
                        setSendState({ ...sendState, amount: value })
                      }
                    />
                    <TextArea
                      placeholder="Communication"
                      rows="6"
                      value={sendState.message}
                      onChange={(e, { value }) =>
                        setSendState({ ...sendState, message: value })
                      }
                      style={{ color: "white" }}
                    ></TextArea>
                  </Form.Field>
                  <Button
                    primary
                    id="sendTransaction"
                    onClick={handle_send}
                    disabled={disabled}
                    loading={disabled}
                  >
                    {transactionType === "send" ? "Send money" : "Send Request"}
                  </Button>
                </Form>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </MainContent>
  );
};

export default Wallet;
