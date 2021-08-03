import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ChartShared = (props) => {
    return (
        <div className="card widget-stat">
            <div className={`chart-wrapper bg-${props.background} pt-5`}>
                {props.children}
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-center">
                    <div className="direction-row">
                        <h4 className="text-light">{props.title}</h4>
                        <h3 className="text-light amount-text">{props.earnings.toFixed(2)} €</h3>
                    </div>
                    <span className="text-muted">
                        {props.subTitle} | {props.percentage}%{" "}
                        <FontAwesomeIcon
                            icon={props.status === "up" ? faArrowUp : faArrowDown}
                            className={props.status}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChartShared;
