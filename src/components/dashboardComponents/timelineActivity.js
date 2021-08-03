import React from "react";
import { Link } from "react-router-dom";

const TimelineActivity = () => {
  return (
    <div id="timeline-activity">
      <ul className="timeline mb-0">
        <li>
          <div className="timeline-badge bg-primary"></div>
          <Link to="/" className="timeline-panel">
            <span>January 22, Monday | 11:00 AM</span>
            <h5 className="mt-2">Digital Marketing</h5>
            <div className="label label-danger">Sold out</div>
          </Link>
        </li>
        <li>
          <div className="timeline-badge bg-success"></div>
          <Link to="/" className="timeline-panel">
            <span>January 22, Monday | 11:00 AM</span>
            <h5 className="mt-2">5 Orders Delivered</h5>
            <div className="label label-warning">Pending</div>
          </Link>
        </li>
        <li>
          <div className="timeline-badge bg-warning"></div>
          <Link to="/" className="timeline-panel">
            <span>January 22, Monday | 11:00 AM</span>
            <h5 className="mt-2">3 New Tickets</h5>
            <div className="label label-danger">Sold out</div>
          </Link>
        </li>
        <li>
          <div className="timeline-badge bg-primary"></div>
          <Link to="/" className="timeline-panel">
            <span>January 22, Monday | 11:00 AM</span>
            <h5 className="mt-2">8 New Reviews</h5>
            <div className="label label-success">Free</div>
          </Link>
        </li>
        <li>
          <div className="timeline-badge bg-dark"></div>
          <Link to="/" className="timeline-panel">
            <span>January 22, Monday | 11:00 AM</span>
            <h5 className="mt-2">50 New Facebook likes</h5>
            <div className="label label-secondary">Pending</div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TimelineActivity;
