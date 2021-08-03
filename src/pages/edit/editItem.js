import React, { useState } from "react";
import { Button, Form, Grid } from "semantic-ui-react";
import MainContent from "../../shared/mainContent";
import EditorShared from "../../shared/editorShared";
import {
  _getItemData,
  _editItem,
  _getTickets,
} from "../../controllers/AxiosRequests";
import { useContext } from "react";
import StateContext from "../../context/stateContext";
import { useEffect } from "react";
import LoadingScreen from "../../shared/loadingScreen";
import UploadShared from "../../shared/uploadShared";
import { _isSelectedProject } from "../../controllers/functions";
import { useHistory } from "react-router-dom";
import { keys } from "../../config/keys";

const options = [
  { key: "0", text: "Euro", value: "euro" },
  { key: "1", text: "Beverage Ticket", value: "beverage" },
  { key: "2", text: "Food Ticket", value: "food" },
  { key: "3", text: "Service Ticket", value: "service" },
  { key: "4", text: "Good Ticket", value: "good" },
];

const EditItem = ({ match }) => {
  const {
    isLogged,
    setLoading,
    loading,
    setShowModal,
    setToastAlert,
    selectedProject,
  } = useContext(StateContext);
  const [show, setShow] = useState({ id: "", show: false });
  const [projectTickets, setProjectTickets] = useState([]);
  const history = useHistory()

  const [state, setState] = useState({
    id: "",
    name: "",
    quantity: "",
    price: 0,
    exchangeMoney: "euro",
    desc: "",
    banner: "",
    image: "",
    vat_rate: 0,
    exchange: "euro"
  });

  useEffect(() => {
    let isMounted = true;
    if (!isMounted || match.params.id === "") return;

    setLoading(true);
    _getItemData(match.params.id).then((res) => {
      console.log(res.data);
      _isSelectedProject(res.data.project_id).then((sel) => {
        if(!sel) history.push("/");
      });
      setState({
        id: res.data.id,
        name: res.data.name,
        price: res.data.price,
        exchangeMoney: res.data.ticket_id ? res.data.ticket_id : "euro",
        quantity: res.data.quantity != 100000 ? res.data.quantity : "",
        desc: res.data.description,
        banner: res.data.image ? res.data.image.id : "",
        image: res.data.image
          ? `${keys.SERVER_IP}/images/${res.data.image.for}/${res.data.image.name}`
          : "",
        vat_rate: res.data.vat_rate,
        exchange: res.data.exchange
      });
      setLoading(false);
    });

    _getTickets(selectedProject[0].id).then((res) => {
      let options = [{ key: 0, text: "Euro", value: "euro" }];
      res.data.map(({ id, name }) => {
        options.push({ key: id, text: name, value: id });
        return false;
      });
      setProjectTickets(options);
    });
    return () => {
      isMounted = false;
    };
  }, [setLoading, match.params.id, selectedProject]);

  const handleOnSubmit = () => {
    let formData = {
      name: state.name,
      price: parseFloat(state.price),
      description: state.desc,
      quantity: state.quantity === "" || state.quantity === null ? 100000 : state.quantity,
      exchange: state.exchange,
      ticket_id: state.exchangeMoney !== "euro" ? state.exchangeMoney : null,
      vat_rate: state.vat_rate
    };
    if(state.banner != ""){
      formData.image_id = state.banner;
    }
    _editItem(formData, isLogged, state.id).then((res) => {
      if (res.status === "error") {
        setToastAlert({
          show: true,
          title: "Fill form",
          message: res.message,
        });
        return;
      }
      setShowModal("updateItemSuccess");
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <MainContent id="editItem" subClass="small-sub-content">
      <Form>
        <Grid>
          <Grid.Row>
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
                    width: "100%",
                    backgroundColor: "#292b48",
                    padding: "20px",
                  }}
                >
                  <h3 style={{ color: "#5abdbf", marginBottom: "30px" }}>
                    Edit Item
                  </h3>
                  <p style={{ color: "#5abdbf" }}>Item Details</p>
                  <Form.Group widths="equal">
                    <Form.Field width="8">
                      <Form.Input
                        label="Item Name"
                        placeholder="Ex: Beer"
                        value={state.name}
                        onChange={(e, { value }) =>
                          setState({ ...state, name: value })
                        }
                        required
                      />
                    </Form.Field>
                    <Form.Field width="8">
                      <Form.Input
                        label="Supply Quantity"
                        type="number"
                        min={1}
                        placeholder="Item Quantity"
                        value={state.quantity}
                        onChange={(e, { value }) =>
                          setState({ ...state, quantity: value })
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
                        value={state.exchangeMoney}
                        required
                        options={projectTickets}
                      />
                    </Form.Field>
                    <Form.Field width="8">
                      <Form.Input
                        label="Price (Tax and Fee inc)"
                        type="number"
                        min={1}
                        placeholder="Price (In Exchange Money)"
                        value={state.price}
                        onChange={(e, { value }) =>
                          setState({ ...state, price: value })
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
                    <EditorShared
                      title="Description"
                      data={state.desc}
                      setData={(value) => setState({ ...state, desc: value })}
                    />
                  </Form.Field>
                  <br />

                  <div>
                    <p
                      style={{
                        color: "#5abdbf",
                        marginBottom: "15px",
                        fontWeight: "bold",
                      }}
                    ></p>
                    {/* <input type="file" id="file-upload" accept="image/*" />
                                        <label id="labelForUpload" htmlFor="file-upload">
                                            Browse
                                        </label> */}
                    <UploadShared
                      title="Add Item Image (square dimension)"
                      type="item"
                      id="itemImg"
                      setBanner={(value) =>
                        setState({ ...state, banner: value })
                      }
                      banner={state.image}
                    />
                  </div>
                  <Form.Field>
                    <Button
                      id="submit"
                      labelPosition="right"
                      icon="edit"
                      content="Edit Item"
                      onClick={handleOnSubmit}
                    />
                  </Form.Field>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </MainContent>
  );
};

export default EditItem;
