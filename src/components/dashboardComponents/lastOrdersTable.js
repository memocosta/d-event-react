import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Grid, Table } from "semantic-ui-react";
import CardShared from "../../shared/cardShared";
import { _getDashboardOrders } from "../../controllers/AxiosRequests";
import StateContext from "../../context/stateContext";
import moment from "moment";

const LastOrderTable = () => {
    const { selectedProject, isLogged, setToastAlert } = useContext(StateContext);
    const [orders, setOrders] = useState([])
    useEffect(() => {
        let isMounted = true;
        if (!isMounted || selectedProject.length === 0 || isLogged === "") return;

        _getDashboardOrders(selectedProject[0].id, isLogged).then(res => {
            if (res.error) {
                setToastAlert({
                    show: true,
                    title: res.message,
                    message:
                        "Something went wrong while Getting Project Orders",
                });
                return;
            }
            setOrders(res.data);
        });

        return () => {
            isMounted = false;
        };
    }, [selectedProject, isLogged]);

    return (
        <CardShared id="lastOrderTable" title="Last Orders">
            {orders.map((order, i) => {
                if (i < 5) {
                    return (
                        <Link to={`/order-details/${order.id}`}>
                            <Card className="order-card">
                                <Card.Header>
                                    <Grid divided="vertically">
                                        <Grid.Row columns={2}>
                                            <Grid.Column>
                                                <h2>{`Order : #${order.id}`}</h2>
                                                <p>{order.price}&euro; {order !== null && order.type ? "Paid with " + order.type : ""}</p>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <p>{order !== null && order.owner ? order.owner.email : ""}</p>
                                                <p>{`Date : ${moment(order.createdAt).format("YYYY-MM-DD")}`}</p>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Card.Header>
                            </Card>
                        </Link>
                    )
                }
            })}
            <div style={{ marginTop: "10px" }}>
                <Link to={`/finance/orders`}>View All</Link>
            </div>
        </CardShared>
    );
};

export default LastOrderTable;
