import React from "react";

const ProgressShared = ({
  progresstitle,
  min = null,
  max = null,
  number = null,
  background,
  percentage = null,
}) => {
  return (
    <div>
      <p className="mb-1">
        {progresstitle}
        <span className="float-right font-weight-bold text-dark">
          {number !== null ? number : percentage + "%"}
        </span>
      </p>
      <div className="progress mb-4">
        <div
          className={`progress-bar progress-bg-${background} progress-animated`}
          style={{
            width: `${number !== null ? (number / max) * 100 : percentage}%`,
            height: "6px",
          }}
          min-value={min !== null ? min : 0}
          max-value={max}
          role="progressbar"
        ></div>
      </div>
    </div>
  );
};

export default ProgressShared;
