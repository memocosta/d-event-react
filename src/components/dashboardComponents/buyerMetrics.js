import React from "react";
import { Form, Grid } from "semantic-ui-react";
import CardShared from "../../shared/cardShared";
import GenderChart from "../charts/dashboardCharts/genderChart";
import TopCOuntriesChart from "../charts/dashboardCharts/topCountriesChart";
import TopRegionsChart from "../charts/dashboardCharts/topRegionChart";

const noOptions = [{ key: "0", text: "No Tickets", value: "noTickets" }];
const BuyerMetrics = ({ noSelect }) => {
  const tickets = [{ key: "1", text: "ticket1", value: "Ticket 1" }];
  const options = [{ key: "1", text: "ticket1", value: "Ticket 1" }];
  // useEffect(() => {
  //   let isMounted = true;
  //   if (!isMounted || selectedProject.length === 0) return;
  //   const projectID = selectedProject[0].id
  //   _getTickets(projectID).then((res) => {

  //     setTickets(res);
  //     let ticketData = [];
  //     res.map((ticket, i) => {
  //        return ticketData.push({
  //         key: i,
  //         text: ticket.name,
  //         value: ticket.id,
  //       });
  //     });
  //     setOptions(ticketData);
  //     return;
  //   });

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [selectedProject]);
  return (
    <CardShared id="buyerMetrics" title="Buyers Metrics">
      {noSelect && (
        <div className="select-section">
          <Form.Select
            fluid
            options={options.length > 0 ? options : noOptions}
            placeholder="Select Ticket"
          />
        </div>
      )}

      {tickets.length > 0 && (
        <Grid
          stackable
          verticalAlign="middle"
          textAlign="center"
          style={{ width: "100%", marginTop: "10px" }}
        >
          <Grid.Row columns={2}>
            <Grid.Column>
              <p>Top Countries</p>
              <TopCOuntriesChart />
            </Grid.Column>
            {/* <Grid.Column>
              <p>Top Regions</p>
              <TopRegionsChart />
            </Grid.Column> */}
            <Grid.Column>
              <p>Gender</p>
              <GenderChart />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </CardShared>
  );
};

export default BuyerMetrics;
