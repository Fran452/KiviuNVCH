import React, { useState, useEffect } from 'react'
import "./PlanesAccion.scss"
import ModalPlanes from "../../components/ModalPlanes"

function PlanesAccion() {
  // const [ loading, setLoading ] = useState(false)
  const [areas, setAreas] = useState([]);
  const [modal, modalShow] = useState(false)
  const [ tareas, setTareas ] = useState([
    {
      "id": 0,
      "nombre": "Hacer front de la página",
      "prioridad": "1",
      "estado": "En proceso",
      "fechaInicio": "2024-07-20",
      "fechaFinal": "2024-07-27",
      "notas": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "responsable": "franciscolemacr@gmail.com",
      "equipo": "1"
    },
    {
      "id": 1,
      "nombre": "Hacer back de la página",
      "prioridad": "2",
      "estado": "Completada",
      "fechaInicio": "2024-07-20",
      "fechaFinal": "2024-07-27",
      "notas": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "responsable": "usuario1@gmail.com",
      "equipo": "2"
    },
    {
      "id": 3,
      "nombre": "Hacer API's de la página",
      "prioridad": "3",
      "estado": "En espera",
      "fechaInicio": "2024-07-20",
      "fechaFinal": "2024-07-27",
      "notas": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "responsable": "usuario2@gmail.com",
      "equipo": "3"
    }
  ])

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3030/",{
        method: "GET"
      })
      const data = await res.json()
      setAreas(data.objeto.areas)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
 
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
            {areas.map((e,i) => {
              return <button className="btn btn-primary rounded-pill me-2" key={i}>{e.nombre_del_Area}</button>
            })}
            <h3>
              {}
            </h3>
            <div className='planes__accion__tareas__tabla mb-4'>
              <table className="table table-striped align-middle table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Tareas</th>
                    <th scope="col">Inicio</th>
                    <th scope="col">Final</th>
                    <th scope="col">Notas</th>
                    <th scope="col">Responsable</th>
                    <th scope="col">Equipo de apoyo</th>
                    <th scope="col">Prioridad</th>
                    <th scope="col">Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className='table__tbody'>
                  {tareas.map((e,i) => {
                    return <tr key={i}>
                      <td className='table__tbody__nombre'>{e.nombre}</td>
                      <td className='table__tbody__fechaInicial'>{
                        (new Date(e.fechaInicio).toLocaleDateString("es-ES", { weekday: 'long' })).substring(0,3) + " " + new Date(e.fechaInicio).toLocaleDateString("es-ES", { day: 'numeric' })
                      }</td>
                      <td className='table__tbody__fechaFinal'>{new Date(e.fechaFinal).toLocaleDateString()}</td>
                      <td className='table__tbody__notas'>{e.notas}</td>
                      <td>{e.responsable}</td>
                      {e.equipo === "1" && <td className='table__tbody__equipo'>Finanzas</td>}
                      {e.equipo === "2" && <td className='table__tbody__equipo'>Recursos Humanos</td>}
                      {e.equipo === "3" && <td className='table__tbody__equipo'>Ventas</td>}
                      <td className='table__tbody__prioridad'>
                        {e.prioridad === "1" && <span className='table__tbody__prioridad--baja rounded-pill text-white badge'>baja</span>}
                        {e.prioridad === "2" && <span className='table__tbody__prioridad--media rounded-pill text-white badge'>media</span>}
                        {e.prioridad === "3" && <span className='table__tbody__prioridad--alta rounded-pill text-white badge'>alta</span>}
                        </td>
                      <td className='table__tbody__estado'>
                        {e.estado === "Pendiente" && <span className='table__tbody__estado--pendiente rounded-pill text-white badge'>Pendiente</span>}
                        {e.estado === "En proceso" && <span className='table__tbody__estado--proceso rounded-pill text-white badge'>En proceso</span>}
                        {e.estado === "Completada" && <span className='table__tbody__estado--completada rounded-pill text-white badge'>Completada</span>}
                        {e.estado === "En espera" && <span className='table__tbody__estado--espera rounded-pill text-white badge'>En espera</span>}
                        {e.estado === "Cancelada" && <span className='table__tbody__estado--cancelada rounded-pill text-white badge'>Cancelada</span>}
                        {e.estado === "Bloqueada" && <span className='table__tbody__estado--bloqueada rounded-pill text-white badge'>Bloqueada</span>}
                      </td>
                      <td className='table__tbody__buttons d-flex flex-row'>
                        <button className='btn bg-success rounded-circle text-white me-2'><i className="bi bi-pencil"></i></button>
                        <button className='btn bg-danger rounded-circle text-white'><i className="bi bi-trash3"></i></button>
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