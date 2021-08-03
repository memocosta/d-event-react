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
import moment from "moment";
import { _createTicket } from "../../controllers/AxiosRequests";
import { _validateForm } from "../../controllers/functions";
import UploadShared from "../../shared/uploadShared";
import CreateNewProject from "../../shared/createNewProject";
import LoadingScreen from "../../shared/loadingScreen";

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

const CreateTicket = () => {
  const [show, setShow] = useState({ id: "", show: false });
  const [state, setState] = useState({
    kind: "paid",
    name: "",
    quantity: "",
    price: 0,
    ticketType: "",
    refundable: false,
    exchangeable: false,
    validity: false,
    startDate: moment().format(),
    endDate: moment().format(),
    channel: "everywhere",
    desc: "",
    terms: "",
    image: "",
    vat_rate: 0,
    banner: ""
  });
  const [tabs, setTabs] = useState("tab1");
  const [disabled, setDisabled] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);

  const { setShowModal, isLogged, selectedProject, setToastAlert, loading , setLoading } = useContext(
    StateContext
  );
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    setLoading(false);

    setShowModal("");
    return () => {
      isMounted = false;
    };
  }, [setShowModal]);

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

  const handleToggle = (e, { value, checked }) => {
    setState({ ...state, channel: value });
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
        console.log('fffffffffffffffffffff', state.quantity)
        setDisabledBtn(true);
        if(!state.validity && state.endDate <= state.startDate){
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "The End date must be after the start date.",
          });
          setDisabledBtn(false);
          return;
        }
        if(state.quantity && state.quantity === 0){
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "Ticket quantity should be more than 0",
          });
          setDisabledBtn(false);
          return;
        }
        if(!state.ticketType || state.ticketType === ""){
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "Please Select The Ticket Type",
          });
          setDisabledBtn(false);
          return;
        }
        if(!state.banner){
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "Please Add an Image to the ticket!",
          });
          setDisabledBtn(false);
          return;
        }
        let formData = {
          name: state.name,
          price: state.price ? parseFloat(state.price) : state.price,
          quantity: state.quantity === "" || state.quantity === null ? 100000 : parseFloat(state.quantity),
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
          vat_rate: state.vat_rate
        };
        if(state.banner !== ""){
          formData.image_id = state.banner;
        }
        const validate = _validateForm(formData, "ticket");

        if (!validate) {
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "Please fill the form correctly then try again!",
          });
          setDisabledBtn(false);
          return;
        }

        _createTicket(formData, isLogged, selectedProject[0].id).then((res) => {
          console.log(res);
          if (res.status === "error") {
            setToastAlert({
              show: true,
              message: res.message
            });
            setDisabledBtn(false);
            return;
          }
          setDisabledBtn(false);
          setShowModal("successTicket");
          setState({
            kind: "paid",
            name: "",
            quantity: "",
            price: 0,
            ticketType: "",
            refundable: false,
            exchangeable: false,
            validity: false,
            startDate: moment().format(),
            endDate: moment().format(),
            channel: "everywhere",
            desc: "",
            terms: "",
            image: "",
            vat_rate: 0,
            image_id: ""
          });
          handleOnClick("back");
        });
        return;
      default:
        break;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }
  if (selectedProject.length === 0) {
    return <CreateNewProject />
  }
  return (
    <MainContent id="createTicket" subClass="small-sub-content">
      <div className="dashboard-header mb-2">
        <h3 style={{ color: "#5abdbf" }}>
          Create New Ticket ({tabs === "tab1" ? "1" : "2"} / 2)
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
                    name="ticketKind"
                    value="free"
                    checked={state.kind === "free"}
                    onChange={handleRadioChange}
                  />
                </Form.Field>
                <Form.Field width="3">
                  <Radio
                    label="Paid"
                    name="ticketKind"
                    value="paid"
                    checked={state.kind === "paid"}
                    onChange={handleRadioChange}
                  />
                </Form.Field>
                <Form.Field width="3">
                  <Radio
                    label="Donation"
                    name="ticketKind"
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
                    placeholder="Drink Token"
                    onChange={(e, { value }) =>
                      setState({ ...state, name: value })
                    }
                    required
                    value={state.name}
                  />
                </Form.Field>
                <Form.Field width="8">
                  <Form.Input
                    label="Quantity"
                    type="number"
                    onChange={(e, { value }) =>
                      setState({ ...state, quantity: value })
                    }
                    placeholder="Not specified"
                    min={1}
                    value={state.quantity}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field width="8">
                  <Form.Input
                    label="Price (Tax and Fee inc)"
                    type="number"
                    min={1}
                    disabled={disabled}
                    onChange={(e, { value }) =>
                      setState({ ...state, price: value })
                    }
                    placeholder="1,2"
                    value={state.price}
                    required
                  />
                </Form.Field>
                <Form.Field width="8">
                  <Form.Select
                    fluid
                    id="ticketType"
                    label="Ticket Type"
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
                    value={state.ticketType}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field width="8">
                  <Form.Select
                    fluid
                    id="refundable"
                    disabled={disabled}
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
                  />
                </Form.Field>
                <Form.Field width="8">
                  <Form.Select
                    fluid
                    id="exchangeable"
                    label="Exchangeable"
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
                    value={state.exchangeable ? "yes" : "no"}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field width="8">
                  <Form.Input
                    label="VAT Rate (%)"
                    type="number"
                    min={1}
                    disabled={disabled}
                    onChange={(e, { value }) =>
                      setState({ ...state, vat_rate: value })
                    }
                    placeholder="1,2"
                    value={state.vat_rate}
                  />
                </Form.Field>
              <DateTimeShared
                title="Validity"
                subTitle="Validity stops after first scan"
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
                    <p style={{ color: "#c5c7de" }}>Sell online </p>
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
              <UploadShared title="Add Banner*" id="banner" setBanner={(value) => setState({ ...state, banner: value })} type="ticket"/>

            </Container>
          </Transition>

          <div style={{ textAlign: "right"}}>
            {tabs === "tab2" && (
              <>
                <Button onClick={() => handleOnClick("back")}>Back</Button>
                <Button
                  disabled={disabledBtn}
                  loading={disabledBtn}
                  onClick={() => handleOnClick("finish")}
                >
                  Finish!
                </Button>
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

export default CreateTicket;
