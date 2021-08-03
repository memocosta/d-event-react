import React, { Fragment, useContext } from "react";
import { Image } from "semantic-ui-react";
import StateContext from "../../context/stateContext";
import SidebarContent from "./sidebarContent";

const SideBar = ({ items, depthStep, depth, expanded }) => {
  const { show } = useContext(StateContext);

  return (
    <div className="sidebar" style={{ width: `${show ? "300px" : "60px"}` }}>
      <div className="dashboard-logo">
        <Image
          className={show ? "ml-3" : ""}
          src={show ?"/images/devent-logo-text-300x123.png" : "/images/devent-logo.png"}
        />
        {/* <h5 style={{ display: `${show ? "flex" : "none"}` }}>EVENT</h5> */}
      </div>
      <div className="nav-header">
        <p
          style={{
            display: `${show ? "flex" : "none"}`,
          }}
        >
          Navigation
        </p>
      </div>
      <div key={2}>
        {items.map((item, i) => {
          return (
            <Fragment key={`${item.name}${i}`}>
              <SidebarContent
                key={`${item.name}${i}`}
                depthStep={depth}
                className={`sidebar-link`}
                expanded={expanded}
                item={item}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
