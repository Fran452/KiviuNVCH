import React, { useState } from 'react'
import { PasosContext } from '../../context/PasosContext';
import { jwtDecode } from "jwt-decode"

import Pasos from './Pasos';
import Controles from './Controles';
import DatosPrincipales from "./DatosPrincipales"
import IngresarLog from "./IngresarLog"
import Preview from './Preview'
import Final from './Final';

import './FormDatIN.scss'

function FormDatIn({addIndicador, setAddIndicador, fetchIndicadores, setLoading, setError, setIndicadores}) {
    const [currentStep, setCurrentStep] = useState(1)
    const [userData, setUserData] = useState({
        area: "",
        indicador: "",
        descripcion: "",
        frecuencia: "",
        responsable: "",
        suplente: ""
    })
    const [logData, setLogData] = useState({
        log: ""
    })

    const [errorsDatos, setErrorsDatos] = useState({})
    const [errorsLog, setErrorsLog] = useState({})
    const [errorFetch, setErrorFetch] = useState(null)

    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)
    const USER = jwtParse.apirest.objeto

    const steps = [
        "Datos principales",
        "Logs",
        "Preview",
        "Final"
    ]

    const displayStep = (step) => {
        switch(step) {
            case 1: 
                return <DatosPrincipales />
            case 2:
                return <IngresarLog />
            case 3:
                return <Preview />
            case 4:
                return <Final />
            default:
        }
    }

    const validateFormDatos = (data) => {
        const errors = {}
    
        if(!data.area.trim()) {
            errors.area = "Escriba el nombre del Área o Proyecto."
        }
        if(!data.indicador.trim()) {
            errors.indicador = "Escriba un nombre para el indicador."
        }
        if(!data.descripcion.trim()) {
            errors.descripcion = "Escriba un texto para la descripcion."
        }
        if(!data.frecuencia.trim()) {
            errors.frecuencia = "Elija una frecuencia."
        }
        if(!data.responsable.trim()) {
            errors.responsable = "Escriba el mail."
        } else if (!/\S+@\S+\.\S+/.test(data.responsable)){
            errors.responsable = "El email no es válido."
        }
        if(!data.suplente.trim()) {
            errors.suplente = "Escriba el mail."
        } else if (!/\S+@\S+\.\S+/.test(data.suplente)){
            errors.suplente = "El email no es válido."
        }
        return errors;
    }

    const validateFormLog = (data) => {
        const errors = {}
        if(!data.log.trim()) {
            errors.log = "Escriba el log."
        }
        return errors;
    }

    const handleClick = (dir) => {
        let newStep = currentStep
        if (newStep === 1){
            const errorDatos = validateFormDatos(userData)
            setErrorsDatos(errorDatos)
            if (Object.keys(errorDatos).length === 0){
                dir === "next" ? newStep++ : newStep--
                newStep > 0 && newStep <= steps.length && setCurrentStep(newStep)
            } else {
                console.log("No se completó el formulario.")
            }
        } else if (newStep === 2) {
            const errorLog = validateFormLog(logData)
            setErrorsLog(errorLog)
            if(Object.keys(errorLog).length === 0){
                dir === "next" ? newStep++ : newStep--
                newStep > 0 && newStep <= steps.length && setCurrentStep(newStep)
            } else {
                console.log("No se completó el formulario.")
            }
        } else {
            dir === "next" ? newStep++ : newStep--
            newStep > 0 && newStep <= steps.length && setCurrentStep(newStep)
        }
        console.log(newStep)
    }

    const handleSendData = async () => {
        const obj = {
            user: USER,
            nombre_indicador: userData.indicador,
            detalles_metrica: userData.descripcion,
            tipo_recordartorio: parseInt(userData.frecuencia),
            responsable: userData.responsable,
            empleadoSuplente: userData.suplente,
        }
        console.log(obj)
        try {
            const res = await fetch("http://localhost:3030/apis/dateIn/newIndicador", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            const data = await res.json()
            if(data.error !== 0){
                setErrorFetch(data.errorDetalle)
            } else {
                setUserData({
                    area: "",
                    indicador: "",
                    descripcion: "",
                    frecuencia: "",
                    responsable: "",
                    suplente: ""
                })
                setLogData({
                    log: ""
                })
                console.log("Se ingresó el indicador")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <PasosContext.Provider value={{ userData, setUserData, logData, setLogData, setAddIndicador, setCurrentStep, errorsDatos, errorsLog, errorFetch, fetchIndicadores, setLoading, setError, setIndicadores }}>
                {/* Vista de pasos */}
                <Pasos 
                    steps={steps} 
                    currentStep={currentStep}
                />
                {/* Formularios */}
                <div className='formDatIn scroll--y'>
                    <div className='formDatIn__main mx-auto border border-light-subtle shadow-sm rounded-3 p-5'>
                        {displayStep(currentStep)}
                        {/* Botones */}
                        <Controles 
                            handleClick={handleClick}
                            handleSendData={handleSendData}
                            currentStep={currentStep}
                            setCurrentStep={setCurrentStep}
                            steps={steps}
                        />
                    </div>
                </div>
            </PasosContext.Provider>
        </>
    )
}

export default FormDatIn