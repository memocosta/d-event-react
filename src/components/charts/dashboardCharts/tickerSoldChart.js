import React, { useEffect } from "react";
import { Chart } from "chart.js";

const TicketSoldChart = () => {
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    document.querySelector("#ticketSoldChart").remove();

    var x = document.createElement('canvas'); 
    x.setAttribute("id", "ticketSoldChart")   
    document.getElementById("ticketSoldChartContainer").appendChild(x);

    const ticketSoldChart = document
      .getElementById("ticketSoldChart")
      .getContext("2d");

    new Chart(ticketSoldChart, {
      type: "doughnut",
      data: {
        defaultFontFamily: "Poppins",
        datasets: [
          {
            data: [45, 25, 20, 10, 35, 65],
            borderWidth: 0,
            backgroundColor: [
              "rgba(105, 27, 204, 1)",
              "rgba(105, 27, 204, .8)",
              "rgba(105, 27, 204, .7)",
              "rgba(105, 27, 204, .5)",
              "rgba(105, 27, 204, .4)",
              "rgba(105, 27, 204, .1)",
            ],
            hoverBackgroundColor: [
              "rgba(105, 27, 204, .6)",
              "rgba(105, 27, 204, .5)",
              "rgba(105, 27, 204, .4)",
              "rgba(105, 27, 204, .3)",
              "rgba(105, 27, 204, .2)",
              "rgba(105, 27, 204, .1)",
            ],
          },
        ],
        labels: [
          "Online Booking",
          "Book Store",
          "Booth Event",
          "Social Media",
          "Telemarketing",
          "Others",
        ],
      },
      options: {
        responsive: true,
        legend: false,
        caretSize: 6,
        cutoutPercentage: 75,
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
    <div id="ticketSoldChartContainer">
      <canvas id="ticketSoldChart"></canvas>
    </div>
  );
};

export default TicketSoldChart;
