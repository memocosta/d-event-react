import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Form,
  Radio,
  Transition,
} from "semantic-ui-react";
import MainContent from "../../shared/mainContent";
import StateContext from "../../context/stateContext";
import DateTimeShared from "../../shared/dateTimeShared";
import EditorShared from "../../shared/editorShared";
import LoadingScreen from "../../shared/loadingScreen";
import moment from "moment";
import { _getTicketData, _editTicket } from "../../controllers/AxiosRequests";
import { _validateForm } from "../../controllers/functions";
import UploadShared from "../../shared/uploadShared";
import { _isSelectedProject } from "../../controllers/functions";
import { useHistory } from "react-router-dom";
import { keys } from "../../config/keys";

const options = [
  { key: "0", text: "Entry Ticket", value: "entry" },
  { key: "1", text: "Beverage Ticket", value: "beverage" },
  { key: "2", text: "Food Ticket", value: "food" },
  { key: "3", text: "Service Ticket", value: "service" },
  { key: "4", text: "Good Ticket", value: "good" },
  { key: "5", text: "Voucher Ticket", value: "voucher" },
];
const exRefOptions = [
  { key: "0", text: "Yes", value: "yes" },
  { key: "1", text: "No", value: "no" },
];
const channelOptions = [
  { key: "0", text: "Everywhere", value: "everywhere" },
  { key: "1", text: "On site only", value: "site" },
  { key: "2", text: "Private (by email only)", value: "email" },
  { key: "3", text: "Online only", value: "online" },
];

const EditTicket = ({ match }) => {
  const [show, setShow] = useState({ id: "", show: false });
  const history = useHistory();
  const [state, setState] = useState({
    kind: "",
    name: "",
    quantity: "",
    price: 0,
    ticketType: "",
    image: "",
    refundable: false,
    exchangeable: false,
    validity: false,
    startDate: moment().format(),
    endDate: moment().format(),
    channel: "",
    desc: "",
    terms: "",
    vat_rate: 0,
    banner: "",
  });
  const [tabs, setTabs] = useState("tab1");
  const [disabled, setDisabled] = useState(false);
  const { setShowModal, setLoading, isLogged, loading, setToastAlert, selectedProject } = useContext(
    StateContext
  );
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (!isMounted || match.params.id === "") return;
    setLoading(true);
    _getTicketData(match.params.id).then((response) => {
      let res = response.data;
      console.log(res);
      _isSelectedProject(response.data.project_id).then((sel) => {
        if(!sel) history.push("/");
      });
      setState({
        quantity: res.quantity != 100000 ? res.quantity : "",
        name: res.name,
        exchangeable: res.exchangeable,
        refundable: res.refundable,
        terms: res.terms,
        desc: res.description,
        image: res.image
          ? `${keys.SERVER_IP}/images/${res.image.for}/${res.image.name}`
          : "",
        price: res.price,
        validity: res.validity,
        startDate: res.from,
        endDate: res.to,
        channel: res.channel,
        ticketType: res.type,
        kind: res.kind,
        vat_rate: res.vat_rate,
        banner: res.image_id ? res.image_id : "",
      });
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [setLoading, match.params.id, selectedProject]);

  const handleRadioChange = (e, { value, checked }) => {
    if (checked) {
      if (value === "free") {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
      setState({ ...state, kind: value });
    }
  };

  const handleOnClick = (type) => {
    switch (type) {
      case "next":
        setTabs("");
        setTimeout(() => {
          setTabs("tab2");
        }, 500);
        return;
      case "back":
        setTabs("");
        setTimeout(() => {
          setTabs("tab1");
        }, 500);
        return;
      case "finish":
        if (!state.validity && state.endDate <= state.startDate) {
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "The End date must be after the start date.",
          });
          return;
        }
        if (!state.ticketType || state.ticketType === "") {
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "Please Select The Ticket Type",
          });
          return;
        }
        if (!state.banner) {
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "Please Add an Image to the ticket!",
          });
          return;
        }
        let formData = {
          name: state.name,
          price: state.price ? parseFloat(state.price) : state.price,
          quantity:
            state.quantity === "" || state.quantity === null
              ? 100000
              : parseFloat(state.quantity),
          type: state.ticketType,
          channel: state.channel,
          exchangeable: state.exchangeable,
          refundable: state.refundable,
          validity: state.validity,
          from: state.startDate,
          to: state.endDate,
          kind: state.kind,
          description: state.desc,
          terms: state.terms,
          vat_rate: state.vat_rate,
        };
        if (state.banner != "") {
          formData.image_id = state.banner;
        }
        
        const validate = _validateForm(formData, "ticket");

        if (!validate) {
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "Please fill the form correctly then try again!",
          });
          return;
        }
        
        _editTicket(formData, isLogged, match.params.id).then((res) => {
          console.log(res);
          if (res.status === "error") {
            setError(res.message);
            setToastAlert({
              show: true,
              message: res.message,
            });
            return;
          }
          setShowModal("updateSuccess");
        });
        return;
      default:
        break;
    }
  };

  const handleToggle = (e, { value, checked }) => {
    setState({ ...state, channel: value });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <MainContent id="createTicket" subClass="small-sub-content">
      <div className="dashboard-header mb-2">
        <h3 style={{ color: "#5abdbf" }}>
          Edit Ticket ({tabs === "tab1" ? "1" : "2"} / 2)
        </h3>
      </div>
      <div className="create-event-form">
        <Form>
          <Transition
            visible={tabs === "tab1" ? true : false}
            animation="scale"
            unmountOnHide
            duration={500}
          >
            <Container>
              <Form.Group>
                <Form.Field width="3">
                  <Radio
                    label="Free"
                    name="ticketType"
                    value="free"
                    checked={state.kind === "free"}
                    onChange={handleRadioChange}
                  />
                </Form.Field>
                <Form.Field width="3">
                  <Radio
                    label="Paid"
                    name="ticketType"
                    value="paid"
                    checked={state.kind === "paid"}
                    onChange={handleRadioChange}
                  />
                </Form.Field>
                <Form.Field width="3">
                  <Radio
                    label="Donation"
                    name="radioGroup"
                    value="donation"
                    checked={state.kind === "donation"}
                    onChange={handleRadioChange}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field width="8">
                  <Form.Input
                    label="Ticket Name"
                    type="text"
                    value={state.name}
                    placeholder="Drink Token"
                    onChange={(e, { value }) =>
                      setState({ ...state, name: value })
                    }
                    required
                  />
                </Form.Field>
                <Form.Field width="8">
                  <Form.Input
                    label="Quantity"
                    type="number"
                    min={1}
                    value={state.quantity}
                    onChange={(e, { value }) =>
                      setState({ ...state, quantity: value })
                    }
                    placeholder="Not specified"
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field width="8">
                  <Form.Input
                    label="Price (Tax and Fee inc)"
                    type="number"
                    min={1}
                    value={state.price}
                    disabled={state.kind === "free"}
                    onChange={(e, { value }) =>
                      setState({ ...state, price: value })
                    }
                    placeholder="1,2"
                    required
                  />
                </Form.Field>
                <Form.Field width="8">
                  <Form.Select
                    fluid
                    id="ticketType"
                    label="Ticket Type"
                    value={state.ticketType}
                    onChange={(e, { value }) =>
                      setState({ ...state, ticketType: value })
                    }
                    onClick={() => setShow({ id: "1", show: !show.show })}
                    className={`ticketType ${
                      show.show && show.id === "1" ? "active" : ""
                    }`}
                    required
                    options={options}
                    placeholder="Select Ticket"
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field width="8">
                  <Form.Select
                    fluid
                    id="refundable"
                    disabled={state.kind === "free"}
                    label="Refundable"
                    onChange={(e, { value }) =>
                      setState({
                        ...state,
                        refundable: value === "yes" ? true : false,
                      })
                    }
                    value={state.refundable ? "yes" : "no"}
                    onClick={() => setShow({ id: "2", show: !show })}
                    className={`${show ? "active" : ""}`}
                    required
                    options={exRefOptions}
                    placeholder="YES / NO"
                  />
                </Form.Field>
                <Form.Field width="8">
                  <Form.Select
                    fluid
                    id="exchangeable"
                    label="Exchangeable"
                    value={state.exchangeable ? "yes" : "no"}
                    onChange={(e, { value }) =>
                      setState({
                        ...state,
                        exchangeable: value === "yes" ? true : false,
                      })
                    }
                    onClick={() => setShow({ id: "3", show: !show })}
                    className={`${show ? "active" : ""}`}
                    required
                    options={exRefOptions}
                    placeholder="YES / NO"
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field width="8">
                <Form.Input
                  label="VAT Rate (%)"
                  type="number"
                  min={1}
                  onChange={(e, { value }) =>
                    setState({ ...state, vat_rate: value })
                  }
                  placeholder="1,2"
                  value={state.vat_rate}
                />
              </Form.Field>
              <DateTimeShared
                title="validity"
                subTitle="Validty stops after first scan"
                data={{
                  ongoing: state.validity,
                  startDate: state.startDate,
                  endDate: state.endDate,
                }}
                ongoing={(value) => setState({ ...state, validity: value })}
                setTimeDate={(value) => {
                  if (value.type === "start") {
                    setState({ ...state, startDate: value.date });
                  } else {
                    setState({ ...state, endDate: value.date });
                  }
                }}
                from={state.startDate}
                to={state.endDate}
                value={state.validity}
              />
              <Form.Field width="8">
                <div style={{ marginTop: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p style={{ color: "#c5c7de" }}>Sell online</p>
                    <Form.Group>
                      <Form.Field width="8">
                        <Radio
                          label="ON"
                          name="ticketChannel"
                          value="everywhere"
                          checked={state.channel === "everywhere"}
                          onChange={handleToggle}
                        />
                      </Form.Field>
                      <Form.Field width="4">
                        <Radio
                          label="OFF"
                          name="ticketChannel"
                          value="site"
                          checked={state.channel === "site"}
                          onChange={handleToggle}
                        />
                      </Form.Field>
                    </Form.Group>
                  </div>
                </div>
              </Form.Field>
            </Container>
          </Transition>
          <Transition
            visible={tabs === "tab2" ? true : false}
            animation="scale"
            unmountOnHide
            duration={500}
          >
            <Container>
              <EditorShared
                title="Ticket Description*"
                data={state.desc}
                setData={(value) => setState({ ...state, desc: value })}
              />
              <EditorShared
                title="Ticket terms and conditions*"
                data={state.terms}
                setData={(value) => setState({ ...state, terms: value })}
              />
              <br />
              <UploadShared
                title="Add Ticket Image*"
                id="editTicketImg"
                type="ticket"
                banner={state.image}
                setBanner={(value) => setState({ ...state, banner: value })}
              />
            </Container>
          </Transition>
          <div style={{ textAlign: "right" }}>
            {state.error !== "" && (
              <div
                style={{ color: "red", textAlign: "center", padding: "10px" }}
              >
                {error}
              </div>
            )}

            {tabs === "tab2" && (
              <>
                <Button onClick={() => handleOnClick("back")}>Back</Button>
                <Button onClick={() => handleOnClick("finish")}>Finish!</Button>
              </>
            )}
            {tabs === "tab1" && (
              <Button onClick={() => handleOnClick("next")}>Next</Button>
            )}
          </div>
        </Form>
      </div>
    </MainContent>
  );
};

export default EditTicket;
