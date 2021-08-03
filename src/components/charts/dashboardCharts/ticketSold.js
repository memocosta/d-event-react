import React from "react";
import { Grid } from "semantic-ui-react";
import CardShared from "../../../shared/cardShared";
import TicketSoldChart from "./tickerSoldChart";

const TicketSold = () => {
  return (
    <Grid.Column>
      <CardShared title="Ticket Sold">
        <div className="mb-2">
          <TicketSoldChart />
        </div>

        <div className="card-footer">
          <Grid stackable verticalAlign="middle">
            <Grid.Row columns={2} className="p-0">
              <Grid.Column>
                <div className="px-2">
                  <ul className="d-flex flex-column justify-content-between">
                    <li className="mb-3">
                      {" "}
                      Online Booking{" "}
                      <span className="badge badge-primary badge-pill float-right">
                        14
                      </span>
                    </li>
                    <li className="mb-3">
                      {" "}
                      Telemarketing{" "}
                      <span className="badge badge-primary badge-pill float-right">
                        14
                      </span>
                    </li>
                    <li>
                      Book Store{" "}
                      <span className="badge badge-primary badge-pill float-right">
                        14
                      </span>
                    </li>
                  </ul>
                </div>
              </Grid.Column>
              <Grid.Column className="border-left">
                <div className="px-2">
                  <ul className="d-flex flex-column justify-content-between">
                    <li className="mb-3">
                      {" "}
                      Booth Event{" "}
                      <span className="badge badge-primary badge-pill float-right">
                        14
                      </span>
                    </li>
                    <li className="mb-3">
                      Social Media{" "}
                      <span className="badge badge-primary badge-pill float-right">
                        14
                      </span>
                    </li>
                    <li>
                      Others{" "}
                      <span className="badge badge-primary badge-pill float-right">
                        14
                      </span>
                    </li>
                  </ul>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </CardShared>
    </Grid.Column>
  );
};

export default TicketSold;
