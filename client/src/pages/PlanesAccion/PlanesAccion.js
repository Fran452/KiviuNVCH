import React, { useState } from 'react'
import "./PlanesAccion.scss"
import ModalPlanes from "../../components/ModalPlanes"

function PlanesAccion() {
  // const [ loading, setLoading ] = useState(false)
  const [modal, modalShow] = useState(false)
  const [ tareas, setTareas ] = useState([
    // {
    //   "id": 0,
    //   "nombre": "Hacer front de la pagina",
    //   "prioridad": "1",
    //   "estado": "En Proceso",
    //   "fecha": "26/06/2024",
    //   "fechaFin": "28/06/2024",
    //   "notas": "",
    //   "encargado": "Francisco Lema"
    // },
    // {
    //   "id": 1,
    //   "nombre": "Hacer back de la pagina",
    //   "prioridad": "1",
    //   "estado": "En Proceso",
    //   "fecha": "26/06/2024",
    //   "fechaFin": "28/06/2024",
    //   "notas": "",
    //   "encargado": "Francisco Lema"
    // },
    // {
    //   "id": 2,
    //   "nombre": "Hacer apis de la pagina",
    //   "prioridad": "1",
    //   "estado": "En Proceso",
    //   "fecha": "26/06/2024",
    //   "fechaFin": "28/06/2024",
    //   "notas": "",
    //   "encargado": "Francisco Lema"
    // }
  ])
 
  const handleForm = (e) => {
    e.preventDefault()
    modalShow(true)
    console.log("abrío form")
  }

  return (
    <>
      <ModalPlanes show={modal} onHide={()=>modalShow(false)}/>
      <div className='planes__accion section'>
        <div className='section__header d-flex flex-row align-items-end mb-4'>
          <i className='bi bi-bar-chart-steps me-2'></i>
          <h4 className='m-0'>Planes de Acción</h4>
        </div>
        {tareas.length > 0 ? (
          <div className='planes__accion__tareas'>
            <h2>Hay planes de acción</h2>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
            <p>texto</p>
          </div>
        ) : (
          <div className='planes__accion__tareas--empty rounded-3 d-flex flex-column align-items-center justify-content-center'>
            <h2 className='fw-semibold mb-1 text-center'>No tienes Planes de Acción aún.</h2>
            <p className='mb-4 text-center'>Para comenzar, crea tu primer proyecto:</p>
            <button 
              onClick={handleForm} 
              className='planes__accion__tareas--empty__btn btn rounded-pill shadow-sm fw-medium'>Agregar Proyecto</button>
          </div>
        )}
      </div>
    </>
  )
}

export default PlanesAccion