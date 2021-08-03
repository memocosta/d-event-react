import React, { useContext, useEffect, useState } from "react";
import { Button, Transition } from "semantic-ui-react";
import StateContext from "../context/stateContext";
import { _refundTicket } from "../controllers/AxiosRequests";

const RefundModal = () => {
    const { isLogged, showModal, setShowModal, refundMsg, setRefundMsg, refundActionID, setRefundActionID, setIsRefundConfirmed } = useContext(StateContext);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        if (showModal === "refundModal") {
            console.log("here");
            setVisible(true);
        } else {
            setVisible(false);
        }
        return () => {
            isMounted = false;
        };
    }, [showModal]);

    const handleOnClick = (action) => {
        
        if (action == "confirm") {
            _refundTicket(isLogged, refundActionID).then((res) => {
                if (res.status === "success") {
                    setRefundActionID(0);
                    setRefundMsg("")
                    setShowModal("");
                    setVisible(false);
                    setIsRefundConfirmed(true);
                } else {
                  console.log(res.message);
                }
              });
        } else {
            setRefundActionID(0);
            setRefundMsg("")
            setShowModal("");
            setVisible(false);
        }
    };
    return (
        <Transition visible={visible} duration={300} animation="scale">
            <div
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "37%",
                    background: "#eee",
                    zIndex: "999999",
                    padding: "40px",
                    borderRadius: "10px",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        color: "#5abdbf",
                        fontSize: "25px",
                        fontWeight: "bold",
                        marginBottom: 0,
                    }}
                >
                    {refundMsg}
                </p>
                <div
                    id="refundActionBtn"
                    style={{
                        display: "flex",
                        marginTop: "20px",
                        width: "100%",
                        justifyContent: "space-between",
                    }}
                >
                    <Button onClick={() => handleOnClick("cancel")}>Cancel</Button>
                    <Button onClick={() => handleOnClick("confirm")}>Confirm</Button>
                </div>
            </div>
        </Transition>
    );
};

export default RefundModal;
