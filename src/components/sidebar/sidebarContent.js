import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, ListItem } from "@material-ui/core";
import React, { useContext, useState } from "react";
import StateContext from "../../context/stateContext";
import { useHistory } from "react-router-dom";
import { Icon } from "semantic-ui-react";

const SidebarContent = ({
  depthStep = 10,
  depth = 0,
  expanded,
  item,
  ...rest
}) => {
  const { show } = useContext(StateContext);
  const [collapsed, setCollapsed] = useState(true);
  const { label, items, Icons, path } = item;
  const history = useHistory();

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };
  const onClick = (e) => {
    if (Array.isArray(items)) {
      toggleCollapse();
    } else {
      history.push(path);
    }
  };

  const handleOnClick = (path) => {
    history.push(path);
  };

  let expandIcon;

  if (Array.isArray(items) && items.length) {
    expandIcon = (
      <div style={{ float: "right" }} className="expand-arrow-icon">
        <FontAwesomeIcon
          icon={faAngleRight}
          className={`sidebar-item-expand-arrow ${
            !collapsed ? "rotated-icon" : ""
          }`}
        />
      </div>
    );
  }
  return (
    <>
      <ListItem
        className="sidebar-item"
        style={{ cursor: "pointer" }}
        {...rest}
        onClick={onClick}
      >
        <div
          style={{ paddingLeft: depth * depthStep }}
          className="sidebar-item-content"
        >
          {Icons && <FontAwesomeIcon icon={Icons} />}
          <div
            className="sidebar-subItem-text"
            style={{ display: `${show ? "flex" : "none"}`, color: "#c5c7de" }}
          >
            {label}
          </div>
        </div>

        {show ? expandIcon : null}
      </ListItem>
      <Collapse in={!collapsed} timeout="auto" unmountOnExit>
        {Array.isArray(items) && (
          <ul className="subItems-ul">
            {items.map((subItem, i) => (
              <li key={i} onClick={() => handleOnClick(subItem.path)}>
                <Icon name="circle" size="small" />
                <span className={show ? "active" : ""}>{subItem.label}</span>
              </li>
            ))}
            {/* <li>
              <Icon name="sign in alternate" size="small" />
              Logout
            </li> */}
          </ul>
          // <List disablePadding dense>
          //   {/* {items.map((subItem, i) => (
          //     <Fragment key={`${subItem.name}${i}`}>

          //       <SidebarContent
          //         className="sidebar-subItems"
          //         depth={depth + 1}
          //         depthStep={depthStep}
          //         item={subItem}
          //       />
          //     </Fragment>
          //   ))} */}
          // </List>
        )}
      </Collapse>
    </>
  );
};

export default SidebarContent;
