import React from 'react'
import './Controles.scss'

function Controles({ handleClick, currentStep, steps, handleSendData, handleClose }) {
  const handleSendForm = () => {
    handleSendData()
    handleClose()
  }
  return (
    <div className='controles d-flex flex-row justify-content-between'>
        <button 
          onClick={()=>handleClick()}
          className={
            `controles__back btn btn-outline-primary rounded-pill shadow-sm fw-medium px-4
            ${currentStep === 1 ? "active" : ""}`}>
            Anterior
        </button>
        <button 
          onClick={currentStep === steps.length ? handleSendForm : ()=>handleClick("next")}
          className='controles__next btn btn-primary rounded-pill shadow-sm fw-medium px-4'>
            {currentStep === steps.length ? "Agregar indicador" : "Siguiente"}
        </button>
    </div>
  )
}

export default Controles