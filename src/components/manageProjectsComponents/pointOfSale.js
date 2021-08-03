import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Dropdown, Table } from "semantic-ui-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import StateContext from "../../context/stateContext";
import { _deletePos } from "../../controllers/AxiosRequests";

const PointOfSale = ({ items }) => {
  const [copied, setCopied] = useState(false);
  // const [itemOptions, setItemOptions] = useState([])
  const [posData, setPosData] = useState([]);
  const {
    selectedProject,
    setSelectedProject,
    setLoading,
    isLogged,
    setToastAlert,
  } = useContext(StateContext);
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    if (items && items.length === 0) {
      setPosData([]);
      return;
    }
    console.log(items);

    let itemData = [];
    items.map((item, i) => {
      return itemData.push({
        id: item.id,
        name: item.name,
        itemsName: item.items.map((item, i) => {
          return { key: i, text: item.name, value: item.name };
        }),
        tiketsName: item.tickets.map((ticket, i) => {
          return { key: i, text: ticket.name, value: ticket.name };
        }),
      });
    });
    console.log(itemData);

    setPosData(itemData);
    return () => {
      isMounted = false;
    };
  }, [items]);

  const handleCopy = () => {
    setCopied(true);
  };

  if (posData.length === 0) {
    return (
      <div>
        <p>There is no POS for this project</p>
      </div>
    );
  }

  const handleDeleteView = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete this POS?</p>
            <div className="buttons">
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  setLoading(true);
                  _deletePos(id, isLogged).then((res) => {
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
  };
  return (
    <Table collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width="3">POS Name</Table.HeaderCell>
          <Table.HeaderCell width="3">Tickets List</Table.HeaderCell>
          <Table.HeaderCell width="3">Items list</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {posData.length > 0 &&
          posData.map((pos, i) => (
            <Table.Row key={i}>
              <Table.Cell>{pos.name}</Table.Cell>
              {pos.tiketsName.length > 0 ? (
                <Table.Cell>
                  <Dropdown
                    key={i}
                    id="ticketsSelect"
                    placeholder={pos.tiketsName[0].value}
                    scrolling
                    options={pos.tiketsName}
                    className="elsText"
                  />
                </Table.Cell>
              ) : (
                <Table.Cell>{"NO Tickets"}</Table.Cell>
              )}
              {pos.itemsName.length > 0 ? (
                <Table.Cell>
                  <Dropdown
                    key={i}
                    id="itemsSelect"
                    placeholder={pos.itemsName[0].value}
                    scrolling
                    options={pos.itemsName}
                    className="elsText"
                  />
                </Table.Cell>
              ) : (
                <Table.Cell>{"NO Items"}</Table.Cell>
              )}
              {/* <Table.Cell>{pos.exchange}</Table.Cell> */}
              <Table.Cell>
                <CopyToClipboard
                  text={`http://bydotpy.com/d-event/POS/pos-preview/${pos.id}`}
                  onCopy={handleCopy}
                >
                  <div className="copy-url">
                    <p>
                      {`http://bydotpy.com/d-event/POS/pos-preview/${pos.id}`}
                    </p>
                    <FontAwesomeIcon icon={copied ? "clipboard" : "copy"} />
                  </div>
                </CopyToClipboard>
              </Table.Cell>
              <Table.Cell className="edit" style={{ width: "4.25%" }}>
                <Link to={`/POS/editPOS/${pos.id}`}>
                  <FontAwesomeIcon icon={faPen} />
                </Link>
              </Table.Cell>
              <Table.Cell className="edit" style={{ width: "4.25%" }}>
                <FontAwesomeIcon
                  id="deleteItemIcon"
                  icon={faTrash}
                  size="1x"
                  color="red"
                  style={{ color: "red" }}
                  onClick={() => handleDeleteView(pos.id)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default PointOfSale;
