import React from "react";
import { Grid } from "semantic-ui-react";
import CardShared from "../../../shared/cardShared";
import CircleProgress from "../circularProgressbar/circleProgress";

const BloomReach = () => {
  return (
    <Grid.Column>
      <CardShared title="Bloomreach Connect">
        <div className="event-attend">
          <div className="attend-member">
            <div className="circle-bar">
              <CircleProgress
                number={192}
                min={0}
                max={400}
                strokeColor="#7005ff"
              />
            </div>
            <h6 className="text-light mt-2 mb-0">Attend</h6>
          </div>
        </div>
      </CardShared>
    </Grid.Column>
  );
};

export default BloomReach;
