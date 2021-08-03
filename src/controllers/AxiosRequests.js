import axios from "axios";
import { keys } from "../config/keys";

// CREATE REQUESTS
export const _signUpUser = (data) => {
    return axios
        .post(`${keys.SERVER_IP}signup/user`, data)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { error: e };
        });
};
export const _getTokenID = (loginData) => {
    return axios
        .post(`${keys.SERVER_IP}login/user`, loginData)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { error: "SSL ERROR!" };
        });
};
export const _forget = (loginData) => {
    return axios
        .post(`${keys.SERVER_IP}forget/user`, loginData)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { error: "SSL ERROR!" };
        });
};
export const _reset = (loginData) => {
    return axios
        .post(`${keys.SERVER_IP}reset/user`, loginData)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { error: "SSL ERROR!" };
        });
};
export const _createTicket = (data, token, projectID) => {
    console.log(projectID);
    return axios
        .post(`${keys.SERVER_IP}project/${projectID}/ticket/create`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};
export const _createProject = (data, token) => {
    return axios
        .post(`${keys.SERVER_IP}project/create`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        }).catch(e => {
            return { error: true, message: 'Something went wrong' }
        });
};

export const _uploadFile = (file, token, type) => {
    let formData = { for: type, base: file }
    return axios
        .post(`${keys.SERVER_IP}upload-img`, formData, {
            "Content-Type": "application/json",
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            console.log(res.data);
            let response = res.data.data.id;
            return response;
        }).catch(e => {
            return { error: true }
        });
};

export const _createItem = (data, token, projectID) => {
    return axios
        .post(`${keys.SERVER_IP}project/${projectID}/item/create`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};

export const _createPOS = (data, token, projectID) => {
    return axios
        .post(`${keys.SERVER_IP}project/${projectID}/pos/create`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};

export const _createOrder = (data, token, posID) => {
    return axios
        .post(`${keys.SERVER_IP}pos/${posID}/makeOrder`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};

export const _createOrderFromPreview = (data, token, posID) => {
    return axios
        .post(`${keys.SERVER_IP}pos/${posID}/createPosManagerOrder`, data)
        .then((res) => {
            return res.data;
        });
};

export const _createPosQR = (data) => {
    return axios
        .post(`${keys.SERVER_IP}pos/qr`, data)
        .then((res) => {
            return res.data;
        });
};

export const _checkQR = (data) => {
    return axios
        .post(`${keys.SERVER_IP}pos/checkQR`, data)
        .then((res) => {
            return res.data;
        });
};

//payment response 
//we use this api to delete the order if payment failed or add the payment to the order if success
export const _paymentResponse = (token, orderId, action) => {
    return axios
        .get(`${keys.SERVER_IP}order/${action}/${orderId}`, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};
// GET REQUESTS
export const _getUser = (token) => {
    return axios
        .get(`${keys.SERVER_IP}me`, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            if (e) {
                return { error: e };
            }
        });
};
export const _getUserProjects = (token) => {
    return axios
        .get(`${keys.SERVER_IP}my-projects`, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { success: false };
        });
};

export const _getChartWidget = (token) => {
    return axios
        .get(`http://malexs.net/d-event/ChartWidget.php`, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { success: false };
        });
};

export const _getCountries = (token) => {
    return axios
        .get(`${keys.SERVER_IP}countries`)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { success: false };
        });
};

export const _getProjectTypes = (token) => {
    return axios
        .get(`${keys.SERVER_IP}project-Types`)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { success: false };
        });
};

export const _getProjectCategories = (token) => {
    return axios
        .get(`${keys.SERVER_IP}project-categories`)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            return { success: false };
        });
};

export const _getProjectData = (id) => {
    return axios.get(`${keys.SERVER_IP}project/${id}`).then((res) => {
        return res.data;
    });
};

export const _getTickets = (id) => {
    return axios.get(`${keys.SERVER_IP}project/${id}/tickets/pro`).then((res) => {
        return res.data;
    });
};
export const _getPOSdata = (id, token) => {
    return axios.get(`${keys.SERVER_IP}project/${id}/pos`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}
export const _getPOS = (id, token) => {
    return axios.get(`${keys.SERVER_IP}pos/${id}`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}
export const _getTicketData = (id) => {
    return axios.get(`${keys.SERVER_IP}ticket/${id}`).then((res) => {
        return res.data;
    });
};

export const _getItems = (id) => {
    return axios.get(`${keys.SERVER_IP}project/${id}/items`).then((res) => {
        return res.data;
    });
};

export const _getItemData = (id) => {
    return axios.get(`${keys.SERVER_IP}item/${id}`).then((res) => {
        return res.data;
    });
}

export const _getUserData = (id) => {
    return axios.get(`${keys.SERVER_IP}pros/${id}`).then((res) => {
        return res.data;
    });
}


// EDIT REQUESTS
export const _editProject = (data, token, projectID) => {
    return axios
        .post(`${keys.SERVER_IP}project/edit/${projectID}`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};

// EDIT REQUESTS
export const _deleteProject = (token, projectID) => {
    return axios
        .get(`${keys.SERVER_IP}project/delete/${projectID}`, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};

export const _editTicket = (data, token, ticketID) => {
    return axios
        .post(`${keys.SERVER_IP}ticket/edit/${ticketID}`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};

export const _editItem = (data, token, itemID) => {
    return axios
        .post(`${keys.SERVER_IP}item/edit/${itemID}`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};

export const _editPOS = (data, token, posID) => {
    return axios
        .post(`${keys.SERVER_IP}pos/edit/${posID}`, data, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            return res.data;
        });
};

export const _editUser = (data, token) => {
    return axios.post(`${keys.SERVER_IP}edit/user`, data, {
        headers: {
            Authorization: token,
        },
    }).then(res => {
        return res.data
    })
}

// DELETE REQUESTS
export const _deleteItem = (itemID, token) => {
    return axios.get(`${keys.SERVER_IP}item/delete/${itemID}`, {
        headers: {
            Authorization: token
        }
    }).then((res) => {
        return res.data;
    });
};
export const _deleteTicket = (ticketID, token) => {
    return axios.get(`${keys.SERVER_IP}ticket/delete/${ticketID}`, {
        headers: {
            Authorization: token
        }
    }).then((res) => {
        return res.data;
    });
};
export const _deletePos = (posID, token) => {
    return axios.get(`${keys.SERVER_IP}pos/delete/${posID}`, {
        headers: {
            Authorization: token
        }
    }).then((res) => {
        return res.data;
    });
};

export const _getDashboardOrders = (id, token) => {
    return axios.get(`${keys.SERVER_IP}project/${id}/orders`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

export const _getRefundOrders = (id, token) => {
    return axios.get(`${keys.SERVER_IP}project/${id}/orders/refund`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

export const _getOrderDetails = (token, id) => {
    return axios.get(`${keys.SERVER_IP}order/${id}`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

export const _getRevenuOverview = (id, token) => {
    return axios.get(`${keys.SERVER_IP}project/${id}/revenu-overview`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

export const _getSalesPerTicktsChart = (token, id, period = 'week') => {
    return axios.get(`${keys.SERVER_IP}project/${id}/sales-per-ticket/${period}`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

export const _getTopTypes = (token, id, type) => {
    return axios.get(`${keys.SERVER_IP}project/${id}/sales-per-${type}`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

export const _getSalesPerPOSChart = (token, project, pos) => {
    return axios.get(`${keys.SERVER_IP}project/${project}/sales-per-pos/${pos}`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

// wallet Requests
export const _getWallet = (token) => {
    return axios.get(`${keys.SERVER_IP}wallet`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

export const _getBillingCenter = (token, project, year) => {
    return axios.get(`${keys.SERVER_IP}project/${project}/billing-center/${year}`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

// wallet Requests
export const _getWalletChart = (token) => {
    return axios.get(`${keys.SERVER_IP}wallet/chart`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

// wallet Requests
export const _withdraw = (token, amount) => {
    return axios.post(`${keys.SERVER_IP}wallet/withdraw`, { amount }, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

// wallet Requests
export const _sendMoney = (token, data) => {
    let type = data.qr ? "receive" : "send";
    return axios.post(`${keys.SERVER_IP}wallet/${type}`, data, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

// wallet Requests
export const _findUser = (token, email) => {
    return axios.post(`${keys.SERVER_IP}find/user`, { email }, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
}

// confirm refund Requests
export const _refundTicket = (token, _id) => {
    return axios.post(`${keys.SERVER_IP}ticket/confirm-refund`, { _id }, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        return res.data
    }).catch(e => {
        return { error: true }
    })
};