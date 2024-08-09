import React, { useState } from 'react'
import { PasosContext } from '../../../context/PasosContext';
import { Modal } from 'react-bootstrap';
import Pasos from './Pasos';
import Controles from './Controles';
import './ModalDatIN.scss'

import DatosPrincipales from "./DatosPrincipales"
import IngresarLog from "./IngresarLog"
import Preview from './Preview'

function ModalDatIn(props) {
    const [currentStep, setCurrentStep] = useState(1)
    const [userData, setUserData] = useState({})
    const [logData, setLogData] = useState({})

    const steps = [
        "Datos principales",
        "Logs",
        "Preview"
    ]

    const displayStep = (step) => {
        switch(step) {
            case 1: 
                return <DatosPrincipales />
            case 2:
                return <IngresarLog />
            case 3:
                return <Preview />
            default:
        }
    }

    const handleClick = (dir) => {
        let newStep = currentStep
        dir === "next" ? newStep++ : newStep--
        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep)
    }

    const handleSendData = () => {
        setUserData({})
        setLogData({})
    }

    const handleClose = () => {
        props.onHide()
    }

    return (
    <>
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            className='modal__datin'
        >
            <Modal.Header className=''>
                <Modal.Title id="contained-modal-title-vcenter" className='d-flex flex-row justify-content-between'>
                    <p className='invisible'></p>
                    <button className='btn align-self-end' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PasosContext.Provider value={{ userData, setUserData, logData, setLogData }}>
                    {/* Vista de pasos */}
                    <Pasos 
                        steps={steps} 
                        currentStep={currentStep}
                    />
                    {/* Formularios */}
                    <div className='mb-4'>
                        {displayStep(currentStep)}
                    </div>
                    {/* Botones */}
                    <Controles 
                        handleClick={handleClick}
                        handleSendData={handleSendData}
                        handleClose={handleClose}
                        currentStep={currentStep}
                        steps={steps}
                    />
                </PasosContext.Provider>
            </Modal.Body>
        </Modal>
    </>
    )
}

export default ModalDatIn