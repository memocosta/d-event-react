import React, { useContext, useState, useEffect } from "react";
import { Button, Form, Grid, Icon, Image } from "semantic-ui-react";
import StateContext from "../../context/stateContext";
import MainContent from "../../shared/mainContent";
import { _getTickets, _getItems, _getPOS, _paymentResponse } from "../../controllers/AxiosRequests";
import LoadingScreen from "../../shared/loadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import TicketItems from "../../components/itemsComponents/ticketItems";
import { _isSelectedProject, _validateForm } from "../../controllers/functions";
import { useHistory } from "react-router-dom";
import { _editPOS } from "../../controllers/AxiosRequests";
import { keys } from "../../config/keys";
import { CopyToClipboard } from "react-copy-to-clipboard";

const options = [
  { key: "0", text: "Euro (default)", value: "euro" },
  { key: "1", text: "DemoDay Pass", value: "DemoDay pass" },
  { key: "2", text: "Drink Token", value: "Drink Token" },
];
const EditPOS = ({ match }) => {
  const history = useHistory();
  const {
    setShowModal,
    setLoading,
    loading,
    selectedProject,
    isLogged,
    setToastAlert,
    setSelectedPos
  } = useContext(StateContext);
  const [state, setState] = useState({ name: "", exchange: "", pin_code: "" });
  const [show, setShow] = useState({ id: "", show: false });
  const [tabs, setTabs] = useState("items");
  const [tickets, setTickets] = useState([]);
  const [items, setItems] = useState([]);
  const [addToPOS, setAddToPOS] = useState([]);
  const [addToPOSItem, setAddToPOSItem] = useState([]);
  const [addToPOSTicket, setAddToPOSTicket] = useState([]);
  const [disabled, setDisabled] = useState(false)
  const [projectTickets, setProjectTickets] = useState([]);
  const [filterdItems, setFilterdItems] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setAddToPOSItem([]);
    setAddToPOSTicket([]);
    if (!isMounted || selectedProject.length === 0) return;
    setLoading(true);
    console.log(match.params)
    if(match.params.response && match.params.response !== undefined && match.params.orderId !== undefined && (match.params.response === "failed" || match.params.response === "abort")){
      _paymentResponse(isLogged, match.params.orderId, "delete").then(response => {
        setLoading(false);
        setDisabled(false)
        if (response.status === "success") {
          setToastAlert({ show: true, title: 'Payment Failed', message: 'The payment process failed!' })
        }
      })
    }
    var resItems = [];
    var resTickets = [];
    _getTickets(selectedProject[0].id).then((res) => {
      resTickets = res.data;
      setTickets(res.data);
      let options = [
        { key: 0, text: "Euro", value: "euro" }
      ]; 
      res.data.map( ({ id, name }) =>{
        options.push({ key: id, text: name, value: id });
        return false;
      });
      setProjectTickets(options);
    });
    _getItems(selectedProject[0].id).then((res) => {
       resItems= res.data;
      setFilterdItems(res.data);
      setItems(res.data);
      setLoading(false);
    });
    _getPOS(match.params.id, isLogged).then(res => {
        if(res.status === "success"){
          _isSelectedProject(res.data.project_id).then((sel) => {
            if(!sel) history.push("/");
          });
          setSelectedPos(res.data);
          setState({name: res.data.name, exchange: res.data.exchange, pin_code: res.data.pin_code})
          if(res.data.items && res.data.items.length > 0){
            res.data.items.forEach(value => {
              setAddToPOSItem((prev) => [...prev, value])
  
              const index = resItems.findIndex(obj => obj.id === value.id)
              resItems.splice(index, 1)

              setItems(resItems)
            })
            // const arr = [...filterdItems];
            const filtered = resItems.filter((obj) => {
              if (res.data.exchange === "euro") {
                return obj.exchange.toLowerCase() === res.data.exchange;
              } else {
                return obj.ticket_id === res.data.exchange;
              }
            });
            setItems(filtered);
          }
          if(res.data.tickets && res.data.tickets.length > 0){
            res.data.tickets.forEach(value => {
              setAddToPOSTicket((prev) => [...prev, value])

              const ticketsIndex = resTickets.findIndex(obj => obj.id === value.id)
              resTickets.splice(ticketsIndex, 1)
              setTickets(resTickets)
            })
          }
        }else{
          if (res.status === "error") {
            setToastAlert({
              show: true,
              title: "Fill form",
              message: res.message,
            });
            return;
          }
        }
      })
 

    return () => {
      isMounted = false;
    };
  }, [selectedProject, setLoading]);

  const handleAddToPOS = (value) => {
    setAddToPOSItem((prev) => [...prev, value])
    const arr = [...items]
    const index = arr.findIndex(obj => obj.id === value.id)
    arr.splice(index, 1)
    setItems(arr)
  }

  const handleTicketAddToPOS = (value) => {
    setAddToPOSTicket((prev) => [...prev, value])
    const arr = [...tickets]
    const index = arr.findIndex(obj => obj.id === value.id)
    arr.splice(index, 1)
    setTickets(arr)
  }

  const handleOnClickTabs = (type) => {
    setTabs(type);
  };

  const handleOnClickModal = () => {
    setShowModal("previewPOS");
  };

  const handleCopy = () => {
    setCopied(true);
  };

  // const handleDeleteView = (id) => {
  //   const arr = [...addToPOS];
  //   const index = arr.findIndex((obj) => obj.id === id);
  //   arr.splice(index, 1);
  //   setAddToPOS(arr);
  // };

  const handleDeleteView = (id) => {
    const itemArr = [...addToPOSItem];
    const ticketArr = [...addToPOSTicket];

    const indexItem = itemArr.findIndex((obj) => obj.id === id);
    const indexTicket = ticketArr.findIndex((obj) => obj.id === id);

    if (indexItem !== -1) {
      setItems((prev) => [...prev, addToPOSItem[indexItem]])
      itemArr.splice(indexItem, 1);
      setAddToPOSItem(itemArr);
      return
    }
    if (indexTicket !== -1) {
      setTickets((prev) => [...prev, addToPOSTicket[indexTicket]])
      ticketArr.splice(indexTicket, 1);
      setAddToPOSTicket(ticketArr);
      return
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

    const handleOnChange = (value) => {
    setState({ ...state, exchange: value });
    const arr = [...filterdItems];
    console.log('filtered',filterdItems )
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

  const handleConfirm = () => {
    setDisabled(true)
    const formData = {
      name: state.name,
      items: addToPOSItem.map(a => {return {id: a.id}}),
      tickets: addToPOSTicket.map(a => {return {id: a.id}}),
      exchange: state.exchange,
      pin_code: state.pin_code
    };

    const validate = _validateForm(formData, 'pos')

    if (!validate) {
      setToastAlert({ show: true, title: 'Fill form', message: 'Please fill the form correctly then try again!' })
      setDisabled(false)
      return
    }
    
    _editPOS(formData, isLogged, match.params.id).then(res => {
      setDisabled(false)
      setShowModal("updatePosSuccess");
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <MainContent id="editPOS">
      <Form>
        <Grid>
          <Grid.Row>
            <Grid.Column width="20">
              <div className="pos-container-form">
                <div className="pos-subContent-form" style={{flex: "5"}}>
                  <div className="pos-tab1">
                    <h3 style={{ color: "#5abdbf", marginBottom: "30px" }}>
                      Edit Point of Sale
                    </h3>
                    <div className="pos-preview" onClick={handleOnClickModal}>
                      <Icon name="tv" size="small" />
                      <p>Preview POS</p>
                    </div>
                  </div>

                  <p style={{ color: "#5abdbf" }}>POS Details</p>
                  <Form.Group widths="equal">
                    <Form.Field width="8">
                      <Form.Input
                        label="POS Name"
                        placeholder="name..."
                        defaultValue={state.name}
                        onChange={(e, { value }) =>
                          setState({ ...state, name: value })
                        }
                        required
                      />
                    </Form.Field>
                    <Form.Field width="8">
                      <label>POS link</label>
                      <div className="pos-link-field">
                        <CopyToClipboard
                          text={`http://bydotpy.com/d-event/POS/pos-preview/${match.params.id}`}
                          onCopy={handleCopy}
                        >
                          <div className="copy-url">
                            <p>
                              {`http://bydotpy.com/d-event/POS/pos-preview/${match.params.id}`}
                            </p>
                            <FontAwesomeIcon icon={copied ? "clipboard" : "copy"} />
                          </div>
                        </CopyToClipboard>
                      </div>
                    </Form.Field>
                  </Form.Group>
                  <Form.Group>
                    <Form.Field width="8">
                      <Form.Select
                        fluid
                        id="ticketType"
                        label="Exchange Money"
                        value={state.exchange}
                        onClick={() => setShow({ id: "1", show: !show.show })}
                        className={`ticketType ${
                          show.show && show.id === "1" ? "active" : ""
                          }`}
                        required
                        options={projectTickets}
                        onChange={(e, { value }) => handleOnChange(value)}
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
                      height: '200px',
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
                                  <Image src={
                                      add.image && add.image !== null
                                        ? `${keys.SERVER_IP}/images/${add.image.for}/${add.image.name}`
                                        : "/images/favicon.png"
                                    } />
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
                                    {`${add.price} (${add.exchange})`}
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
                                      style={{color:"red"}}
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
                                  <Image src={
                                      add.image && add.image !== null
                                        ? `${keys.SERVER_IP}/images/${add.image.for}/${add.image.name}`
                                        : "/images/favicon.png"
                                    } />
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
                                    {`${add.price} (${add.type})`}
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
                  <div className="pos-btn-actions-container">
                    <div className="pos-btns">
                      <Button primary>Cancel</Button>
                      <Button primary disabled={disabled} loading={disabled} onClick={handleConfirm}>Confirm</Button>
                    </div>
                  </div>
                </div>
                <div className="lists-view" style={{flex: "2"}}>
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
                  <div
                    className="item-lists-container"
                    style={{
                      minHeight: "655px",
                      maxHeight: "655px",
                      overflowY: "auto",
                    }}
                  >
                    {tabs === "items" && (
                      <ul style={{ position: "relative" }}>
                        {items.length === 0 && (
                          <li className="noItems">
                            <p>No items found for Euro </p>
                          </li>
                        )}

                        {items.length > 0 &&
                          items.map((item, i) => (
                            <TicketItems key={i} typeData='item'
                              deleteItem={(value) => handleOnDelete(value)}
                              addToPOS={(value) =>
                                handleAddToPOS(value)
                              }
                              type="pos" item={item} />
                          ))}
                      </ul>
                    )}
                    {tabs === "tickets" && (
                      <ul style={{ position: "relative" }}>
                        {tickets.length === 0 &&<li className="noItems">
                          <p>No tickets found for Euro </p>
                        </li>}
                        {tickets.length > 0 && state.exchange == "euro" ?
                          tickets.map((item, i) => (
                            <TicketItems key={i} type='pos' typeData='ticket'
                              deleteItem={(value) => handleOnDelete(value)}
                              addToPOS={(value) =>
                                handleTicketAddToPOS(value)
                              }
                              item={item} />
                          )) : ""}
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

export default EditPOS;
