import React, { useContext, useState, useEffect } from "react";
import { Button, Form, Grid, Icon, Image } from "semantic-ui-react";
import StateContext from "../../context/stateContext";
import MainContent from "../../shared/mainContent";
import LoadingScreen from "../../shared/loadingScreen";
import { _getTickets, _getItems } from "../../controllers/AxiosRequests";
import TicketItems from "../../components/itemsComponents/ticketItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { _validateForm } from "../../controllers/functions";
import { _createPOS } from "../../controllers/AxiosRequests";
import CreateNewProject from "../../shared/createNewProject";
import { keys } from "../../config/keys";

const options = [
  { key: "0", text: "Euro (default)", value: "euro" },
  { key: "1", text: "DemoDay Pass", value: "DemoDay pass" },
  { key: "2", text: "Euro", value: "euro" },
];
const CreatePOS = () => {
  const {
    setShowModal,
    selectedProject,
    loading,
    setLoading,
    isLogged,
    setToastAlert,
  } = useContext(StateContext);
  const [state, setState] = useState({ name: "", exchange: "", pin_code: "" });
  const [show, setShow] = useState({ id: "", show: false });
  const [tabs, setTabs] = useState("items");
  const [tickets, setTickets] = useState([]);
  const [filterdItems, setFilterdItems] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [items, setItems] = useState([]);
  const [addToPOSItem, setAddToPOSItem] = useState([]);
  const [addToPOSTicket, setAddToPOSTicket] = useState([]);
  const [projectTickets, setProjectTickets] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setAddToPOSItem([]);
    setAddToPOSTicket([]);
    if (!isMounted || selectedProject.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    _getTickets(selectedProject[0].id).then((res) => {
      setTickets(res.data);
      let options = [{ key: 0, text: "Euro", value: "euro" }];
      res.data.map(({ id, name }) => {
        options.push({ key: id, text: name, value: id });
        return false;
      });
      setProjectTickets(options);
    });
    _getItems(selectedProject[0].id).then((res) => {
      // setItems(res.data);
      setFilterdItems(res.data);
      setLoading(false);
      setState({ ...state, exchange: "euro" });
      const arr = res.data;
      const filtered = arr.filter((obj) => {
        return obj.exchange.toLowerCase() === "euro";
      });
      setItems(filtered);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedProject, setLoading]);

  const handleOnClickTabs = (type) => {
    setTabs(type);
  };

  const handleOnClickModal = () => {
    setShowModal("previewPOS");
  };

  const handleDeleteView = (id) => {
    const itemArr = [...addToPOSItem];
    const ticketArr = [...addToPOSTicket];

    const indexItem = itemArr.findIndex((obj) => obj.id === id);
    const indexTicket = ticketArr.findIndex((obj) => obj.id === id);

    if (indexItem !== -1) {
      setItems((prev) => [...prev, addToPOSItem[indexItem]]);
      itemArr.splice(indexItem, 1);
      setAddToPOSItem(itemArr);
      return;
    }
    if (indexTicket !== -1) {
      setTickets((prev) => [...prev, addToPOSTicket[indexTicket]]);
      ticketArr.splice(indexTicket, 1);
      setAddToPOSTicket(ticketArr);
      return;
    }
  };

  const handleAddToPOS = (value) => {
    setAddToPOSItem((prev) => [...prev, value]);
    const arr = [...items];
    const index = arr.findIndex((obj) => obj.id === value.id);
    arr.splice(index, 1);
    setItems(arr);
  };

  const handleTicketAddToPOS = (value) => {
    setAddToPOSTicket((prev) => [...prev, value]);
    const arr = [...tickets];
    const index = arr.findIndex((obj) => obj.id === value.id);
    arr.splice(index, 1);
    setTickets(arr);
  };
  const handleOnChange = (value) => {
    setState({ ...state, exchange: value });
    const arr = [...filterdItems];
    const filtered = arr.filter((obj) => {
      if (value === "euro") {
        return obj.exchange.toLowerCase() === value;
      } else {
        return obj.ticket_id === value;
      }
    });
    if(addToPOSItem.length > 0){
      const arrOfItems = [...addToPOSItem];
      const filteredarrOfItems = arrOfItems.filter((obj) => {
        if (value === "euro") {
          return obj.exchange.toLowerCase() === value;
        } else {
          return obj.ticket_id === value;
        }
      });
      setAddToPOSItem(filteredarrOfItems);
    }
    setItems(filtered);
    if(value != "euro"){
      setAddToPOSTicket([]);
    }
  };
  const handleOnDelete = (id) => {
    switch (id.type) {
      case "item":
        const arr = [...items];
        const index = arr.findIndex((obj) => obj.id === id.data);
        arr.splice(index, 1);

        setItems(arr);
        return;
      case "ticket":
        const ticketArr = [...tickets];
        const ticketInd = ticketArr.findIndex((obj) => obj.id === id.data);
        ticketArr.splice(ticketInd, 1);
        setTickets(ticketArr);
        return;
      default:
        break;
    }
  };

  const handleConfirm = () => {
    setDisabled(true);
    const formData = {
      name: state.name,
      items: addToPOSItem.map((a) => {
        return { id: a.id };
      }),
      tickets: addToPOSTicket.map((a) => {
        return { id: a.id };
      }),
      exchange: state.exchange,
      pin_code: state.pin_code
    };

    const validate = _validateForm(formData, "pos");

    if (!validate) {
      setToastAlert({
        show: true,
        title: "Fill form",
        message: "Please fill the form correctly then try again!",
      });
      setDisabled(false);
      return;
    }
    console.log(formData, addToPOSItem, addToPOSTicket, isLogged);
    // USE _createPOS request function in AxiosRequests file for creating POS.
    _createPOS(formData, isLogged, selectedProject[0].id).then((res) => {
      console.log(res);
      if (res.status === "error") {
        setToastAlert({
          show: true,
          title: "Fill form",
          message: res.message,
        });
        return;
      }
      setAddToPOSItem([]);
      setAddToPOSTicket([]);
      setState({ name: "", exchange: "" });
      setDisabled(false);
      setShowModal("successPOS");
      setLoading(true);
      _getTickets(selectedProject[0].id).then((res) => {
        setTickets(res.data);
        setLoading(false);
      });
      _getItems(selectedProject[0].id).then((res) => {
        setItems(res.data);
        setLoading(false);
      });
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }
  if (selectedProject.length === 0) {
    return <CreateNewProject />
  }
  return (
    <MainContent id="createPOS" >
      <Form>
        <Grid>
          <Grid.Row>
            <Grid.Column width="16">
              <div className="pos-container-form">
                <div className="pos-subContent-form" style={{width: "45%"}}>
                  <div className="pos-tab1">
                    <h3 style={{ color: "#5abdbf", marginBottom: "30px" }}>
                      Create Point of Sale
                    </h3>
                    {/* <div className="pos-preview" onClick={handleOnClickModal}>
                      <Icon name="tv" size="small" />
                      <p>Preview POS</p>
                    </div> */}
                  </div>

                  <p style={{ color: "#5abdbf" }}>POS Details</p>
                  <Form.Group widths="equal">
                    <Form.Field width="8">
                      <Form.Input
                        label="POS Name"
                        placeholder="name..."
                        onChange={(e, { value }) =>
                          setState({ ...state, name: value })
                        }
                        value={state.name}
                        required
                      />
                    </Form.Field>
                    {/* <Form.Field width="8">
                      <label>POS link</label>
                      <div className="pos-link-field">
                        <p>
                          https://d-event.be/proName/projectName/POSName/ID039566
                        </p>
                        <Icon name="copy" />
                      </div>
                    </Form.Field> */}
                  </Form.Group>
                  <Form.Group>
                    <Form.Field width="8">
                      <Form.Select
                        fluid
                        id="ticketType"
                        label="Exchange Money"
                        onClick={() => setShow({ id: "1", show: !show.show })}
                        className={`ticketType ${
                          show.show && show.id === "1" ? "active" : ""
                        }`}
                        required
                        options={projectTickets}
                        onChange={(e, { value }) => handleOnChange(value)}
                        defaultValue="euro"
                        placeholder="Select..."
                      />
                    </Form.Field>
                    <Form.Field width="8">
                      <Form.Input
                        label="POS PIN code"
                        placeholder="pin code..."
                        onChange={(e, { value }) =>
                          setState({ ...state, pin_code: value })
                        }
                        value={state.pin_code}
                        required
                      />
                    </Form.Field>
                  </Form.Group>
                  <p style={{ color: "#5abdbf", fontWeight: "bold" }}>
                    Items / Ticket added:{" "}
                  </p>
                  <div
                    className="item-lists-container-view"
                    style={{
                      height: "200px",
                      minHeight: "100px",
                      width: "50%",
                    }}
                  >
                    <ul>
                      {addToPOSItem.length > 0 &&
                        addToPOSItem.map((add, i) => (
                          <li key={i}>
                            <Grid className="w-100">
                              <Grid.Row>
                                <Grid.Column width="5" textAlign="center">
                                  <Image
                                    src={
                                      add.image && add.image !== null
                                        ? `${keys.SERVER_IP}/images/${add.image.for}/${add.image.name}`
                                        : "/images/favicon.png"
                                    }
                                  />
                                </Grid.Column>
                                <Grid.Column width="8" verticalAlign="middle">
                                  <h5
                                    style={{
                                      marginBottom: 0,
                                      color: "#3d4465",
                                    }}
                                  >
                                    {add.name}
                                  </h5>
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      color: "#3d4465",
                                      margin: "3px 0 0 0",
                                    }}
                                  >
                                    {add.price} ({add.exchange})
                                  </p>
                                </Grid.Column>
                                <Grid.Column width="3" verticalAlign="middle">
                                  <div
                                    id="actionBtns"
                                    style={{
                                      display: "flex",
                                      width: "100%",
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    onClick={() => handleDeleteView(add.id)}
                                  >
                                    <FontAwesomeIcon
                                      id="deleteItemIcon"
                                      icon={faTimesCircle}
                                      size="1x"
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </li>
                        ))}
                      {addToPOSTicket.length > 0 &&
                        addToPOSTicket.map((add, i) => (
                          <li key={i}>
                            <Grid className="w-100">
                              <Grid.Row>
                                <Grid.Column width="5" textAlign="center">
                                  <Image
                                    src={
                                      add.image && add.image !== null
                                        ? `${keys.SERVER_IP}/images/${add.image.for}/${add.image.name}`
                                        : "/images/favicon.png"
                                    }
                                  />
                                </Grid.Column>
                                <Grid.Column width="8" verticalAlign="middle">
                                  <h5
                                    style={{
                                      marginBottom: 0,
                                      color: "#3d4465",
                                    }}
                                  >
                                    {add.name}
                                  </h5>
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      color: "#3d4465",
                                      margin: "3px 0 0 0",
                                    }}
                                  >
                                    {add.price} ({add.type})
                                  </p>
                                </Grid.Column>
                                <Grid.Column width="3" verticalAlign="middle">
                                  <div
                                    id="actionBtns"
                                    style={{
                                      display: "flex",
                                      width: "100%",
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    onClick={() => handleDeleteView(add.id)}
                                  >
                                    <FontAwesomeIcon
                                      id="deleteItemIcon"
                                      icon={faTimesCircle}
                                      size="1x"
                                    />
                                  </div>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "absolute",
                      bottom: "4%",
                      left: "5%",
                      width: "90%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Button primary>Cancel</Button>
                      <Button
                        primary
                        disabled={disabled}
                        loading={disabled}
                        onClick={handleConfirm}
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "25%",
                    backgroundColor: "#eee",
                  }}
                >
                  <div className="POS-tabs">
                    <ul>
                      <li
                        className={tabs === "items" ? "active" : ""}
                        onClick={() => handleOnClickTabs("items")}
                      >
                        Items List
                      </li>
                      <li
                        className={tabs === "tickets" ? "active" : ""}
                        onClick={() => handleOnClickTabs("tickets")}
                      >
                        Tickets List
                      </li>
                    </ul>
                  </div>
                  <div className="item-lists-container">
                    {tabs === "items" && (
                      <ul style={{ position: "relative" }}>
                        {items.length === 0 && (
                          <li
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "absolute",
                              top: "288px",
                              left: "0",
                              width: "100%",
                            }}
                          >
                            <p>No item founds </p>
                          </li>
                        )}

                        {items.length > 0 &&
                          items.map((item, i) => (
                            <TicketItems
                              key={i}
                              type="pos"
                              addToPOS={(value) => handleAddToPOS(value)}
                              deleteItem={(value) => handleOnDelete(value)}
                              item={item}
                              typeData="item"
                            />
                          ))}
                      </ul>
                    )}
                    {tabs === "tickets" && (
                      <ul style={{ position: "relative" }}>
                        {tickets.length === 0 && (
                          <li
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "absolute",
                              top: "288px",
                              left: "0",
                              width: "100%",
                            }}
                          >
                            <p>No ticket founds </p>
                          </li>
                        )}

                        {tickets.length > 0 && state.exchange == "euro" ?
                          tickets.map((ticket, i) => (
                            <TicketItems
                              key={i}
                              type="pos"
                              typeData="ticket"
                              deleteItem={(value) => handleOnDelete(value)}
                              addToPOS={(value) => handleTicketAddToPOS(value)}
                              item={ticket}
                            />
                          )): ""}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </MainContent>
  );
};

export default CreatePOS;
