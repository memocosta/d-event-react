import React, { useEffect } from "react";
import { Chart } from "chart.js";

const TotalRevenueChart = (props) => {
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    if (!props.data || props.data === null) return;
    const totalRevenueChart = document
      .getElementById("totalRevenueChart")
      .getContext("2d");

    new Chart(totalRevenueChart, {
      type: "doughnut",

      data: {
        defaultFontFamily: "Poppins",

        datasets: [
          {
            data: props.data.percentage,
            borderWidth: 0,
            backgroundColor: ["#124d8c", "#136fd1", "#ffc003"],
            hoverBackgroundColor: ["#0356ad", "#3d9afc", "#d6a102"],
          },
        ],
        labels: props.data.labels,
      },
      options: {
        responsive: true,
        aspectRatio: 5,
        legend: {
          display: true,
          position: "right",
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
  }, [props]);
  return <canvas id="totalRevenueChart"></canvas>;
};

export default TotalRevenueChart;
