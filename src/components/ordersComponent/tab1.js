import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Grid, Table, Transition, Card } from "semantic-ui-react";
import StateContext from "../../context/stateContext";
import GenderChart from "../charts/dashboardCharts/genderChart";
import TopCOuntriesChart from "../charts/dashboardCharts/topCountriesChart";
import { _getRefundOrders } from "../../controllers/AxiosRequests";
import moment from "moment";

const Tab1 = ({ show, setShow, orders }) => {
    const [visible, setVisible] = useState(false);
    const [latestOrders, setLatestOrders] = useState([]);
    const [latestOrdersRefund, setLatestOrdersRefund] = useState([]);
    const { setShowModal, selectedProject, setToastAlert, setRefundMsg, setRefundActionID, isLogged, isRefundConfirmed, setIsRefundConfirmed } = useContext(StateContext);
    const history = useHistory();

    useEffect(() => {
        let isMounted = true;

        if (isRefundConfirmed) {
            setIsRefundConfirmed(false);
            history.push("/finance/orders")
        }

        if (!isMounted || selectedProject.length === 0 || isLogged === "") return;
        if (show) {
            setVisible(true);
        } else {
            setVisible(false);
        }

        setLatestOrders(orders);

        _getRefundOrders(selectedProject[0].id, isLogged).then((res) => {
            if (res.error) {
                setToastAlert({
                    show: true,
                    title: res.message,
                    message: "Something went wrong while Getting Project Orders",
                });
                return;
            }
            setLatestOrdersRefund(res.data);
        });

        return () => {
            isMounted = false;
        };
    }, [selectedProject, isLogged, orders, isRefundConfirmed]);

    const handleOnClick = (ref_id, ref_txt) => {
        setRefundActionID(ref_id);
        setRefundMsg(ref_txt);
        setShowModal("refundModal");
    };

    return (
        <Transition visible={visible} duration={500} animation="scale">
            <Container className="secondary_bgColor">
                <h3 style={{ color: "#5abdbf" }}>Recent orders</h3>
                {latestOrders.length > 0
                    ? latestOrders.map((order, index) => {
                        if (index < 5) {
                            return (
                                <Card className="order-card">
                                    <Card.Header>
                                        <Grid divided="vertically">
                                            <Grid.Row columns={2}>
                                                <Grid.Column>
                                                    <h2>{`Order : #${order.id}`}</h2>
                                                    <p>{order.price}&euro; {order !== null && order.type ? "Paid with " + order.type : ""}</p>
                                                </Grid.Column>
                                                <Grid.Column>{order.owner && order.owner.email}</Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Card.Header>
                                    <Card.Meta>Tickets</Card.Meta>
                                    <Card.Content>
                                        <Table id="billingTable">
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell textAlign="center">
                                                        {" "}Name{" "}
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell textAlign="center">
                                                        Category
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell textAlign="center">
                                                        Type
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell textAlign="center">
                                                        Quantity
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell textAlign="center">
                                                        Price
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell textAlign="center">
                                                        VAT rate.
                                                    </Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>

                                            <Table.Body>
                                                {order.tickets.map((ticket, index) => {
                                                    return (
                                                        <Table.Row key={index + 1}>
                                                            <Table.Cell>{ticket.name}</Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {"ticket"}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {ticket.type}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {ticket.orderTickets.length}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {ticket.price} &euro;
                                                            </Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {ticket.vat_rate}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                })}
                                                {order.items.map((item, index) => {
                                                    return (
                                                        <Table.Row key={index + 1}>
                                                            <Table.Cell>{item.name}</Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {"item"}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {item.exchange}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {item.orderItems.length}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {item.price} &euro;
                                                            </Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                {item.vat_rate}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                })}
                                            </Table.Body>
                                        </Table>
                                    </Card.Content>
                                </Card>
                            );
                        }
                    })
                    : ""}

                <div style={{ marginTop: "10px" }}>
                    <p
                        style={{
                            textDecoration: "underline",
                            fontWeight: "bold",
                            color: "#5abdbf",
                            cursor: "pointer",
                        }}
                        onClick={() => setShow("tab2")}
                    >
                        View All
                    </p>
                </div>

                {/* refund table */}
                <div style={{ marginTop: "20px" }}>
                    <h3 style={{ color: "#5abdbf" }}>Last refund requests</h3>
                    <Table id="refundTable" textAlign="center" celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Request #</Table.HeaderCell>
                                <Table.HeaderCell>Requester</Table.HeaderCell>
                                <Table.HeaderCell>Ticket</Table.HeaderCell>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {latestOrdersRefund.map((orderRefund, index) => {
                                return (
                                    <Table.Row key={index + 1}>
                                        <Table.Cell>{orderRefund._id}</Table.Cell>
                                        <Table.Cell>{orderRefund.user.name}</Table.Cell>
                                        <Table.Cell>{orderRefund.ticket.name}</Table.Cell>
                                        <Table.Cell>{moment(orderRefund.updatedAt).format("MM-DD-YYYY")}</Table.Cell>
                                        <Table.Cell>
                                            {orderRefund.is_refunded == 2
                                                ?
                                                <p
                                                    style={{
                                                        color: "#46c79e",
                                                    }}
                                                >
                                                    Refunded
                                                </p>
                                                :
                                                <p
                                                    style={{
                                                        color: "red",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleOnClick(orderRefund._id, "Refund " + orderRefund.user.name + " with " + orderRefund.ticket.price + " € ?")}
                                                >
                                                    Refund Now
                                                </p>
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                            
                        </Table.Body>
                    </Table>
                </div>

                <div style={{ marginTop: "30px" }}>
                    <h3 style={{ color: "#5abdbf" }}>Buyers Metrics</h3>
                    <Grid
                        stackable
                        verticalAlign="middle"
                        textAlign="center"
                        style={{ width: "100%", marginTop: "10px" }}
                    >
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <p style={{ color: "#5abdbf", fontWeight: "bold" }}>
                                    Top Countries
                                </p>
                                <TopCOuntriesChart />
                            </Grid.Column>
                            <Grid.Column>
                                <p style={{ color: "#5abdbf", fontWeight: "bold" }}>Gender</p>
                                <GenderChart />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Container>
        </Transition>
    );
};

export default Tab1;
