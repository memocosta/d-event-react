import React from "react";
import { Grid } from "semantic-ui-react";

const ProjectInfoShared = ({ title, info }) => {
  return (
    <Grid.Column>
      <div className="projectInfo">
        <p> {title} </p> <p> {info} </p>
      </div>
    </Grid.Column>
  );
};

export default ProjectInfoShared;
