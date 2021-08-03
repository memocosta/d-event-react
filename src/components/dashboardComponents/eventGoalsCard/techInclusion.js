import React from "react";
import { Grid } from "semantic-ui-react";
import CardShared from "../../../shared/cardShared";
import CircleProgress from "../circularProgressbar/circleProgress";

const TechInclusion = () => {
  return (
    <Grid.Column>
      <CardShared title="Tech Inclusion">
        <div className="event-attend">
          <div className="attend-member">
            <div className="circle-bar">
              <CircleProgress
                number={1920}
                min={0}
                max={4000}
                strokeColor="#46c79e"
              />
            </div>
            <h6 className="text-light mt-2 mb-0">Attended</h6>
          </div>
        </div>
      </CardShared>
    </Grid.Column>
  );
};

export default TechInclusion;
