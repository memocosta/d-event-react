import React from "react";
import { Grid } from "semantic-ui-react";
import CardShared from "../../../shared/cardShared";
import CircleProgress from "../circularProgressbar/circleProgress";

const PrestoSummit = () => {
  return (
    <Grid.Column>
      <CardShared title="Presto Summit">
        <div className="event-attend">
          <div className="attend-member">
            <div className="circle-bar">
              <CircleProgress
                number={100}
                min={0}
                max={150}
                strokeColor="#00092a"
              />
            </div>
            <h6 className="text-light mt-2 mb-0">Ongoing</h6>
          </div>
        </div>
      </CardShared>
    </Grid.Column>
  );
};

export default PrestoSummit;
