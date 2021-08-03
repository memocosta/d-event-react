import React, { useEffect, useContext } from "react";
import { Chart } from "chart.js";
import StateContext from "../../../context/stateContext";
import { _getSalesPerPOSChart } from "../../../controllers/AxiosRequests";

const SalesPerPOSChart = ({pos}) => {
  const { isLogged, selectedProject } = useContext(StateContext);

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    document.querySelector("#salesPerPOS").remove();

    var x = document.createElement('canvas'); 
    x.setAttribute("id", "salesPerPOS")   
    document.getElementById("salesPerPOSContainer").appendChild(x);
    
    const salesPerPOS = document.querySelector("#salesPerPOS").getContext("2d");
    if(pos){

      _getSalesPerPOSChart(isLogged, selectedProject[0].id, pos).then(res =>{
        console.log(res.data);
        res.data.forEach(element => {
          element.sum = element.number_of_sales.reduce((a, b) => a + b, 0)
        });
        let items = res.data.sort((a,b) => (b.sum > a.sum) ? 1 : ((a.sum > b.sum) ? -1 : 0)).slice(0, 3).map((i, index) => {
          return {
            label: i.item_name,
            data: i.number_of_sales,
            backgroundColor: index === 0 ? ["#f0ae13"] : index === 1 ? ["#22d6cd"] : ["#b51d34"],
            barPercentage: 0.6,
            categoryPercentage: 0.3,
          }});
      new Chart(salesPerPOS, {
        type: "bar",
        data: {
          labels: ["Fri", "Sat", "Sun", "Mon"],
  
          datasets: items,
          // [
          //   {
          //     label: "Coca",
          //     data: [8, 19, 3, 5],
          //     backgroundColor: ["#f0ae13", "#f0ae13", "#f0ae13", "#f0ae13"],
          //     barPercentage: 0.6,
          //     categoryPercentage: 0.3,
          //   },
          //   {
          //     label: "Beer",
          //     data: [12, 22, 7, 2],
          //     backgroundColor: ["#22d6cd", "#22d6cd", "#22d6cd", "#22d6cd"],
          //     barPercentage: 0.6,
          //     categoryPercentage: 0.3,
          //   },
          //   {
          //     label: "Champagne",
          //     data: [11, 20, 13, 15],
          //     backgroundColor: ["#b51d34", "#b51d34", "#b51d34", "#b51d34"],
          //     barPercentage: 0.6,
          //     categoryPercentage: 0.3,
          //   },
          // ],
        },
        options: {
          legend: {
            display: true,
          },
          title: {
            display: true,
          },
          tooltips: {
            mode: "index",
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  fontColor: "#c5c7de",
                },
              },
            ],
            yAxes: [
              {
                stacked: false,
                ticks: {
                  beginAtZero: true,
                  fontColor: "#c5c7de",
                },
              },
            ],
          },
        },
      });
    })
    }else{
      new Chart(salesPerPOS, {
        type: "bar",
        data: {
          labels: ["Fri", "Sat", "Sun", "Mon"],
  
          datasets: [],
        },
        options: {
          legend: {
            display: true,
          },
          title: {
            display: true,
          },
          tooltips: {
            mode: "index",
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  fontColor: "#c5c7de",
                },
              },
            ],
            yAxes: [
              {
                stacked: false,
                ticks: {
                  beginAtZero: true,
                  fontColor: "#c5c7de",
                },
              },
            ],
          },
        },
      });
    }
    return () => {
      isMounted = false;
    };
  }, [pos, selectedProject]);
  return (
    <div id="salesPerPOSContainer">
      <canvas id="salesPerPOS"></canvas>
    </div>
  );
};

export default SalesPerPOSChart;
