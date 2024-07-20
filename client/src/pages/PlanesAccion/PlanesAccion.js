import React, { useState } from 'react'
import "./PlanesAccion.scss"
import ModalPlanes from "../../components/ModalPlanes"

function PlanesAccion() {
  // const [ loading, setLoading ] = useState(false)
  const [modal, modalShow] = useState(false)
  const [ tareas, setTareas ] = useState([
    // {
    //   "id": 0,
    //   "nombre": "Hacer front de la página",
    //   "prioridad": "1",
    //   "estado": "En proceso",
    //   "fechaInicio": "2024-07-20",
    //   "fechaFinal": "2024-07-27",
    //   "notas": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //   "responsable": "franciscolemacr@gmail.com",
    //   "equipo": "equipo 1"
    // },
    // {
    //   "id": 1,
    //   "nombre": "Hacer back de la página",
    //   "prioridad": "2",
    //   "estado": "Completada",
    //   "fechaInicio": "2024-07-20",
    //   "fechaFinal": "2024-07-27",
    //   "notas": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //   "responsable": "usuario1@gmail.com",
    //   "equipo": "equipo 1"
    // },
    // {
    //   "id": 3,
    //   "nombre": "Hacer API's de la página",
    //   "prioridad": "3",
    //   "estado": "En espera",
    //   "fechaInicio": "2024-07-20",
    //   "fechaFinal": "2024-07-27",
    //   "notas": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //   "responsable": "usuario2@gmail.com",
    //   "equipo": "equipo 1"
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
            <h3>Proyectos<i className="bi bi-chevron-right"></i>Proyecto 1</h3>
            <div className='planes__accion__tareas__tabla mb-4'>
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th scope="col">Tareas</th>
                    <th scope="col">Inicio</th>
                    <th scope="col">Final</th>
                    <th scope="col">Notas</th>
                    <th scope="col">Responsable</th>
                    <th scope="col">Equipo de apoyo</th>
                    <th scope="col">Prioridad</th>
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody className='table__tbody'>
                  {tareas.map((e,i) => {
                    return <tr key={i}>
                      <td><button className='btn bg-info rounded-pill text-white'>Editar</button></td>
                      <td><button className='btn bg-danger rounded-pill text-white'>Eliminar</button></td>
                      <td className='table__tbody__nombre'>{e.nombre}</td>
                      <td className='table__tbody__fechaInicial'>{e.fechaInicio}</td>
                      <td className='table__tbody__fechaFinal'>{e.fechaFinal}</td>
                      <td className='table__tbody__notas'>{e.notas}</td>
                      <td>{e.responsable}</td>
                      <td className='table__tbody__equipo'>{e.equipo}</td>
                      <td className='table__tbody__prioridad'>
                        {e.prioridad === "1" && <span className='table__tbody__prioridad--baja rounded-pill text-white'>baja</span>}
                        {e.prioridad === "2" && <span className='table__tbody__prioridad--media rounded-pill text-white'>media</span>}
                        {e.prioridad === "3" && <span className='table__tbody__prioridad--alta rounded-pill text-white'>alta</span>}
                        </td>
                      <td className='table__tbody__estado'>
                        {e.estado === "Pendiente" && <span className='table__tbody__estado--pendiente rounded-pill text-white'>Pendiente</span>}
                        {e.estado === "En proceso" && <span className='table__tbody__estado--proceso rounded-pill text-white'>En proceso</span>}
                        {e.estado === "Completada" && <span className='table__tbody__estado--completada rounded-pill text-white'>Completada</span>}
                        {e.estado === "En espera" && <span className='table__tbody__estado--espera rounded-pill text-white'>En espera</span>}
                        {e.estado === "Cancelada" && <span className='table__tbody__estado--cancelada rounded-pill text-white'>Cancelada</span>}
                        {e.estado === "Bloqueada" && <span className='table__tbody__estado--bloqueada rounded-pill text-white'>Bloqueada</span>}
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
            <button className='btn btn-primary'>Agregar tarea</button>
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