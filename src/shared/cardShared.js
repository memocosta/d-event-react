import React from "react";

const CardShared = (props) => {
  return (
    <div id={props.id} className={`card bg-secondary cardless`}>
      {props.title !== "" && (
        <div className="card-header d-block bordered">
          <p className="card-title">{props.title}</p>
        </div>
      )}

      <div className="card-body event-goals">{props.children}</div>
    </div>
  );
};

export default CardShared;
