import React, { useContext, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import HomePage from "../pages/home";
import SideBar from "../components/sidebar/sidebar";
import { items } from "../components/sidebar/sidebarItems";
import ManageProject from "../pages/manageProject";
import EditPOS from "../pages/edit/editPOS";
import CreateTicket from "../pages/create/createTicket";
import AddItems from "../pages/create/createItem";
import CreateProject from "../pages/create/createProject";
import StateContext from "../context/stateContext";
import Login from "../pages/auth/login";
import SignUp from "../pages/auth/signup";
import Forget from "../pages/auth/forget";
import Reset from "../pages/auth/reset";
import EditProject from "../pages/edit/editProject";
import CreatePOS from "../pages/create/createPOS";
import LoadingScreen from "../shared/loadingScreen";
import Wallet from "../pages/wallet";
import EditTicket from "../pages/edit/editTicket";
import Taxes from "../pages/finance/taxes";
import BillingCenter from "../pages/finance/billingCenter";
import AccountSettings from "../pages/account/settings";
import { _isExist } from "../controllers/functions";
import { _getUserProjects } from "../controllers/AxiosRequests";
import EditItem from "../pages/edit/editItem";
import Revenue from "../pages/finance/revenue";
import Orders from "../pages/finance/orders"
import OrderDetails from "../pages/orderDetails";
import PosPreview from "../pages/pos_preview";
const Routes = () => {
    const {
        redirect,
        showModal,
        isLogged,
        setIsLogged,
        setProjects,
        setSelectedProject,
    } = useContext(StateContext);
    const [loading, setLoading] = useState(false);

    // CHECK IF IS EXIST ACCOUNT
    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        setLoading(true);
        _isExist().then((res) => {
            if (!res) {
                setLoading(false);
                setIsLogged("");
                return;
            }
            setLoading(false);
            setIsLogged(res.token);
        });

        return () => {
            isMounted = false;
        };
    }, [setIsLogged]);

    useEffect(() => {
        let isMounted = true;
        if (!isMounted || isLogged === "" || isLogged === "1") return;
        setLoading(true);
        _getUserProjects(isLogged).then((project) => {
            if (project.data.length === 0) {
                setProjects([]);
                setSelectedProject([]);
                setLoading(false);
                return;
            } else {
                console.log(project.data);
                setProjects(project.data);
                const sProject = JSON.parse(localStorage.getItem("selectedProject"));
                console.log('====================================');
                console.log(sProject);
                console.log('====================================');
                if (!sProject || sProject === "") {
                    setSelectedProject([project.data[0]]);
                } else {
                    setSelectedProject([sProject[0]]);
                }
                setLoading(false);
                return;
            }
        });
        return () => {
            isMounted = false;
        };
    }, [isLogged, setIsLogged, setProjects, setSelectedProject]);

    if (loading) {
        return <LoadingScreen />;
    }

    if ((isLogged !== "" && isLogged !== "1") || window.location.pathname.includes("pos-preview")) {
        return (
            <Router basename="/d-event/">
                {window.location.pathname.includes("auth") && <Redirect to="/" />}
                {!window.location.pathname.includes("pos-preview") && <SideBar items={items} />}
                <div className={`main-content  ${showModal ? "blur" : ""}`}>
                    {!window.location.pathname.includes("pos-preview") && <Navbar />}
                    <Switch>
                        <Route path="/createProject" component={CreateProject} />
                        <Route path="/wallet" component={Wallet} />
                        <Route
                            path="/manageProject"
                            render={({ match: { url } }) => (
                                <>
                                    <Route exact path={`${url}/`} component={ManageProject} />
                                    <Route
                                        path={`${url}/editProject/:id`}
                                        component={EditProject}
                                    />
                                    <Route
                                        path={`${url}/editTicket/:id`}
                                        component={EditTicket}
                                    />
                                    <Route
                                        path={`${url}/editItem/:id`}
                                        component={EditItem}
                                    />
                                </>
                            )}
                        />
                        <Route
                            path="/POS"
                            render={({ match: { url } }) => (
                                <>
                                    <Route path={`${url}/createPOS`} component={CreatePOS} />
                                    <Route path={`${url}/editPOS/:id/:orderId?/:response?`} component={EditPOS} />
                                    <Route path={`${url}/pos-preview/:id/:orderId?/:response?`} component={PosPreview} />
                                </>
                            )}
                        />

                        <Route
                            path="/account"
                            render={({ match: { url } }) => (
                                <>
                                    <Route path={`${url}/settings`} component={AccountSettings} />
                                </>
                            )}
                        />
                        <Route path="/createTicket" component={CreateTicket} />
                        <Route path="/addItems" component={AddItems} />
                        <Route
                            path="/finance"
                            render={({ match: { url } }) => (
                                <>
                                    {/* <Route exact path={`${url}/revenue`} component={Revenue} />
                  <Route exact path={`${url}/orders`} component={Orders} /> */}
                                    <Route path={`${url}/revenue`} component={Revenue} />
                                    <Route path={`${url}/orders`} component={Orders} />
                                    <Route path={`${url}/taxes`} component={Taxes} />
                                    <Route
                                        path={`${url}/billingCenter`}
                                        component={BillingCenter}
                                    />
                                </>
                            )}
                        />
                        <Route path={`/order-details/:id/:response?`} component={OrderDetails} />
                        <Route exact path="/" render={() => <HomePage />} />
                        <Route path="*" render={() => <h1>not found</h1>} />
                    </Switch>
                    {redirect !== "" && redirect !== "/" ? <Redirect to={`/${redirect}`} /> : redirect === "/" ? <Redirect to="/" /> : ""}
                </div>
            </Router>
        );
    }
    if (isLogged === "" && window.location.pathname.includes("reset")) {
        return (
            <Router basename="/d-event/">
                <Route exact path="/auth/reset/:id?" component={Reset} />
            </Router>
        );
    }
    return (
        <Router basename="/d-event/">
            {isLogged === "" && <Redirect to="/auth/login" />}
            <Route exact path="/auth/login" component={Login} />
            <Route path="/auth/signup" component={SignUp} />
            <Route path="/auth/forget" component={Forget} />
        </Router>
    );
};

export default Routes;
