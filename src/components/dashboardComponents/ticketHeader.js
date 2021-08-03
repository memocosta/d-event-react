import React from "react";
import { Grid } from "semantic-ui-react";

const TicketHeader = ({ title, value, bg }) => {
  return (
    <Grid.Column>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className={`ticketIcon`} style={{ backgroundColor: bg }}></div>
        <p style={{ marginBottom: 0, fontWeight: "normal" }}> {title}</p>
      </div>

      <h4 style={{ marginTop: "10px" }} className="text-light">
        &euro; {value}
      </h4>
    </Grid.Column>
  );
};

export default TicketHeader;
