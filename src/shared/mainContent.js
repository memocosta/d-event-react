import React from "react";
import { Container } from "semantic-ui-react";

const MainContent = (props) => {
  return (
    <Container>
      <div
        className={`${props.subClass} ${props.id !== "" ? "" : ""}`}
        // onClick={() => setShow(false)}
      >
        {props.children}
      </div>
    </Container>
  );
};
MainContent.defaultProps ={subClass: 'sub-content'}
export default MainContent;
