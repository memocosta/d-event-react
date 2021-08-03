import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Tab1 from "../../components/ordersComponent/tab1";
import Tab2 from "../../components/ordersComponent/tab2";
import StateContext from "../../context/stateContext";
import { _getDashboardOrders } from "../../controllers/AxiosRequests";
import CreateNewProject from "../../shared/createNewProject";
import LoadingScreen from "../../shared/loadingScreen";
import MainContent from "../../shared/mainContent";

const Orders = () => {
    const [tabs, setTabs] = useState("tab1");
    const { isLogged, selectedProject, setLoading, setToastAlert, loading } = useContext(StateContext);
    const history = useHistory();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        if (!selectedProject || !selectedProject[0]) { history.push('/'); return; }
        if (!isMounted || selectedProject.length === 0) {
            setLoading(false);
            return
        };
        setLoading(true);

        _getDashboardOrders(selectedProject[0].id, isLogged).then((res) => {
            setLoading(false);
            if (res.error) {
                setToastAlert({
                    show: true,
                    title: res.message,
                    message: "Something went wrong while Getting Project Orders",
                });
                return;
            }
            setOrders(res.data);
        });
        return () => {
            isMounted = false;
        };
    }, [selectedProject])

    if (loading) {
        return <LoadingScreen />;
    }
    if (selectedProject.length === 0) {
        return <CreateNewProject />
    }

    return (
        <MainContent id="orders">
            {tabs === "tab1" && (
                <Tab1
                    show={tabs === "tab1" ? true : false}
                    setShow={(value) => {
                        setTabs(value);
                    }}
                    orders={orders}
                />
            )}
            {tabs === "tab2" && (
                <Tab2
                    show={tabs === "tab2" ? true : false}
                    setShow={(value) => {
                        setTabs(value);
                    }}
                    orders={orders}
                />
            )}
        </MainContent>
    );
};

export default Orders;
