import React, { useEffect, useContext, useState } from "react";
import { Grid } from "semantic-ui-react";
import StateContext from "../../../context/stateContext";
import { _newChart } from "../../../controllers/functions";
import ChartShared from "../../../shared/chartShared";
import { _getRevenuOverview, _getChartWidget } from "../../../controllers/AxiosRequests";

const Widgets = () => {
    const {
        selectedProject,
        isLogged,
        setToastAlert,
        setSelectedProject,
    } = useContext(StateContext);

    const [state, setState] = useState({
        total: 0,
        onsite: 0,
        online: 0,
        total_precent: 0,
        onsite_precent: 0,
        online_precent: 0,
        total_up: false,
        onsite_up: false,
        online_up: false,
    });

    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        if (!selectedProject || !selectedProject[0]) return;
        document.querySelector("#chartWidget1").remove();
        document.querySelector("#chartWidget2").remove();
        document.querySelector("#chartWidget3").remove();

        var x = document.createElement('canvas');
        x.setAttribute("id", "chartWidget1")
        document.getElementById("chartWidget1Container").appendChild(x);

        var y = document.createElement('canvas');
        y.setAttribute("id", "chartWidget2")
        document.getElementById("chartWidget2Container").appendChild(y);

        var z = document.createElement('canvas');
        z.setAttribute("id", "chartWidget3")
        document.getElementById("chartWidget3Container").appendChild(z);

        let chartWidget1 = {
            chartCanvas: document.querySelector("#chartWidget1").getContext("2d"),
            data: [],
        };

        let chartWidget2 = {
            chartCanvas: document.querySelector("#chartWidget2").getContext("2d"),
            data: [],
        };

        let chartWidget3 = {
            chartCanvas: document.querySelector("#chartWidget3").getContext("2d"),
            data: [],
        };

        let chartWidgets = [chartWidget1, chartWidget2, chartWidget3];
        _newChart(chartWidgets);

        let canv = document.querySelector("#chartWidget1");
        let ctx = canv.getContext("2d");
        ctx.clearRect(0, 0, canv.width, canv.height);

        _getRevenuOverview(selectedProject[0].id, isLogged).then((res) => {
            if (res.error) {
                setToastAlert({
                    show: true,
                    title: res.message,
                    message: "Something went wrong while Getting Project Revenu",
                });
                return;
            }
            chartWidget1.data = res.data.chartWidget1_data;
            chartWidget2.data = res.data.chartWidget2_data;
            chartWidget3.data = res.data.chartWidget3_data;
            _newChart(chartWidgets);
            setState({ ...state, ...res.data });
        });

        return () => {
            isMounted = false;
        };
    }, [setSelectedProject, selectedProject]);

    return (
        <Grid stackable>
            <Grid.Row columns="3">
                <Grid.Column>
                    <ChartShared
                        title="Online Sales"
                        subTitle="Sales of this Month"
                        earnings={state.online}
                        background="primary"
                        percentage={Number(state.online_precent).toFixed(2)}
                        status={state.online_up ? "up" : "down"}
                    >
                        <div id="chartWidget1Container">
                            <canvas id="chartWidget1" style={{ padding: '5px' }}></canvas>
                        </div>
                    </ChartShared>
                </Grid.Column>
                <Grid.Column>
                    <ChartShared
                        title="On site sales"
                        subTitle="Sales of this month"
                        earnings={state.onsite}
                        background="success"
                        percentage={Number(state.onsite_precent).toFixed(2)}
                        status={state.onsite_up ? "up" : "down"}
                    >
                        <div id="chartWidget2Container">
                            <canvas id="chartWidget2" style={{ padding: '5px' }}></canvas>
                        </div>

                    </ChartShared>
                </Grid.Column>
                <Grid.Column>
                    <ChartShared
                        title="Total Revenue"
                        subTitle="Sales of this month"
                        earnings={state.total}
                        background="info"
                        percentage={Number(state.total_precent).toFixed(2)}
                        status={state.total_up ? "up" : "down"}
                    >
                        <div id="chartWidget3Container">
                            <canvas id="chartWidget3" style={{ padding: '5px' }}></canvas>
                        </div>

                    </ChartShared>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default Widgets;
