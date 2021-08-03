import React from "react";
import { Loader } from "semantic-ui-react";

const LoadingScreen = () => {
  return (
    <div
      style={{
        backgroundColor: "#00092a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Loader active inline="centered" size="large" />
    </div>
  );
};

export default LoadingScreen;
