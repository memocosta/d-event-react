import React from "react";
import { Grid } from "semantic-ui-react";
import CardShared from "../../shared/cardShared";
import ProgressShared from "../../shared/progressShared";
import EmailCampaignChart from "../charts/dashboardCharts/emailCampaignChart";

const EmailCampaign = () => {
  return (
    <Grid.Column>
      <CardShared title="Email Campaign">
        <EmailCampaignChart />
        <div style={{ marginTop: "30px", width: "100%" }}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16} className="mb-2">
                <ProgressShared
                  progresstitle="Send Emails"
                  number={70}
                  min={0}
                  max={400}
                  background="primary"
                />
              </Grid.Column>
              <Grid.Column width={16} className="mb-2">
                <ProgressShared
                  progresstitle="Social Shares Target"
                  number={150}
                  max={400}
                  background="primary"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </CardShared>
    </Grid.Column>
  );
};

export default EmailCampaign;
