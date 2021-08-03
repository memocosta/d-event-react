import React, { useContext, useEffect } from "react";
import MainContent from "../shared/mainContent";
import ProjectDetails from "../components/manageProjectsComponents/projectDetails";
import EntryTickets from "../components/manageProjectsComponents/EntryTickets";
import BeverageTickets from "../components/manageProjectsComponents/BeverageTickets";
import FoodTickets from "../components/manageProjectsComponents/foodTickets";
import CardShared from "../shared/cardShared";
import PointOfSale from "../components/manageProjectsComponents/pointOfSale";
import ServiceTickets from "../components/manageProjectsComponents/serviceTickets";
import GoodTickets from "../components/manageProjectsComponents/goodTickets";
import StateContext from "../context/stateContext";
import { useState } from "react";
import { _getTickets, _getItems, _deleteItem, _getPOSdata } from "../controllers/AxiosRequests";
import LoadingScreen from "../shared/loadingScreen";
import { Grid, Image } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import CreateNewProject from "../shared/createNewProject";
import VoucherTickets from "../components/manageProjectsComponents/voucherTickets";
import { keys } from "../config/keys";

const ManageProject = ({ match }) => {
    const { setRedirect, selectedProject, setSelectedProject, setLoading, loading, isLogged, setToastAlert } = useContext(
        StateContext
    );
    const [projectData, setProjectData] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [posData, setPosData] = useState([]);
    const [entryTickets, setEntryTickets] = useState([]);
    const [beverageTicket, setBeverageTicket] = useState([]);
    const [foodTicket, setFoodTicket] = useState([]);
    const [serviceTicket, setServiceTicket] = useState([]);
    const [goodTicket, setGoodTicket] = useState([]);
    const [voucherTicket, setVoucherTicket] = useState([]);
    // const entryTickets = [
    //   {
    //     id: "1",
    //     name: "D-Event Ticket",
    //     price: 12.44,
    //     quantity: 200,
    //     exchangeable: "Yes",
    //     refundable: "Yes",
    //   },
    // ];
    // const beverageTicket = [
    //   // {
    //   //   id: "1",
    //   //   name: "D-Event Beverage Ticket",
    //   //   price: 12.44,
    //   //   quantity: 200,
    //   //   exchangeable: "Yes",
    //   //   refundable: "Yes",
    //   // },
    // ];
    // const foodTicket = [];
    // const serviceTicket = [];
    // const goodTicket = [];

    const [items, setItems] = useState([]);
    const history = useHistory()

    useEffect(() => {
        let isMounted = true;
        if (!isMounted || selectedProject.length === 0 || isLogged === '') {

            setLoading(false);
            return
        };
        setLoading(true);

        console.log('====================================');
        console.log(selectedProject);
        console.log('====================================');
        setProjectData(selectedProject);
        _getTickets(selectedProject[0].id).then((res) => {
            // setEntryTickets([])
            // setBeverageTicket([])
            // setFoodTicket([])
            // setServiceTicket([])
            // setGoodTicket([])
            var entryTicket = [];
            var beverageTickets = [];
            var foodTickets = [];
            var serviceTickets = [];
            var goodTickets = [];
            var voucherTickets = [];
            res.data.forEach(ticket => {
                switch (ticket.type) {
                    case "entry":
                        entryTicket.push(ticket);
                        // setEntryTickets([...entryTickets, ticket])
                        break;
                    case "beverage":
                        beverageTickets.push(ticket);
                        // setBeverageTicket([...beverageTicket, ticket])
                        break;
                    case "food":
                        foodTickets.push(ticket);
                        // setFoodTicket([...foodTicket, ticket])
                        break;
                    case "service":
                        serviceTickets.push(ticket);
                        // setServiceTicket([...serviceTicket, ticket])
                        break;
                    case "good":
                        goodTickets.push(ticket);
                        // setGoodTicket([...goodTicket, ticket])
                        break;
                    case "voucher":
                        voucherTickets.push(ticket);
                        // setGoodTicket([...goodTicket, ticket])
                        break;
                    default:
                        break;
                }
            });
            setEntryTickets(entryTicket)
            setBeverageTicket(beverageTickets)
            setFoodTicket(foodTickets)
            setServiceTicket(serviceTickets)
            setGoodTicket(goodTickets)
            setVoucherTicket(voucherTickets)
            setTickets(res.data);
        });
        _getItems(selectedProject[0].id).then(res => {
            setItems(res.data);
            setLoading(false)
        })

        _getPOSdata(selectedProject[0].id, isLogged).then(res => {
            if (res.error) {
                setToastAlert({ show: true, title: 'Something went wrong!', message: 'Something went wrong, please Refresh the page!' })
                return
            }
            setPosData(res.data)

        })
        return () => {
            isMounted = false;
        };
    }, [selectedProject, setSelectedProject, setLoading, isLogged, setToastAlert]);

    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        setRedirect("");
        return () => {
            isMounted = false;
        };
    }, [setRedirect]);

    const handleOnClickEdit = (id) => {
        history.push('/manageProject/editItem/' + id)
    }
    const handleDeleteView = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h1>Are you sure?</h1>
                        <p>You want to delete this Item?</p>
                        <div className="buttons">
                            <button onClick={onClose}>No</button>
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    _deleteItem(id, isLogged).then(res => {
                                        setLoading(false);
                                        if (res.status === "error") {
                                            setToastAlert({
                                                show: true,
                                                message: "Something went wrong, please Try Again!",
                                            });
                                            return;
                                        }
                                        setSelectedProject([...selectedProject]);
                                    })
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
    }

    if (loading) {
        return <LoadingScreen />;
    }
    if (selectedProject.length === 0) {
        return <CreateNewProject />
    }
    return (
        <MainContent id="manageProject">
            <ProjectDetails data={projectData} url={match.url} />
            <CardShared id="" title="">
                <div className="project-details-header mb-2">
                    <p> Manage Tickets </p>
                </div>
                <EntryTickets data={entryTickets} />
                <BeverageTickets data={beverageTicket} />
                <FoodTickets data={foodTicket} />
                <ServiceTickets data={serviceTicket} />
                <GoodTickets data={goodTicket} />
                <VoucherTickets data={voucherTicket} />
            </CardShared>
            <CardShared id='' title=''>
                <p>Items</p>
                <div className="item-list-view">
                    <ul>
                        {items && items.length > 0 && items.map((item, i) => (
                            <li key={i}>
                                <Grid className="w-100">
                                    <Grid.Row>
                                        <Grid.Column width="5" textAlign="center">
                                            <Image src={!item.image ? '/images/favicon.png' : `${keys.SERVER_IP}/images/${item.image.for}/${item.image.name}`} />
                                        </Grid.Column>
                                        <Grid.Column width="8" verticalAlign="middle">
                                            <h5
                                                style={{
                                                    marginBottom: 0,
                                                    color: "#3d4465",
                                                }}
                                            >
                                                {item.name}
                                            </h5>
                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#3d4465",
                                                    margin: "3px 0 0 0",
                                                }}
                                            >
                                                {item.price} ({item.exchange})
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
                                                <FontAwesomeIcon id="editItemIcon" icon={faPen} size="1x" onClick={() => handleOnClickEdit(item.id)} />
                                                <FontAwesomeIcon
                                                    id="deleteItemIcon"
                                                    icon={faTrash}
                                                    size="1x"
                                                    color="red"
                                                    style={{ color: "red" }}
                                                    onClick={() => handleDeleteView(item.id)}
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </li>
                        ))}

                    </ul>
                </div>
            </CardShared>
            <CardShared id="pointOfSale" title="">
                <div className="project-details-header mb-2">
                    <p> Point Of Sale </p>
                </div>
                <PointOfSale items={posData} />
            </CardShared>
        </MainContent>
    );
};

export default ManageProject;
