import React, { useEffect } from "react";
import { Chart } from "chart.js";

const CashSalesChart = () => {
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;

    document.querySelector("#cashSalesChart").remove();

    var x = document.createElement('canvas'); 
    x.setAttribute("id", "cashSalesChart")   
    document.getElementById("cashSalesChartContainer").appendChild(x);

    const cashSalesChart = document.getElementById("cashSalesChart").getContext("2d");

    new Chart(cashSalesChart, {
      type: "doughnut",
      data: {
        defaultFontFamily: "Poppins",
        datasets: [
          {
            data: [45, 55],
            borderWidth: 0,
            backgroundColor: ["#124d8c", "#136fd1"],
            hoverBackgroundColor: ["#0356ad", "#3d9afc"],
          },
        ],
        labels: ["cash", "Digital Money"],
      },
      options: {
        responsive: true,
        aspectRatio: 1.7,
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
  <div id="cashSalesChartContainer">
    <canvas id="cashSalesChart"></canvas>
  </div>
  );
};

export default CashSalesChart;
