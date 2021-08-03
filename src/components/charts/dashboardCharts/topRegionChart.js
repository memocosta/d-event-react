import React, { useEffect } from "react";
import { Chart } from "chart.js";

const TopRegionsChart = () => {
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    document.querySelector("#topRegionsChart").remove();

    var x = document.createElement('canvas'); 
    x.setAttribute("id", "topRegionsChart")   
    document.getElementById("topRegionsChartContainer").appendChild(x);

    const topRegionsChart = document
      .getElementById("topRegionsChart")
      .getContext("2d");

    new Chart(topRegionsChart, {
      type: "doughnut",
      data: {
        defaultFontFamily: "Poppins",
        datasets: [
          {
            data: [10, 13, 23, 45, 18],
            borderWidth: 0,
            backgroundColor: [
              "#f7ce48",
              "#c70e0e",
              "#0e90c7",
              "#7fcef0",
              "#d27ff0",
            ],
            hoverBackgroundColor: [
              "#c29a19",
              "#d40b0b",
              "#0ea4e3",
              "#609bb5",
              "#ae69c7",
            ],
          },
        ],
        labels: ["Belgium", "Germany", "USA", "France", "Poland"],
      },
      options: {
        responsive: true,
        aspectRatio: 1.5,
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

    return () => {
      isMounted = false;
    };
  }, []);
  return (
  <div id="topRegionsChartContainer">
    <canvas id="topRegionsChart"></canvas>
  </div>
  );
};

export default TopRegionsChart;
