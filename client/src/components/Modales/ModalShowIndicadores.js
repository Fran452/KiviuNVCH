import React, { useContext } from 'react'
import { DataInContext } from '../../context/DataInContext'
import { Modal } from 'react-bootstrap';
import Avatar from '../../assets/img/avatar-2.png'

function ModalShowIndicadores(props) {
    const { arrTresMetricas } = useContext(DataInContext)
    const handleClose = () => {
        props.onHide()
    }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter" className='d-flex flex-row'>
            <h3 className='m-0'>Información del indicador</h3>
            <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {arrTresMetricas.map((e, i) => {
            return <div key={i} className='preview__logs__lista__log shadow-sm rounded-3 border border-light'>
                <div className='d-flex flex-row align-items-center'>
                    <img className='me-1' src={Avatar} alt="" />
                    <p className='mb-0'>{e.Empleados.nombre}</p>
                </div>
                <p className='d-flex flex-row mb-0'><i className='bi bi-bar-chart-fill me-2'></i>{e.dato_metrica}</p>
                <div className='d-flex flex-row'>
                    <p className='me-2 d-flex flex-row mb-0'><i className="bi bi-calendar-event me-1"></i>
                    {new Date(e.fecha_Metrica).getDate() + "-" + (new Date(e.fecha_Metrica).getMonth()+1) + "-" + new Date(e.fecha_Metrica).getFullYear()}
                    </p>
                    <p className='d-flex flex-row mb-0'><i className="bi bi-clock me-1"></i>
                    {new Date(e.fecha_Metrica).getHours() + "-" + new Date(e.fecha_Metrica).getMinutes() + "-" + new Date(e.fecha_Metrica).getSeconds()}
                    </p>
                </div>
            </div>
          })}
        </Modal.Body>
    </Modal>    
  )
}

export default ModalShowIndicadores