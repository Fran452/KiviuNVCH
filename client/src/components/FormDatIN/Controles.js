import React from 'react'
import './Controles.scss'

function Controles({ handleClick, currentStep, steps, handleSendData, setCurrentStep, setAddIndicador }) {

  const handleSendForm = () => {
    handleSendData()
    setCurrentStep(4)
  }

  const backListado = () => {
    setAddIndicador(false)
  }

  return (
    <>
      {currentStep < 4 ? (
        <div className='controles d-flex flex-column-reverse flex-md-row justify-content-between'>
          <button 
            onClick={currentStep === 1 ? ()=>backListado() : ()=>handleClick()}
            className='controles__back btn btn-outline-primary rounded-pill shadow-sm fw-medium px-4'>
              {currentStep === 1 ? "Regresar al listado" : "Anterior"}
          </button>
          <button 
            onClick={currentStep === steps.length-1 ? handleSendForm : ()=>handleClick("next")}
            className='controles__next btn btn-primary rounded-pill shadow-sm fw-medium px-4 mb-2 mb-md-0'>
              {currentStep === steps.length-1 ? "Agregar indicador" : "Siguiente"}
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Controles