import React, { useEffect, useContext } from "react";
import { Chart } from "chart.js";
import StateContext from "../../../context/stateContext";
import { _getTopTypes } from "../../../controllers/AxiosRequests";

const GenderChart = () => {
  const { isLogged, selectedProject } = useContext(StateContext);

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    if(!selectedProject || !selectedProject[0]) return;

    document.querySelector("#genderChart").remove();

    var x = document.createElement('canvas'); 
    x.setAttribute("id", "genderChart")   
    document.getElementById("genderChartContainer").appendChild(x);

    const genderChart = document.getElementById("genderChart").getContext("2d");
    _getTopTypes(isLogged, selectedProject[0].id, "gender").then((res) => {
      console.log(res.data);
    new Chart(genderChart, {
      type: "doughnut",
      data: {
        defaultFontFamily: "Poppins",
        datasets: [
          {
            data: res.data.percentage,
            borderWidth: 0,
            backgroundColor: ["#124d8c", "#136fd1"],
            hoverBackgroundColor: ["#0356ad", "#3d9afc"],
          },
        ],
        labels: res.data.countries,
      },
      options: {
        responsive: true,
        aspectRatio: 1.6,
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#c5c7de",
          },
        },
        caretSize: 6,
        borderColor: "rgba(220, 220, 220, 0.9)",
        borderWidth: 2,
        caretPadding: 5,
      },
    });
  })
    return () => {
      isMounted = false;
    };
  }, [selectedProject]);
  return (
  <div id="genderChartContainer">
    <canvas id="genderChart"></canvas>
  </div>
  );
};

export default GenderChart;
