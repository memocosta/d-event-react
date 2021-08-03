import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { Icon } from "semantic-ui-react";

const CircleProgress = ({ number, min, max, strokeColor }) => {
  return (
    <CircularProgressbarWithChildren
      value={(number / max) * 100}
      styles={{
        path: {
          stroke: `${strokeColor}`,
          strokeLinecap: "round",
          strokeWidth: 4,
          strokeDashoffset: "100",
          transform: "rotate(-0.25turn)",
          transformOrigin: "center center",
        },
        trail: {
          stroke: "#3d4465",
          strokeLinecap: "butt",
          strokeWidth: 4,
          transform: "rotate(0.25turn)",
          transformOrigin: "center center",
        },
      }}
    >
      <div className="circle-text">
        <Icon name='user' size='large' />
        <p
          style={{
            marginLeft: "7px",
            fontWeight: "bold",
            fontSize: "17px",
            color: "inherit",
          }}
        >
          {number}
        </p>
      </div>
    </CircularProgressbarWithChildren>
  );
};

export default CircleProgress;
