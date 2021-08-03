import React, { useEffect, useContext } from "react";
import { Chart } from "chart.js";
import StateContext from "../../../context/stateContext";
import { _getTopTypes } from "../../../controllers/AxiosRequests";

const TopCOuntriesChart = () => {
  const { isLogged, selectedProject } = useContext(StateContext);
  // const [items, setItems] = useState([]);
  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    document.querySelector("#topCountriesChart").remove();

    var x = document.createElement('canvas'); 
    x.setAttribute("id", "topCountriesChart")   
    document.getElementById("topCountriesChartContainer").appendChild(x);

    const topCountriesChart = document.getElementById("topCountriesChart").getContext("2d");
    _getTopTypes(isLogged, selectedProject[0].id, "country").then((res) => {
      console.log(res.data);
      // setItems(res.data);
      new Chart(topCountriesChart, {
        type: "doughnut",
        data: {
          defaultFontFamily: "Poppins",
          datasets: [
            {
              data: res.data.percentage,
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
          labels: res.data.countries,
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
    });
    return () => {
      isMounted = false;
    };
  }, [selectedProject]);
  return (
  <div id="topCountriesChartContainer">
    <canvas id="topCountriesChart"></canvas>
  </div>
  );
};

export default TopCOuntriesChart;
