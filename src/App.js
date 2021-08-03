import React, { useState } from "react";
import "./breakPoints.css";
import "@fortawesome/fontawesome-free-solid";
import "semantic-ui-css/semantic.min.css";
import "react-circular-progressbar/dist/styles.css";
import "./App.css";
import StateContext from "./context/stateContext";
import Routes from "./routes/routes";
import SuccessModal from "./shared/successModal";
import SuccessTicketModal from "./shared/successTicketModal";
import EditModal from "./shared/editModal";
import OperationModal from "./components/POSopertaion/operationModal";
import PaymentMethodModal from "./components/POSopertaion/paymentMethodModal";
import PaymentSuccessModal from "./shared/paymentSuccessModal";
import RefundModal from "./shared/refundModal";
import UpdateSuccess from "./shared/updateSuccess";
import ToastAlert from "./shared/toastAlert";
import ConfirmDeleteModal from "./shared/confirmDeleteModal";

function App() {
    const [show, setShow] = useState(true);
    const [showModal, setShowModal] = useState("");
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState("");
    const [projects, setProjects] = useState([]);
    const [isLogged, setIsLogged] = useState("1");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedPos, setSelectedPos] = useState("");
    const [exchangeType, setExchangeType] = useState("euro");
    const [user, setUser] = useState("");
    const [toastAlert, setToastAlert] = useState({ show: false, title: '', message: '' });
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [totalPrice, setTotalPrice] = useState("");
    const [qrcode, setQrcode] = useState("");
    const [isqr, setIsqr] = useState(false);
    const [paymentType, setPaymentType] = useState("");
    const [refundMsg, setRefundMsg] = useState("");
    const [refundActionID, setRefundActionID] = useState(0);
    const [isRefundConfirmed, setIsRefundConfirmed] = useState(false);

    return (
        <StateContext.Provider
            value={{
                show,
                setShow,
                showModal,
                setShowModal,
                redirect,
                setRedirect,
                projects,
                setProjects,
                selectedProject,
                setSelectedProject,
                loading,
                setLoading,
                isLogged,
                setIsLogged,
                user,
                setUser,
                toastAlert,
                setToastAlert,
                selectedPos,
                setSelectedPos,
                exchangeType,
                setExchangeType,
                confirmDelete,
                setConfirmDelete,
                totalPrice,
                setTotalPrice,
                qrcode,
                setQrcode,
                isqr,
                setIsqr,
                paymentType,
                setPaymentType,
                refundMsg,
                setRefundMsg,
                refundActionID,
                setRefundActionID,
                isRefundConfirmed,
                setIsRefundConfirmed
            }}
        >
            <SuccessModal />
            <ConfirmDeleteModal />
            <SuccessTicketModal />
            <EditModal />
            <OperationModal />
            <PaymentMethodModal />
            <PaymentSuccessModal />
            <RefundModal />
            <UpdateSuccess />
            <div className={`App`} style={{ position: "relative" }}>
                <Routes />
                <ToastAlert />

            </div>
        </StateContext.Provider>
    );
}

export default App;
