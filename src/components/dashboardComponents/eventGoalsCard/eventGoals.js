import React from "react";
import { Grid } from "semantic-ui-react";
import CardShared from "../../../shared/cardShared";
import ProgressShared from "../../../shared/progressShared";

const EventGoal = () => {
  return (
    <Grid.Column>
      <CardShared title="Event Goals">
        <Grid>
          <Grid.Row>
            <Grid.Column width="16" className="mb-3">
              <ProgressShared
                progresstitle="Ticket Sales Target"
                percentage={60}
                background="primary"
              />
            </Grid.Column>
            <Grid.Column width="16" className="mb-3">
              <ProgressShared
                progresstitle="Social Shares Target"
                percentage={34}
                background="success"
              />
            </Grid.Column>
            <Grid.Column width="16" className="mb-2">
              <ProgressShared
                progresstitle="Marketing Campaign Target"
                percentage={65}
                background="dark"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </CardShared>
    </Grid.Column>
  );
};

export default EventGoal;
