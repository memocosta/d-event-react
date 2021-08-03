import React from 'react'
import { Transition, Icon } from 'semantic-ui-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import StateContext from '../context/stateContext';

const ToastAlert = () => {
    const { toastAlert } = useContext(StateContext)
    const [visible, setVisible] = useState(false)
    const [titles, setTitles] = useState({ title: '', message: '' })

    useEffect(() => {
        let isMounted = true
        if (!isMounted) return
        if (toastAlert.show) {
            setVisible(true)
            setTitles({ title: toastAlert.title, message: toastAlert.message })
            setTimeout(() => {
                setVisible(false)
                setTitles({ title: '', message: '' })
            }, 3000)
        } else {
            setVisible(false)
            setTitles({ title: '', message: '' })
        }
        return () => {
            isMounted = false
        }
    }, [toastAlert])
    return (
        <Transition duration='500' visible={visible} animation='drop'>
            <div style={{ position: 'relative', zIndex: 99999999999999 }}>
                <div className='toast-container error'>
                    <div className='toast-icon'>
                        <Icon name='times' size='huge' />
                    </div>
                    <div className='toast-message'>
                        <h4>{titles.title}</h4>
                        <p>{titles.message}</p>
                    </div>
                </div>
            </div>

        </Transition>
    );
}

export default ToastAlert;