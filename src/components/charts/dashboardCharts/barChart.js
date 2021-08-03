import React, { useEffect, useState } from "react";
import { Chart } from "chart.js";

const BarChart = (props) => {
  // const [dataSet, setdataSet] = useState(tickets)

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    console.log(props.tickets);
    document.getElementById("barChart").remove();
    
    var x = document.createElement('canvas'); 
    x.setAttribute("id", "barChart")            // Append the text to <p>
    document.getElementById("barChartContainer").appendChild(x);
    props.tickets.forEach(element => {
      element.sum = element.number_of_sales.reduce((a, b) => a + b, 0)
    });
    let tickets = props.tickets.sort((a,b) => (b.sum > a.sum) ? 1 : ((a.sum > b.sum) ? -1 : 0)).slice(0, 3).map((i, index) => {
    console.log(i);
      return {
        label: i.ticket_name,
        data: i.number_of_sales,
        backgroundColor:
          index === 0
            ? [
                "#6a1ccd",
                "#6a1ccd",
                "#6a1ccd",
                "#6a1ccd",
                "#6a1ccd",
                "#6a1ccd",
                "#6a1ccd",
              ]
            : index === 1
            ? [
                "#3d4465",
                "#3d4465",
                "#3d4465",
                "#3d4465",
                "#3d4465",
                "#3d4465",
                "#3d4465",
              ]
            : [
                "#28c76f",
                "#28c76f",
                "#28c76f",
                "#28c76f",
                "#28c76f",
                "#28c76f",
                "#28c76f",
              ],
        barPercentage: 0.6,
        categoryPercentage: 0.3,
      };
    });
    console.log(tickets);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var goBackDays = 7;

    var today = new Date();
    var daysSorted = [];

    for (var i = 0; i < goBackDays; i++) {
      var newDate = new Date(today.setDate(today.getDate() - 1));
      daysSorted.push(days[newDate.getDay()]);
    }

    var date = new Date();
var lastMonths = [],
    monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
for (var i = 0; i < 12; i++) {
    lastMonths.push(monthNames[date.getMonth()]);
    date.setMonth(date.getMonth() - 1);
}

console.log(lastMonths);
    var names = [];
    if(props.filter === 'week'){
      names = daysSorted
    }else if(props.filter === 'month'){
      names = ['week 1', 'week 2', 'week 3', 'week 4', 'week 5']
    }else {
      names = lastMonths
    }
    const barChart = document.querySelector("#barChart").getContext("2d");
    new Chart(barChart, {
      type: "bar",
      data: {
        // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        labels: names.reverse(),
        datasets: tickets,
        // [
        //   {
        //     label: "ticket #1",
        //     data: [8, 19, 3, 5, 2, 3, 12],
        //     backgroundColor: [
        //       "#6a1ccd",
        //       "#6a1ccd",
        //       "#6a1ccd",
        //       "#6a1ccd",
        //       "#6a1ccd",
        //       "#6a1ccd",
        //       "#6a1ccd",
        //     ],
        //     barPercentage: 0.6,
        //     categoryPercentage: 0.3,
        //   },
        //   {
        //     label: "ticket #2",
        //     data: [12, 19, 3, 5, 2, 3, 12],
        //     backgroundColor: [
        //       "#3d4465",
        //       "#3d4465",
        //       "#3d4465",
        //       "#3d4465",
        //       "#3d4465",
        //       "#3d4465",
        //       "#3d4465",
        //     ],
        //     barPercentage: 0.6,
        //     categoryPercentage: 0.3,
        //   },
        //   {
        //     label: "ticket #2",
        //     data: [12, 19, 3, 5, 2, 3, 12],
        //     backgroundColor: [
        //       "#28c76f",
        //       "#28c76f",
        //       "#28c76f",
        //       "#28c76f",
        //       "#28c76f",
        //       "#28c76f",
        //       "#28c76f",
        //     ],
        //     barPercentage: 0.6,
        //     categoryPercentage: 0.3,
        //   },
        // ],
      },
      options: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltips: {
          mode: "index",
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "#c5c7de",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "#c5c7de",
              },
            },
          ],
        },
      },
    });

    return () => {
      isMounted = false;
    };
  }, [props]);

  return (
    <div id="barChartContainer">
      <canvas id="barChart"></canvas>
    </div>
  );
};

export default BarChart;
