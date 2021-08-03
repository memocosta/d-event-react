import React, { useEffect } from "react";
import { Chart } from "chart.js";

const EmailCampaignChart = () => {
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;

    document.querySelector("#emailCampaign").remove();

    var x = document.createElement('canvas'); 
    x.setAttribute("id", "emailCampaign")   
    document.getElementById("emailCampaignContainer").appendChild(x);

    const emailCampaignID = document
      .getElementById("emailCampaign")
      .getContext("2d");
    emailCampaignID.height = 100;

    let barChartData = {
      defaultFontFamily: "Poppins",
      labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Send Emails",
          backgroundColor: "rgba(105, 27, 204, 1)",
          hoverBackgroundColor: "rgba(105, 27, 204, 1)",
          data: ["30", "35", "40", "45", "50", "55", "60"],
        },
        {
          label: "Clicks",
          backgroundColor: "rgba(105, 27, 204, 0.2)",
          hoverBackgroundColor: "rgba(105, 27, 204, 0.2)",
          data: ["25", "30", "35", "40", "45", "50", "55"],
        },
      ],
    };

    new Chart(emailCampaignID, {
      type: "bar",
      data: barChartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltips: {
          display: false,
          mode: "index",
          intersect: false,
        },
        // responsive: true,
        scales: {
          xAxes: [
            {
              display: !1,
              gridLines: !1,
              // stacked: true,
            },
          ],
          yAxes: [
            {
              display: !1,
              gridLines: !1,
              // stacked: true
            },
          ],
        },
      },
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div id="emailCampaignContainer">
      <canvas id="emailCampaign"></canvas>
    </div>
  );
};

export default EmailCampaignChart;
