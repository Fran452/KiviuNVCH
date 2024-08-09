import React, { useState } from 'react'
import ModalDatIn from '../../components/Modales/ModalDatIN/ModalDatIn'
import './DatIN.scss'

function DatIN() {
  const [ modalDatIN, setModalDatIN ] = useState(false)

  const handleNewIndicador = () => {
    setModalDatIN(true)
  }

  return (
    <>
      <ModalDatIn show={modalDatIN} onHide={()=>setModalDatIN(false)} />
      <div className='datin section'>
        <div className='section__header d-flex flex-row align-items-end mb-4'>
          <i className='bi bi-bar-chart-fill me-2'></i>
          <h4 className='m-0'>DatIN</h4>
        </div>
        <div className='datin--empty__main d-flex flex-column align-items-center justify-content-center rounded-3'>
          <h2 className='fw-semibold mb-1 text-center'>No tienes Indicadores para mostrar aún.</h2>
          <p className='mb-3 text-center'>Para comenzar, ingresa tu primer indicador:</p>
          <button className='btn__addIndicador btn btn-primary rounded-pill shadow-sm fw-medium' 
            onClick={handleNewIndicador}>
              Agregar indicador
          </button>
        </div>
      </div>
    </>
  )
}

export default DatIN