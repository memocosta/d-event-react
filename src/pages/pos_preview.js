import React, { useContext, useEffect, useState } from "react";
import { Grid} from "semantic-ui-react";
import StateContext from "../context/stateContext";
import POSitems from "../components/POSopertaion/components/posItems";
import { _createOrder, _createPosQR, _createOrderFromPreview, _paymentResponse } from "../controllers/AxiosRequests";
import { _getPOS } from "../controllers/AxiosRequests";
import OrderedPOS from "../components/POSopertaion/components/orderedPOS";
import { keys } from "../config/keys";
import PinScreen from "../shared/pinScreen";
const PosPreview = ({ match }) => {
    const { setShowModal, setSelectedPos, exchangeType, setExchangeType, setToastAlert, isLogged, paymentType, setPaymentType, totalPrice, setTotalPrice, setQrcode, setIsqr } = useContext(StateContext);
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
    const [submitted, setSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [isallowed, setIsallowed] = useState(false);

    const handleSetPinCode = (pinCode) => {
        console.log(pinCode);
        if (pinCode != null) {
            _getPOS(match.params.id, isLogged).then((res) => {
                if (res.status === "success" && res.data.pin_code === pinCode) {
                    console.log(res.data);
                    setPosItems([...res.data.items]);
                    setPosTickets([...res.data.tickets]);
                    setPosname(res.data.name);
                    setSelectedPos(res.data);
                    if (res.data.exchange != "euro") {
                        setExchangeType(res.data.items[0].exchange);
                    } 
                    if (match.params.response && match.params.response !== undefined && match.params.orderId !== undefined) {
                        if (match.params.response === "failed" || match.params.response === "abort") {
                            _paymentResponse(isLogged, match.params.orderId, "deleteManager").then(response => {
                                if (response.status === "success") {
                                    setToastAlert({ show: true, title: 'Payment Failed', message: 'The payment process failed!' })
                                }
                            })
                        } else if (match.params.response === "success") {
                            _paymentResponse(isLogged, match.params.orderId, "assertManager").then(response => {
                                if (response.status === "success") {
                                    setShowModal("successOrder");
                                }
                            })
                        }
                    }
                    setIsallowed(true);

                } else {
                    if (res.status === "error") {
                        setToastAlert({
                            show: true,
                            title: "Wrong PIN",
                            message: res.message,
                        });
                        return;
                    }
                }
            });
        }
    }

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
        const index = arr.findIndex((obj) => obj.id === id);
        const item = arr.find((obj) => obj.id === id);
        let total_price = totalPrice - (item.price * item.quantity);
        setTotalPrice(total_price);
        arr.splice(index, 1);
        if (type === "item") {
            setState({
                ...state,
                orderedItems: arr,
                total: Number(state.total) - Number(item.quantity),
            });
        } else {
            setState({
                ...state,
                orderedTickets: arr,
                total: Number(state.total) - Number(item.quantity),
            });
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
                available_quantity = Number(state.quantity);
                if (available_quantity > value.current_quantity) {
                    setToastAlert({ show: true, title: 'Sorry!', message: 'no more available quantity for this ticket ' });
                    new_quantity = 0;
                } else {
                    orderedTickets.push({
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
            total: Number(state.total) + Number(new_quantity),
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
    };

    useEffect(() => {
        if (paymentType === "" || !submitted) return;

        if (paymentType === "qr") {
            setPaymentType("");
            setTotalPrice(0)
            setState({
                ...state,
                dimmer: "blurring",
                selectedItem: "",
                quantity: 1,
                total: 0,
                orderedItems: [],
                orderedTickets: [],
            });
            return;
        }

        const formData = {
            items:
                state.orderedItems.length > 0
                    ? state.orderedItems.map((a) => {
                        return { id: a.id.id, quantity: Number(a.quantity) };
                    })
                    : [],
            tickets:
                state.orderedTickets.length > 0
                    ? state.orderedTickets.map((a) => {
                        return { id: a.id.id, quantity: Number(a.quantity) };
                    })
                    : [],
        };

        console.log(formData, isLogged, match.params.id);

        _createOrderFromPreview(formData, isLogged, match.params.id).then((res) => {
            console.log(res);
            handleStopPreview();
            setShowModal(false);
            if (res.status === "error") {
                setToastAlert({
                    show: true,
                    title: res.message,
                    message: "Please Be Sure To complete your company information",
                });
                return;
            }
            
            setPaymentType("");
            setTotalPrice(0)
            setState({
                ...state,
                dimmer: "blurring",
                selectedItem: "",
                quantity: 1,
                total: 0,
                orderedItems: [],
                orderedTickets: [],
            });
        });

        return () => {
            setPaymentType("");
        };
    }, [paymentType, setSubmitted, totalPrice]);

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
        console.log(state);
        let total_price = 0;
        for (let i = 0; i < state.orderedTickets.length; i++) {
            total_price += state.orderedTickets[i].price * state.orderedTickets[i].quantity;
        }
        for (let i = 0; i < state.orderedItems.length; i++) {
            total_price += state.orderedItems[i].price * state.orderedItems[i].quantity;
        }
        setTotalPrice(total_price);

        let min = 1000;
        let max = 9999;
        let randomX = 'pos' + (Math.floor(Math.random() * (max - min + 1)) + min);
        setQrcode(randomX);
        let obj = {
            items: state.orderedItems.length > 0 ? state.orderedItems.map((a) => { return { id: a.id.id, quantity: Number(a.quantity) }; }) : [],
            tickets: state.orderedTickets.length > 0 ? state.orderedTickets.map((a) => { return { id: a.id.id, quantity: Number(a.quantity) }; }) : [],
        };
        let reqObj = {
            amount: total_price,
            pos_id: match.params.id,
            obj: obj,
            qr: randomX,
        }
        _createPosQR(reqObj).then((res) => {
            setIsqr(true);
            setShowModal("payment");
        });
        return;
    };

    if (!isallowed) {
        return <PinScreen setPinCode={(value) => handleSetPinCode(value)} />;
    }

    return (
        <div
            id="posPreview"
            dimmer={state.dimmer}
            open={true}
            style={{ width: "100%!important" }}
        >
            <div className="content">
                <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh" }}>
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
                    <div style={{ width: "20%", background: "#eee", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
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
                                                exchange={exchangeType}
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
                                                exchange={exchangeType}
                                                price={item.price}
                                                setDelete={(value) => handleDelete(value, "ticket")}
                                                image={item.image}
                                            />
                                        ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <div className="orderList-actions">
                                <div className="action-total">
                                    <p>TOTAL</p>
                                    <small>{exchangeType}</small>
                                    <p>{totalPrice} </p>
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
                </div>
            </div>
        </div>
    );
};

export default PosPreview;
