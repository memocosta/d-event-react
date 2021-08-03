import React, { useState } from "react";
import { Button, Form, Grid } from "semantic-ui-react";
import MainContent from "../../shared/mainContent";

import TicketItems from "../../components/itemsComponents/ticketItems";
import EditorShared from "../../shared/editorShared";
import { useHistory } from "react-router-dom";
import {
  _createItem,
  _getItems,
  _deleteItem,
  _getTickets,
} from "../../controllers/AxiosRequests";
import { useContext } from "react";
import StateContext from "../../context/stateContext";
import { useEffect } from "react";
import LoadingScreen from "../../shared/loadingScreen";
import UploadShared from "../../shared/uploadShared";
import { _validateForm } from "../../controllers/functions";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import CreateNewProject from "../../shared/createNewProject";

const AddItems = () => {
  const {
    selectedProject,
    setSelectedProject,
    isLogged,
    setLoading,
    loading,
    setToastAlert,
    setShowModal,
  } = useContext(StateContext);
  const [show, setShow] = useState({ id: "", show: false });
  const [state, setState] = useState({
    name: "",
    quantity: "",
    price: 0,
    exchangeMoney: "euro",
    desc: "",
    image: "",
    vat_rate: 0,
    exchange: "euro"
  });
  const [projectItems, setProjectItems] = useState([]);
  const [projectTickets, setProjectTickets] = useState([]);
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!isMounted || selectedProject.length === 0) {
    setLoading(false);
    return
    };
    setLoading(true);
    _getItems(selectedProject[0].id).then((res) => {
      setProjectItems(res.data);
      setLoading(false);
    });
    _getTickets(selectedProject[0].id).then((res) => {
      let options = [{ key: 0, text: "Euro", value: "euro" }];
      res.data.map(function ({ id, name }) {
        options.push({ key: id, text: name, value: id });
      });
      setProjectTickets(options);
    });
    return () => {
      isMounted = false;
    };
  }, [selectedProject, setLoading, setSelectedProject]);

  const handleOnSubmit = () => {
    setDisabled(true);
    let formData = {
      name: state.name,
      price: state.price,
      quantity: state.quantity === "" || state.quantity === null ? 100000 : state.quantity,
      ticket_id: state.exchangeMoney !== "euro" ? state.exchangeMoney : null,
      description: state.desc,
      exchange: state.exchange,
      vat_rate: state.vat_rate,
    };
    console.log(formData);
    if(state.image != ""){
      formData.image_id = state.image;
    }
    const validate = _validateForm(formData, "item");

    if (!validate) {
      setToastAlert({
        show: true,
        title: "Fill form",
        message: "Please fill the form correctly then try again!",
      });
      setDisabled(false);
      return;
    }
    _createItem(formData, isLogged, selectedProject[0].id).then((res) => {
      _getItems(selectedProject[0].id).then((res) => {
        setDisabled(false);
        if (res.status === "error") {
          setToastAlert({
            show: true,
            title: "Fill form",
            message: res.message,
          });
          return;
        }
        setShowModal("successItem");
        setProjectItems(res.data);
        setState({
          name: "",
          quantity: "",
          price: 0,
          exchangeMoney: "euro",
          desc: "",
          image: "",
          exchange: "euro",
          vat_rate: 0
        });
      });
    });
  };

  const handleOnDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete this Item?</p>
            <div className="buttons">
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  setLoading(true);
                  _deleteItem(id, isLogged).then((res) => {
                    setLoading(false);
                    if (res.status === "error") {
                      setToastAlert({
                        show: true,
                        message: "Something went wrong, please Try Again!",
                      });
                      return;
                    }
                    setSelectedProject([...selectedProject]);
                  });
                  onClose();
                }}
              >
                Yes, Delete it!
              </button>
            </div>
          </div>
        );
      },
    });
    // _deleteItem(id, isLogged).then((res) => {
    //   const arr = [...projectItems];
    //   const index = arr.findIndex((obj) => obj.id === id);
    //   arr.splice(index, 1);
    //   setProjectItems(arr);
    // });
  };

  if (loading) {
    return <LoadingScreen />;
  }
  if (selectedProject.length === 0) {
    return <CreateNewProject />
  }
  return (
    <MainContent id="addItems" subClass="item-sub-content">
      <Form>
        <Grid>
          <Grid.Row style={{paddingTop: "0"}}>
            <Grid.Column width="16">
              <div
                style={{
                  borderRadius: "10px",
                  display: "flex",
                  overflow: "hidden",
                  flexDirection: "row",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    backgroundColor: "#292b48",
                    padding: "20px",
                  }}
                >
                  <h3 style={{ color: "#5abdbf", marginBottom: "30px" }}>
                    Add Items
                  </h3>
                  <p style={{ color: "#5abdbf" }}>Item Details</p>
                  <Form.Group widths="equal">
                    <Form.Field width="8">
                      <Form.Input
                        label="Item Name"
                        placeholder="Ex: Beer"
                        onChange={(e, { value }) =>
                          setState({ ...state, name: value })
                        }
                        value={state.name}
                        required
                      />
                    </Form.Field>
                    <Form.Field width="8">
                      <Form.Input
                        label="Supply Quantity"
                        type="number"
                        min={1}
                        placeholder="Not specified"
                        value={state.quantity}
                        onChange={(e, { value }) =>
                          setState({ ...state, quantity: parseFloat(value) })
                        }
                      />
                    </Form.Field>
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field width="8">
                      <Form.Select
                        fluid
                        id="ticketType"
                        label="Money Exchange"
                        onClick={() => setShow({ id: "1", show: !show.show })}
                        className={`ticketType ${
                          show.show && show.id === "1" ? "active" : ""
                        }`}
                        onChange={(e, { value }) =>
                            {setState({ ...state, exchangeMoney: value, exchange: projectTickets.find(ticket => ticket.value === value).text })}
                        }
                        required
                        options={projectTickets}
                        placeholder="Select Ticket"
                      />
                    </Form.Field>
                    <Form.Field width="8">
                      <Form.Input
                        label="Price (Tax and Fee inc)"
                        type="number"
                        min={0}
                        value={state.price}
                        onChange={(e, { value }) =>
                          setState({ ...state, price: parseFloat(value) })
                        }
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
                  <br />
                  <Form.Field>
                    {/* <p style={{ color: "rgb(180 190 239)", marginTop: "20px" }}>
                      Description*
                    </p> */}
                    <EditorShared
                      title="Description"
                      data={state.desc}
                      setData={(value) => setState({ ...state, desc: value })}
                    />
                  </Form.Field>
                  <br />

                  <UploadShared
                    title="Add Item Image (square dimension)"
                    type="item"
                    id="itemImg"
                    setBanner={(value) => setState({ ...state, image: value })}
                    // banner={state.image}
                  />
                  <Form.Field>
                    <Button
                      id="submit"
                      labelPosition="right"
                      icon="plus"
                      content="Add Item"
                      disabled={disabled}
                      loading={disabled}
                      onClick={handleOnSubmit}
                    />
                  </Form.Field>
                </div>
                <div
                  style={{
                    width: "30%",
                    backgroundColor: "#eee",
                  }}
                >
                  <Form.Field width="16">
                    <Form.Input
                      id="searchItem"
                      placeholder="Item Lists"
                      icon="search"
                      type="search"
                    />
                  </Form.Field>
                  <div className="item-lists-container">
                    <ul style={{ position: "relative" }}>
                      {/* {items.length === 0 && (
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
                          <p>No items found for Euro </p>
                        </li>
                      )} */}
                      {projectItems.length > 0 &&
                        projectItems.map((item, i) => (
                          <TicketItems
                            key={i}
                            type=""
                            typeData="item"
                            item={item}
                            deleteItem={(value) => handleOnDelete(item.id)}
                          />
                        ))}
                    </ul>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "10px",
                      margin: "10px auto",
                      position: "absolute",
                      bottom: "10px",
                      right: "2%",
                    }}
                  >
                    <Button
                      primary
                      onClick={() => history.push("/POS/createPOS")}
                    >
                      Create Point Of Sale
                    </Button>
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

export default AddItems;
