import React, { useEffect, useState } from "react";
import { Button, Container, Form, Icon, Table, Transition, Card, Grid } from "semantic-ui-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ClipboardItem from 'clipboard';

const orderType = [
    { key: "0", text: "All Completed ", value: "all" },
    { key: "1", text: "Refunded Orders", value: "refunded" },
    { key: "2", text: "Pending Orders", value: "pending" },
];
const dateOptions = [
    { key: "0", text: "Since sales started", value: "started" },
    { key: "1", text: "Refunded Orders", value: "refunded" },
    { key: "2", text: "Pending Orders", value: "pending" },
];
const sortOptions = [
    { key: "0", text: "Date Descending", value: "desc" },
    { key: "1", text: "Date Ascending", value: "asc" },
];
const perPageOptions = [
    { key: "0", text: "20", value: 20 },
    { key: "1", text: "40", value: 40 },
    { key: "2", text: "60", value: 60 },
    { key: "3", text: "100", value: 100 },
];

const Tab2 = ({ show, setShow, orders }) => {
    const [visible, setVisible] = useState(false);
    const [latestOrders, setLatestOrders] = useState([]);
    const [realLatestOrders, setRealLatestOrders] = useState([]);
    const [reverseLatestOrders, setReverseLatestOrders] = useState([]);
    const [state, setState] = useState({
        osearch: "",
        osort: "desc",
        otype: "all",
        odate: "started",
        oexport: 20
    });

    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        if (show) {
            setVisible(true);
        } else {
            setVisible(false);
        }

        setRealLatestOrders(orders);
        setReverseLatestOrders([...orders].reverse());
        setLatestOrders(orders);
        

        return () => {
            isMounted = false;
        };
    }, [show, orders]);

    const filterIt = (arr, searchKey) => {
        return arr.filter(function(obj) {
            if (obj.id == searchKey) {
                return true;
            } else {
                if (obj.owner) {
                    return (obj.owner.name.includes(searchKey) || obj.owner.email.includes(searchKey))
                }
            }
        });
    };

    const makeFilter = (osearch, otype, odate, osort) => {
        let filterOrders = (osort == "desc") ? realLatestOrders : reverseLatestOrders
        if (osearch && otype == "all" && odate == "started") {
            setLatestOrders(filterIt(filterOrders, osearch));
        } else if (otype != "all" || odate != "started") {
            setLatestOrders([]);
        } else {
            setLatestOrders(filterOrders);
        }

    };

    const printDocument = () => {
        const input = document.getElementById('divToPrint');
        html2canvas(input).then((canvas) => {
            const imgData = new Image();
            imgData.src = canvas.toDataURL('image/png');
            imgData.height = 2000;
            imgData.width = input.clientWidth;
            let link = document.createElement('a');
            link.href = imgData.src;
            link.download = "download.png";
            //Firefox requires the link to be in the body
            document.body.appendChild(link);
            //simulate click
            link.click();
            //remove the link when done
            document.body.removeChild(link);
            // document.getElementById("v4").appendChild(imgData);
            // const pdf = new jsPDF();
            // pdf.addImage(imgData, 'JPEG', 0, 0);
            // pdf.save("download.pdf");
        });
    }

    return (
        <Transition visible={visible} duration={500} animation="scale">
            <Container className="secondary_bgColor">
                <div id="ordersTab2">
                    <div className="allOrders-title">
                        <p style={{ cursor: "pointer" }} onClick={() => setShow("tab1")}> <Icon name="angle left" /> Back </p>
                        <p>All orders</p>
                    </div>
                    <div className="order-container">
                        <Form>
                            <Form.Field>
                                <Form.Input
                                    type="search"
                                    icon="search"
                                    placeholder="eg. order #, name or email"
                                    iconPosition="left"
                                    onChange={ (e, { value }) => {
                                            setState({ ...state, osearch: value });
                                            makeFilter(value, state.otype, state.odate, state.osort);
                                        }
                                    }
                                    value={state.osearch}
                                />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <Form.Select
                                        fluid
                                        label="ORDER TYPE"
                                        options={orderType}
                                        defaultValue={"all"}
                                        onChange={ (e, { value }) => {
                                                setState({ ...state, otype: value });
                                                makeFilter(state.osearch, value, state.odate, state.osort);
                                            }
                                        }
                                        value={state.otype}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Select
                                        fluid
                                        label="DATE"
                                        options={dateOptions}
                                        defaultValue="started"
                                        onChange={ (e, { value }) => {
                                                setState({ ...state, odate: value });
                                                makeFilter(state.osearch, state.otype, value, state.osort);
                                            }
                                        }
                                        value={state.odate}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Select
                                        fluid
                                        label="SORT"
                                        options={sortOptions}
                                        defaultValue="desc"
                                        onChange={ (e, { value }) => {
                                                setState({ ...state, osort: value });
                                                makeFilter(state.osearch, state.otype, state.odate, value);
                                            }
                                        }
                                        value={state.osort}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Select
                                        fluid
                                        label="Export"
                                        options={perPageOptions}
                                        defaultValue="20"
                                        onChange={ (e, { value }) => {
                                            setState({ ...state, oexport: value });
                                        }
                                    }
                                    value={state.oexport}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                        <div className="tax-actions"> 
                            <Button content="All tax Invoices" icon="download" onClick={printDocument} primary /> 
                        </div>
                        <div id="v4">
                            
                        </div>
                    </div>
                    <div className="orders" id="divToPrint">
                        {latestOrders.length > 0
                            ? latestOrders.map((order, index) => {
                                if (index < state.oexport)  {
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
                                            
                                            <Card.Content>
                                                <Table id="billingTable">
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell textAlign="center">
                                                                Buyer
                                                            </Table.HeaderCell>
                                                            <Table.HeaderCell textAlign="center">
                                                                Item or Ticket Name
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
                                                                    <Table.Cell textAlign="center">
                                                                        {order.owner && order.owner.name}
                                                                    </Table.Cell>
                                                                    <Table.Cell textAlign="center">
                                                                        {ticket.name}
                                                                    </Table.Cell>
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
                                                                    <Table.Cell textAlign="center">
                                                                        {order.owner && order.owner.name}
                                                                    </Table.Cell>
                                                                    <Table.Cell textAlign="center">
                                                                        {item.name}
                                                                    </Table.Cell>
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
                    </div>
                </div>
            </Container>
        </Transition>
    );
};

export default Tab2;
