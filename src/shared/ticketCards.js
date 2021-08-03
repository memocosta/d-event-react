import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import moment from "moment";
import { Grid, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { _deleteTicket } from "../controllers/AxiosRequests";
import StateContext from "../context/stateContext";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import { keys } from "../config/keys";

const TicketCards = (props) => {
  const {
    selectedProject,
    setSelectedProject,
    isLogged,
    setToastAlert,
    setLoading,
  } = useContext(StateContext);
  const handleDeleteView = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete this Ticket?</p>
            <div className="buttons">
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  setLoading(true);
                  _deleteTicket(id, isLogged).then((res) => {
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
    <Grid.Column className="mb-2" width="5">
      <div className="manage-card">
        <div className="manage-card-content">
          <Image
            src={
              props.image === "Test" || props.image === ""
                ? "/images/favicon.png"
                : `${keys.SERVER_IP}/images/${props.image.for}/${props.image.name}`
            }
          />
          <div className="card-info">
            <h5>{props.name}</h5>
            <p>
              {" "}
              {props.price} &euro; - Quantity: {props.quantity != 100000 ? props.current_quantity : "Unlimited"}
            </p>
            <p className="type-text mt-1">
              Refundable: {props.refundable ? "YES" : "NO"}
            </p>
            <p className="type-text">
              Exchangeable: {props.exchangeable ? "YES" : "NO"}
            </p>
          </div>
          <div className="card-actions" style={{ display: "flex" }}>
            <Link to={`/manageProject/editTicket/${props.ticketID}`}>
              <FontAwesomeIcon icon={faPen} />
            </Link>
            <FontAwesomeIcon
              id="deleteItemIcon"
              icon={faTrash}
              size="1x"
              color="red"
              onClick={() => handleDeleteView(props.ticketID)}
            />
          </div>
        </div>
        {/* <hr /> */}
        {!props.validity ? <div className="hero-card-footer">
          <div className="card-dates">
            <p>
              Start Date:{" "}
              <span>{moment(props.validStartDate).format("MM-DD-YYYY")}</span>{" "}
            </p>
            <p>
              End Date:{" "}
              <span>{moment(props.validEndDate).format("MM-DD-YYYY")}</span>{" "}
            </p>
          </div>
          <div className="card-times">
            <p>
              Start Time:{" "}
              <span>{moment(props.validStartDate).format("HH:mm A")}</span>
            </p>
            <p>
              End Time:{" "}
              <span>{moment(props.validEndDate).format("HH:mm A")}</span>
            </p>
          </div>
        </div> : <div className="hero-card-footer">
            <div className="card-dates">
              <p>
                Validity stops after first scan:{" "}
              </p>
              <p>
                
              </p>
            </div> 
          </div>}
      </div>
    </Grid.Column>
  );
};

export default TicketCards;
