import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Grid, Image } from "semantic-ui-react";
import { useState } from "react";
import { useEffect } from "react";
import { _deleteItem, _deleteTicket } from "../../controllers/AxiosRequests";
import { useHistory } from "react-router-dom";
import { keys } from "../../config/keys";

const TicketItems = ({ item, type, typeData, addToPOS, deleteItem }) => {
  const [items, setItems] = useState([]);
  const [layoutType, setLayoutType] = useState("");
  const [typeTicket, setTypeTicket] = useState("");
  const history = useHistory()

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    console.log(item);

    setItems([item]);
    return () => {
      isMounted = false;
    };
  }, [item]);

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;

    setTypeTicket(typeData);
    return () => {
      isMounted = false;
    };
  }, [typeData]);

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    setLayoutType(type);
    return () => {
      isMounted = false;
    };
  }, [type]);

  const handleOnCLick = (itemData) => {
    addToPOS(itemData);
  };

  const handleDelete = (id) => {
    switch (typeTicket) {
      case "item":
        _deleteItem(id).then((res) => {
          deleteItem({ data: res.id, type: "item" });
        });
        return;
      case "ticket":
        _deleteTicket(id).then((res) => {
          deleteItem({ data: res.id, type: "ticket" });
        });
        return;
      default:
        break;
    }
  };

  const handleOnDeleteItem = (id) => {
    console.log(id);

    _deleteItem(id).then((res) => {
      deleteItem(res.id);
    });
  };

  const handleOnClickEdit = (id) => {
    if (typeTicket === '' || typeTicket === 'item') {
      history.push('/manageProject/editItem/' + id);
    } else {
      history.push('/manageProject/editTicket/' + id);
    }
  }

  if (layoutType === "pos") {
    return (
      <li>
        <Grid className="w-100">
          <Grid.Row>
            <Grid.Column width="5" textAlign="center">
              <Image src={!item.image || item.image === null ? '/images/favicon.png' : `${keys.SERVER_IP}/images/${item.image.for}/${item.image.name}`} />
            </Grid.Column>
            <Grid.Column
              width="8"
              verticalAlign="middle"
              style={{ cursor: "pointer" }}
              onClick={() => handleOnCLick(items[0])}
            >
              <h5 style={{ marginBottom: 0, color: "#3d4465" }}>{item.name}</h5>
              <p
                style={{
                  fontSize: "12px",
                  color: "#3d4465",
                  margin: "3px 0 0 0",
                }}
              >
                {item.price} {typeTicket=='ticket' && "€"}  ({item.type || item.exchange})
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
                  paddingRight: "0px"
                }}
              >
                {type !== "pos" ?
                <>
                <FontAwesomeIcon id="editItemIcon" onClick={() => handleOnClickEdit(item.id)} icon={faPen} size="1x" />
                <FontAwesomeIcon
                  id="deleteItemIcon"
                  icon={faTrash}
                  size="1x"
                  style={{color:"red"}}
                  onClick={() => handleDelete(items[0].id)}
                />
                </>: 
                <FontAwesomeIcon id="editItemIcon" onClick={() => handleOnCLick(items[0])} icon={"plus-circle"} size="1x" />}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </li>
    );
  }

  return (
    <li>
      <Grid className="w-100">
        <Grid.Row>
          <Grid.Column width="5" textAlign="center">
            <Image src={!item.image ? '/images/favicon.png' : `${keys.SERVER_IP}/images/${item.image.for}/${item.image.name}`} />
          </Grid.Column>
          <Grid.Column width="8" verticalAlign="middle">
            <h5 style={{ marginBottom: 0, color: "#3d4465" }}>{item.name}</h5>
            <p
              style={{
                fontSize: "12px",
                color: "#3d4465",
                margin: "3px 0 0 0",
              }}
            >
              {item.price} {typeTicket=='ticket' && "€"} ({item.exchange})
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
            >
              <FontAwesomeIcon id="editItemIcon" onClick={() => handleOnClickEdit(item.id)} icon={faPen} size="1x" />
              <FontAwesomeIcon
                id="deleteItemIcon"
                icon={faTrash}
                size="1x"
                onClick={() => handleOnDeleteItem(items[0].id)}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </li>
  );
};

export default TicketItems;
