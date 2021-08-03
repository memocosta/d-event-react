import React, { useContext, useEffect, useState } from "react";
import { Grid, Modal } from "semantic-ui-react";
import StateContext from "../../context/stateContext";
import OrderedPOS from "./components/orderedPOS";
import POSitems from "./components/posItems";
import { _validateForm } from "../../controllers/functions";
import { _createOrder } from "../../controllers/AxiosRequests";
import { keys } from "../../config/keys";

const OperationModal = () => {
    const { showModal, setShowModal, selectedPos, setToastAlert, totalPrice, setTotalPrice } = useContext(StateContext);
    const [state, setState] = useState({
        dimmer: "blurring",
        selectedItem: "",
        quantity: 1,
        total: 0,
        orderedItems: [],
        orderedTickets: [],
    });
    const [posItems, setPosItems] = useState([]);
    const [posTickets, setPosTickets] = useState([]);
    const [posName, setPosname] = useState([]);
    const [submitted, setSubmitted] = useState(false)
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (!isMounted || showModal === "") return;
        if (showModal === "previewPOS") {
            setPosItems([...selectedPos.items])
            setPosTickets([...selectedPos.tickets])
            setPosname(selectedPos.name);
            setOpen(true);
        } else {
            setOpen(false);
        }
        return () => {
            isMounted = false;
        };
    }, [showModal]);

    const handleStopPreview = () => {
        setShowModal("");
        setOpen(false);
    };

    const handleQuantity = (quantity) => {
        setState({
            ...state,
            quantity: quantity,
        });
    };

    const handleDelete = (id, type) => {
        const arr = type === "item" ? [...state.orderedItems] : [...state.orderedTickets];
        console.log(arr);
        const index = arr.findIndex((obj) => obj.id === id);
        const item = arr.find((obj) => obj.id === id);
        console.log(`${state.total} - (${item.price} * ${item.quantity})`);
        arr.splice(index, 1);
        if (type === "item") {
            setState({ ...state, orderedItems: arr, total: (Number(state.total) - Number(item.quantity)) });
        } else {
            setState({ ...state, orderedTickets: arr, total: (Number(state.total) - Number(item.quantity)) });
        }
    };

    const handleAddItem = (value, type, item) => {
        let orderedItems = [...state.orderedItems];
        let orderedTickets = [...state.orderedTickets];
        let available_quantity;
        let new_quantity = state.quantity;
        if (type === "item") {
            const index = orderedItems.findIndex((obj) => obj.id === value);
            if (index >= 0) {
                const item = orderedItems.find((obj) => obj.id === value);
                available_quantity = Number(item.quantity) + Number(state.quantity);
                if (available_quantity > value.current_quantity) {
                    setToastAlert({ show: true, title: 'Sorry!', message: 'no more available quantity for this item ' });
                    new_quantity = 0;
                } else {
                    item.quantity = Number(item.quantity) + Number(state.quantity);
                }
            } else {
                available_quantity = Number(state.quantity) ? state.quantity : 1;
                if (available_quantity > value.current_quantity) {
                    setToastAlert({ show: true, title: 'Sorry!', message: 'no more available quantity for this item ' });
                    new_quantity = 0;
                } else {
                    orderedItems.push({
                        id: value,
                        quantity: Number(state.quantity) ? state.quantity : 1,
                        name: item.name,
                        exchange: item.exchange,
                        price: item.price,
                        image:
                            !item.image || item.image === null
                                ? "/images/favicon.png"
                                : `${keys.SERVER_IP}/images/${item.image.for}/${item.image.name}`,
                    });
                }
            }
        } else {
            const index = orderedTickets.findIndex((obj) => obj.id === value);
            if (index >= 0) {
                const item = orderedTickets.find((obj) => obj.id === value);
                available_quantity = Number(item.quantity) + Number(state.quantity);
                if (available_quantity > value.current_quantity) {
                    setToastAlert({ show: true, title: 'Sorry!', message: 'no more available quantity for this ticket ' });
                    new_quantity = 0;
                } else {
                    item.quantity = Number(item.quantity) + Number(state.quantity);
                }
            } else {
                available_quantity = Number(state.quantity) ? state.quantity : 1;
                if (available_quantity > value.current_quantity) {
                    setToastAlert({ show: true, title: 'Sorry!', message: 'no more available quantity for this item ' });
                    new_quantity = 0;
                } else {
                    orderedItems.push({
                        id: value,
                        quantity: Number(state.quantity) ? state.quantity : 1,
                        name: item.name,
                        exchange: item.type,
                        price: item.price,
                        image:
                            !item.image || item.image === null
                                ? "/images/favicon.png"
                                : `${keys.SERVER_IP}/images/${item.image.for}/${item.image.name}`,
                    });
                }
            }
        }
        setState({
            ...state,
            selectedItem: value,
            total: (Number(state.total) + Number(state.quantity)),
            orderedItems: [...orderedItems],
            orderedTickets: [...orderedTickets],
            quantity: 1,
        });

        let total_price = 0;
        for (let i = 0; i < orderedTickets.length; i++) {
            total_price += orderedTickets[i].price * orderedTickets[i].quantity;
        }
        for (let i = 0; i < orderedItems.length; i++) {
            total_price += orderedItems[i].price * orderedItems[i].quantity;
        }
        setTotalPrice(total_price);
    }

    const createOrder = () => {
        if (state.total === 0) {
            handleStopPreview();
            setToastAlert({
                show: true,
                title: "Please Select Itemes",
                message: "No Items Were Selected",
            });
            return;
        }
        setSubmitted(true);
        setShowModal('payment'); return;
    }

    return (
        <Modal
            id="operationPOS"
            dimmer={state.dimmer}
            open={open}
            onClose={() => setShowModal("")}
        >
            <div
                style={{
                    textAlign: "right",
                    marginBottom: "10px",
                    cursor: "pointer",
                }}
                onClick={handleStopPreview}
            >
                <p
                    style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        textDecoration: "underline",
                    }}
                >
                    Stop preview
                </p>
            </div>
            <Modal.Content>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ width: "80%", padding: "10px 20px" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h1 style={{ margin: 0, color: "#5abdbf" }}>{posName}</h1>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        padding: "5px 10px",
                                        background: state.quantity === "5" ? "#d6af00" : "#5abdbf",
                                        borderRadius: "10px",
                                        marginRight: "10px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleQuantity("5")}
                                >
                                    <h1 style={{ margin: 0, color: "#333" }}>x5</h1>
                                </div>
                                <div
                                    style={{
                                        padding: "5px",
                                        background: state.quantity === "10" ? "#d6af00" : "#5abdbf",
                                        borderRadius: "10px",
                                        marginRight: "10px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleQuantity("10")}
                                >
                                    <h1 style={{ margin: 0, color: "#333" }}>x10</h1>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                height: "600px",
                                maxHeight: "600px",
                                marginTop: "30px",
                                overflowY: "auto",
                                overflowX: "hidden",
                            }}
                        >
                            <Grid textAlign="center">
                                <Grid.Row>
                                    {posItems.length > 0
                                        ? posItems.map((item, i) => {
                                            return (
                                                <POSitems
                                                    key={i}
                                                    id={item.id}
                                                    data={item}
                                                    setSelected={(value) =>
                                                        handleAddItem(value, "item", item)
                                                    }
                                                />
                                            );
                                        })
                                        : ""}
                                    {posTickets.length > 0
                                        ? posTickets.map((item, i) => {
                                            return (
                                                <POSitems
                                                    key={i}
                                                    id={item.id}
                                                    data={item}
                                                    setSelected={(value) =>
                                                        handleAddItem(value, "ticket", item)
                                                    }
                                                />
                                            );
                                        })
                                        : ""}
                                </Grid.Row>
                            </Grid>
                        </div>
                    </div>
                    <div style={{ width: "20%", background: "#eee" }}>
                        <div style={{ padding: "20px 30px" }}>
                            <p
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: "#3d4465",
                                }}
                            >
                                Order list
                            </p>
                        </div>
                        <div className="orderListTitle">
                            <p>ITEM NAME.</p>
                            <p>QUANTITY.</p>
                        </div>
                        <div className="posOrderList">
                            <ul>
                                {state.orderedItems.length > 0 &&
                                    state.orderedItems.map((item, i) => (
                                        <OrderedPOS
                                            key={i}
                                            id={item.id}
                                            quantity={item.quantity}
                                            name={item.name}
                                            exchange={item.exchange}
                                            price={item.price}
                                            setDelete={(value) => handleDelete(value, "item")}
                                            image={item.image}

                                        />
                                    ))}
                                {state.orderedTickets.length > 0 &&
                                    state.orderedTickets.map((item, i) => (
                                        <OrderedPOS
                                            key={i}
                                            id={item.id}
                                            quantity={item.quantity}
                                            name={item.name}
                                            exchange={item.type}
                                            price={item.price}
                                            setDelete={(value) => handleDelete(value, "tiket")}
                                            image={item.image}
                                        />
                                    ))}
                            </ul>
                        </div>
                        <div className="orderList-actions">
                            <div className="action-total">
                                <p>TOTAL</p>
                                <small>{selectedPos.exchange}</small>
                                <p>{totalPrice} €</p>
                            </div>
                            <div
                                className="confirmOrder"
                                onClick={() => {
                                    createOrder();
                                    setOpen(false);
                                }}
                            >
                                <p>CONFIRM ORDER</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default OperationModal;
