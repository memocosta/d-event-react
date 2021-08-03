import React, { useContext, useEffect, useState } from 'react'
import { Grid, Icon, Image, Modal } from 'semantic-ui-react';
import { useHistory } from "react-router-dom";
import StateContext from '../../context/stateContext';
import { _checkQR } from "../../controllers/AxiosRequests";
import QRCode from 'qrcode.react';

const PaymentMethodModal = (match) => {
    const {
        showModal,
        setShowModal,
        paymentType,
        setPaymentType,
        exchangeType,
        setExchangeType,
        totalPrice,
        setTotalPrice,
        qrcode,
        setQrcode,
        isqr,
        setIsqr
    } = useContext(StateContext);

    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        if (isqr) {
            const interval = setInterval(() => {
                let reqObj = { qr: qrcode }
                _checkQR(reqObj).then((res) => {
                    console.log(res);
                    console.log("========================");
                    if (res.status === "error") {
                        clearInterval(interval);
                        setPaymentType('qr');
                        setShowModal('paymentConfirmed');
                        setOpen(false);
                        setIsqr(false);
                    }
                });
            }, 1000);
        }
        let isMounted = true;
        if (!isMounted || showModal === "") return;
        if (showModal === "payment") {
            setOpen(true)
        } else {
            setOpen(false)
        }
        return () => {
            isMounted = false;
        };
    }, [showModal]);

    const handleOnPaymentClick = (type) => {
        setPaymentType(type)
        setShowModal('paymentConfirmed')
        setOpen(false)
    }
    
    return (
        <Modal
            id="paymentMethodPOS"
            dimmer={"blurring"}
            open={open}
            onClose={() => {
                setShowModal("");
                setOpen(false);
            }}
        >
            <Modal.Content>
                <div className="paymentMethod">
                    <div className="paymentMethod-total">
                        <h2>TOTAL TO PAY</h2>
                        <p>{totalPrice}</p>
                        <p>{exchangeType}</p>
                    </div>
                    <div className="paymentMethod-types">
                        <Grid textAlign="center">
                            <Grid.Row columns="3">
                                <Grid.Column
                                    id="qrCode"
                                    className={`${paymentType === "qrCode" ? "active" : ""}`}
                                >
                                    <div className={`paymentMethodTypes-title`}>
                                        <p>QR CODE</p>
                                    </div>
                                    <div className="paymentMethodTypes-img">
                                        <QRCode
                                            id="qrCodeEl"
                                            size={100}
                                            value={qrcode}
                                        />
                                    </div>
                                </Grid.Column>
                                <Grid.Column
                                    id="nfc"
                                    className={`${paymentType === "nfc" ? "active" : ""}`}
                                >
                                    <div className={`paymentMethodTypes-title`}>
                                        <p>NFC</p>
                                    </div>
                                    <div className="paymentMethodTypes-img">
                                        <Image src="/images/nfc.png" />
                                    </div>
                                </Grid.Column>
                                <Grid.Column
                                    id="cash"
                                    className={`${paymentType === "cashCol" ? "active" : ""}`}
                                    onClick={() => handleOnPaymentClick("cashCol")}
                                >
                                    <div className={`paymentMethodTypes-title`}>
                                        <p>CASH COLLECTION</p>
                                    </div>
                                    <div className="paymentMethodTypes-img">
                                        <Icon name="money" size="massive" />
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                    <div className="paymentMethodTypes-selection">
                        <p>SELECT PAYMENT METHOD</p>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    );
}

export default PaymentMethodModal;