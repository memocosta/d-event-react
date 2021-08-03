import React, { useContext, useEffect, useState } from "react";
import MainContent from "../shared/mainContent";
import { Form, Grid, Button, Table, Icon, Card } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import LoadingScreen from "../shared/loadingScreen";
import StateContext from "../context/stateContext";
import { _getOrderDetails, _paymentResponse } from "../controllers/AxiosRequests";
import moment from "moment";

const OrderDetails = ({ match }) => {
  const { isLogged, setLoading, loading,setShowModal } = useContext(StateContext);
  const [orderData, setOrderData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    console.log(isLogged);
    console.log(match.params.id);
    let isMounted = true;
    if (!isMounted) return;
    if (!match.params || !match.params.id) {
      history.push("/");
      return;
    }
    
    setLoading(true);
    if(match.params.response && match.params.response !== undefined && match.params.response === "success"){
      _paymentResponse(isLogged, match.params.id, "assert").then(response => {
        setLoading(false);
        if (response.status === "success") {
          setShowModal("successOrder");
        }
      })
    }
    _getOrderDetails(isLogged, match.params.id).then((res) => {
      setLoading(false);
      if (res.status === "success") {
        setOrderData(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isLogged]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <MainContent id="billingCenter" >
      <div className="secondary_bgColor">
      <Card className="order-card">
          <Card.Header>
            <Grid divided="vertically">
              <Grid.Row columns={2}>
                <Grid.Column>
                  <h2>{`Order : #${match.params.id}`}</h2>
                  <p>{orderData !== null && orderData.price}&euro; {orderData !== null && orderData.type ? "Paid with " + orderData.type : ""}</p>
                </Grid.Column>
                <Grid.Column>
                  <p>{orderData !== null && orderData.owner ? orderData.owner.email : ""}</p>
                  <p>{`Date : ${orderData !== null && moment(orderData.createdAt).format("YYYY-MM-DD")}`}</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Header>
          <div id="billing-container" className="billing-container">
            <div style={{ marginTop: "30px" }}>
              <div className="detailsTable" style={{ marginTop: "20px" }}>
                <Table id="billingTable" celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center"> Name </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Category
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">Type</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Quantity
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">Price</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        VAT rate.
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {orderData &&
                      orderData.tickets.map((ticket, index) => {
                        return (
                          <Table.Row key={index + 1}>
                            <Table.Cell>{ticket.name}</Table.Cell>
                            <Table.Cell textAlign="center">{"ticket"}</Table.Cell>
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
                    {orderData &&
                      orderData.items.map((item, index) => {
                        return (
                          <Table.Row key={index + 1}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell textAlign="center">{"item"}</Table.Cell>
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
              </div>
            </div>
          </div>
        </Card>
          </div>
    </MainContent>
  );
};

export default OrderDetails;
