import React, { useContext, useEffect } from "react";
import { Chart } from "chart.js";
import StateContext from "../../../context/stateContext";
import { _getTopTypes } from "../../../controllers/AxiosRequests";

const SalesPerItem = () => {
  const { isLogged, selectedProject } = useContext(StateContext);

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    document.querySelector("#salesPerItems").remove();

    var x = document.createElement('canvas'); 
    x.setAttribute("id", "salesPerItems")   
    document.getElementById("salesPerItemsContainer").appendChild(x);

    const salesPerItems = document.getElementById("salesPerItems").getContext("2d");
    _getTopTypes(isLogged, selectedProject[0].id, "item").then((res) => {
      console.log(res.data);
      let colors = [];
      res.data.item_names.forEach(element => {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          colors.push(color);
      });
    new Chart(salesPerItems, {
      type: "doughnut",
      data: {
        defaultFontFamily: "Poppins",
        datasets: [
          {
            data: res.data.percentage.slice(0, 10),
            borderWidth: 0,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
          },
        ],
        labels: res.data.item_names.slice(0, 10),
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
        caretSize: 1,
        cutoutPercentage: 70,
        borderColor: "rgba(220, 220, 220, 0.9)",
        borderWidth: 1,
        caretPadding: 1,
      },
    });
  })
    return () => {
      isMounted = false;
    };
  }, [selectedProject, isLogged]);
  return (
  <div id="salesPerItemsContainer">
    <canvas id="salesPerItems"></canvas>
  </div>
  );
};

export default SalesPerItem;
