import React from "react";
import Widgets from "../components/charts/dashboardCharts/widgets";
import MainContent from "../shared/mainContent";
import { Form, Grid } from "semantic-ui-react";
import BarChart from "../components/charts/dashboardCharts/barChart";
import CardShared from "../shared/cardShared";
import TicketHeader from "../components/dashboardComponents/ticketHeader";
import LastOrderTable from "../components/dashboardComponents/lastOrdersTable";
import BuyerMetrics from "../components/dashboardComponents/buyerMetrics";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import StateContext from "../context/stateContext";
import { _getSalesPerTicktsChart } from "../controllers/AxiosRequests";
import CreateNewProject from "../shared/createNewProject";

const options = [
    { key: "1", text: "Past 7 days", value: "week" },
    { key: "2", text: "Past 30 days", value: "month" },
    { key: "3", text: "Full year", value: "year" },
];

const HomePage = () => {
    const { isLogged, selectedProject } = useContext(StateContext);
    const [project, setProject] = useState([]);
    const [ticktsSales, setTicketsSales] = useState([]);
    const [filterType, setFilterType] = useState('week');

    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        if (selectedProject.length === 0) {
            setProject([]);
            return;
        }
        setProject(selectedProject);

        _getSalesPerTicktsChart(isLogged, selectedProject[0].id).then(res => {
            console.log(res.data);
            setTicketsSales(res.data);
        });

        return () => {
            isMounted = false;
        };
    }, [selectedProject]);

    const handleOnChange = (value) => {
        console.log(value);
        setFilterType(value);
        _getSalesPerTicktsChart(isLogged, selectedProject[0].id, value).then(res => {
            console.log(res.data);
            setTicketsSales(res.data);
        });
    }

    if (project.length === 0) {
        return <CreateNewProject />
    }

    return (
        <MainContent id="Dashboard">
            <div className="dashboard-header mb-2 pl-20">
                <p>Revenue Overview</p>
            </div>

            <div id="salesPerChannel" className="header-content">
                <p>Sales per Channel</p>
                <Widgets />
            </div>

            {/* TICKET CHART  & UPCOMING EVENTS */}
            <div className="mb-2">
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <CardShared id="salesPerTicket" title="Sales Per Ticket">
                                <Form.Select fluid options={options} defaultValue="week" onChange={(e, { value }) =>
                                    handleOnChange(value)
                                } />
                                {/* TICKET HEADER VALUES */}
                                <Grid>
                                    <Grid.Row columns="3">
                                        {ticktsSales.slice(0, 3).map((i, index) => {
                                            return <TicketHeader title={i.ticket_name} value={i.ticket_price} bg={index === 0 ? `#6a1ccd` : index === 1 ? "#3d4465" : "#28c76f"} key={index} />
                                        })}
                                    </Grid.Row>
                                </Grid>

                                {/* BAR CHART */}
                                <div className="card-bar-chart">
                                    <BarChart tickets={ticktsSales} filter={filterType} />
                                </div>
                            </CardShared>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

            {/* EMAIL CAMPAIGN | TICKET SOLD | SUPPORT TEAM */}
            <div className="mb-2">
                <LastOrderTable />
                <BuyerMetrics />
            </div>
        </MainContent>
    );
};

export default HomePage;
