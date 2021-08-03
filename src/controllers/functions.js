import { Chart } from "chart.js";
import jwt_decode from "jwt-decode";
import { _getTokenID, _uploadFile } from "./AxiosRequests";

export const _newChart = (chartsData) => {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var today = new Date();
    var d;
    var monthLabels = [];

    for (var i = 5; i >= 0; i -= 1) {
        d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        monthLabels.push(monthNames[d.getMonth()]);
    }

    console.log(monthLabels)

    chartsData.map((chart) => {
        new Chart(chart.chartCanvas, {
            type: "line",
            data: {
                labels: monthLabels,
                datasets: [{
                    label: "Sales Stats",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 1)",
                    borderWidth: 2,
                    data: chart.data,
                }, ],
            },
            options: {
                title: {
                    display: !1,
                },
                tooltips: {
                    intersect: !1,
                    mode: "nearest",
                    xPadding: 5,
                    yPadding: 5,
                    caretPadding: 5,
                },
                legend: {
                    display: !1,
                },
                responsive: !0,
                maintainAspectRatio: !1,
                hover: {
                    mode: "index",
                },
                scales: {
                    xAxes: [{
                        display: !1,
                        gridLines: !1,
                        scaleLabel: {
                            display: !0,
                            labelString: "Month",
                        },
                        ticks: {
                            max: 30,
                            min: 0,
                        },
                    }, ],
                    yAxes: [{
                        display: !1,
                        gridLines: !1,
                        scaleLabel: {
                            display: !0,
                            labelString: "Value",
                        },
                        ticks: {
                            beginAtZero: !0,
                        },
                    }, ],
                },
                elements: {
                    line: {
                        // tension: 0
                    },
                    point: {
                        radius: 0,
                        borderWidth: 1,
                    },
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    },
                },
            },
        });
        return false;
    });
    return false;
};

export const _storeToken = async(token) => {
    localStorage.setItem("loginData", JSON.stringify(token.token));
    console.log('====================================');
    console.log(token.token);
    console.log('====================================');
    return { success: token.token };
};

export const _isExist = async() => {
    const isLoginData = await localStorage.getItem("loginData")
    console.log('====================================');
    console.log(isLoginData);
    console.log('====================================');
    if (isLoginData && isLoginData !== undefined && isLoginData !== "undefined" && isLoginData !== "" && isLoginData !== 1) {
        const json = (await JSON.parse(localStorage.getItem("loginData")));
        console.log(json);
        if (json) {
            const decode = await jwt_decode(json.token);
            const now = new Date().getTime() / 1000;
            if (now > decode.exp) {
                return _getTokenID({ email: decode.email, password: decode.password }).then((res) => {
                    localStorage.setItem("loginData", JSON.stringify(res.data));
                    return { token: res.data.token };
                });
            } else {
                return { token: json.token };
            }
        } else {
            return false;
        }
    } else {
        return false;
    }

};

export const _validateForm = (data, type) => {
    switch (type) {
        case 'project':
            if (data.name === '' || data.projectType === '' || data.category === '' || data.address.number === '' || data.address.street === '' || data.contactInfo === '') {
                return false
            }
            return true
        case 'ticket':
            if (data.name === '' || (data.price === 0 && data.kind != "free")) {
                return false
            }
            return true
        case 'item':
            if (data.name === '' || data.price === 0) {
                return false
            }
            return true
        case 'pos':
            if (data.name === '' || data.pin_code === '') {
                return false
            }
            return true
        default:
            break;
    }
}

export const _isSelectedProject = async(project_id) => {
    let selProject = (await JSON.parse(localStorage.getItem("selectedProject")));
    console.log(project_id, 'gggggggg', selProject[0].id);
    if (project_id == selProject[0].id) {
        console.log('ffgghh');
        return true;
    }
    console.log('bbvvzz');
    return false;
};