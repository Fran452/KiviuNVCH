import React, { useState, useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import { ProgressBar, Modal, Accordion } from 'react-bootstrap';
import "./PlanesAccion.scss"
import ModalPlanes from "../../components/ModalPlanes"
import { jwtDecode } from "jwt-decode"


export const loadingContext = React.createContext()

function PlanesAccion() {
  const [loading, setLoading] = useState(true)
  const [areas, setAreas] = useState([]);
  const [tareas, setTareas] = useState([])
  const [modal, modalShow] = useState(false)
  const [tareaObj, setTareaObj] = useState(null)
  const [modalDelete, setModalDelete] = useState(false)
  const [id, setId] = useState(null)
  const [proyectos, setProyectos] = useState([])

  const listProyectos = [
    {
      id_proyecto: 1,
      nombre: "Proyecto 1",
      descripcion: "Descripción del Proyecto 1",
      area_empleado: 4,
      id_area: 1,
      area: "Finanzas"
    },
    {
      id_proyecto: 2,
      nombre: "Proyecto 2",
      descripcion: "Descripción del Proyecto 2",
      area_empleado: 4,
      id_area: 1,
      area: "Finanzas"
    },
    {
      id_proyecto: 3,
      nombre: "Proyecto 3",
      descripcion: "Descripción del Proyecto 3",
      area_empleado: 4,
      id_area: 1,
      area: "Finanzas"
    },
    {
      id_proyecto: 1,
      nombre: "Proyecto 4",
      descripcion: "Descripción del Proyecto 4",
      area_empleado: 4,
      id_area: 2,
      area: "Recursos Humanos"
    },
    {
      id_proyecto: 2,
      nombre: "Proyecto 5",
      descripcion: "Descripción del Proyecto 5",
      area_empleado: 4,
      id_area: 2,
      area: "Recursos Humanos"
    },
    {
      id_proyecto: 3,
      nombre: "Proyecto 6",
      descripcion: "Descripción del Proyecto 6",
      area_empleado: 4,
      id_area: 3,
      area: "Ventas"
    }
  ]

  const newArr = Object.values(Object.groupBy(listProyectos, ({id_area}) => id_area))

  const fetchAreas = async () => {
    try {
      const res = await fetch("http://localhost:3030/apis/index",{
        method: "GET"
      })
      const data = await res.json()
      setAreas(data.objeto.areas)
    } catch (error) {
      console.log(error)
    }
  }

  const auth = localStorage.getItem("token")
  const jwtParse = jwtDecode(auth)
  
  useEffect(() => {
    const reqBody = {
      user: jwtParse.apirest.objeto
    }

    const fetchTareas = async () => {
      try {
        const res = await fetch("http://localhost:3030/apis/plan-accion", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(reqBody)
        })
        const data = await res.json()
        setTareas(data.objeto)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchProyectos = async () => {
      try {
        const res = await fetch("http://localhost:3030/apis/plan-accion/viewProyect", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(reqBody)
        })
        const data = await res.json()
        console.log(data)
      } catch (error) {
        
      }
    }
    
    fetchAreas()
    fetchTareas()
    fetchProyectos()
    setProyectos(newArr)
  }, [loading])
 
  const handleForm = (e) => {
    e.preventDefault()
    modalShow(true)
  }

  const handleUpdate = (value) => {
    setLoading(value)
  }

  const handleEditTask = (i) => {
    const obj = tareas.find((e) => e.id_tarea === i)
    setTareaObj(JSON.stringify(obj))
    modalShow(true)
  }

  const handleModalDelete = (i) => {
    setId(i)
    setModalDelete(true)
  }

  const handleDeleteTask = async () => {
    const obj = {
      idTarea: parseInt(id)
    }
    try {
      const res = await fetch("http://localhost:3030/apis/plan-accion/deleteTask", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
      })
      const data = await res.json()
      if(data.error !== 0){
        console.log(data.errorDetalle)
      } else {
        setModalDelete(false)
        setLoading(true)
      }
    } catch (error) {
      console.log(error)
    }    
  }

  return (
    <>
      <Modal className='modal__delete' show={modalDelete} onHide={() => setModalDelete(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title><h3>Eliminar tarea</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de eliminar esta tarea?</Modal.Body>
        <Modal.Footer>
          <button className='btn btn-secondary rounded-pill' onClick={() => setModalDelete(false)}>Cancelar</button>
          <button className='btn btn-danger rounded-pill' onClick={handleDeleteTask}>Borrar</button>
        </Modal.Footer>
      </Modal>
      <loadingContext.Provider value={{handleUpdate, tareaObj, setTareaObj}}>
        <ModalPlanes show={modal} onHide={()=>modalShow(false)} />
      </loadingContext.Provider>
      <div className='planes__accion section'>
        <div className='section__header d-flex flex-row align-items-end mb-4'>
          <i className='bi bi-bar-chart-steps me-2'></i>
          <h4 className='m-0'>Planes de Acción</h4>
        </div>
        <div className='d-flex flex-row'>
          <div className='planes__accion__menu'>
            <Accordion defaultActiveKey="0">
              {proyectos.map((e,i) => {
                return <Accordion.Item key={i} eventKey={i}>
                  <Accordion.Header >{e[0].area}</Accordion.Header>
                  <Accordion.Body className='d-flex flex-column align-items-start'>
                  {
                    e.map((a, index) => {
                      return <button className='btn' key={index}>{a.nombre}</button>
                    })
                  }
                  </Accordion.Body>
                </Accordion.Item>
              })}
            </Accordion>
          </div>
          {loading ? (
            <div className='loading__tareas d-flex flex-column align-items-center justify-content-center'>
              <Oval
                  visible={true}
                  height="80"
                  width="80"
                  color="#0d6efd"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
              />
              <p className='fw-medium'>Loading...</p>
            </div>
          ) : (
            <>
              {tareas.length > 0 ? (
                <div className='planes__accion__tareas d-flex flex-column'>
                  <div className='planes__accion__tareas__header d-flex flex-row justify-content-between align-items-center mb-4'>
                    <h3 className='m-0'>Proyectos<i className="bi bi-chevron-right mx-2"></i>Proyecto 1</h3>
                    <button className=' btn btn-primary rounded-pill' onClick={handleForm}>Agregar tarea</button>
                  </div>
                  <div className='planes__accion__tareas__main d-flex flex-column flex-md-row w-100'>
                    <div className='planes__accion__tareas__main__tabla'>
                      <table className="table table-striped align-middle">
                        <thead>
                          <tr>
                            <th scope="col">Tareas</th>
                            <th scope="col">Inicio</th>
                            <th scope="col">Final</th>
                            <th scope="col">Prioridad</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Progreso</th>
                            <th scope="col">Notas</th>
                            <th scope="col">Responsable</th>
                            <th scope="col">Equipo de apoyo</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody className='table__tbody'>
                          {tareas.map((e,i) => {
                            return <tr key={i}>
                              <td className='table__tbody__nombre'>{e.nombre}</td>
                              <td className='table__tbody__fechaInicial'>{new Date(e.fecha_inicio.replace(/-/g, '/')).toLocaleDateString()}</td>
                              <td className='table__tbody__fechaFinal'>{new Date(e.fecha_final.replace(/-/g, '/')).toLocaleDateString()}</td>
                              <td className='table__tbody__prioridad'>
                                {e.prioridad === 1 && <span className='table__tbody__prioridad--baja rounded-pill text-white badge'>baja</span>}
                                {e.prioridad === 2 && <span className='table__tbody__prioridad--media rounded-pill text-white badge'>media</span>}
                                {e.prioridad === 3 && <span className='table__tbody__prioridad--alta rounded-pill text-white badge'>alta</span>}
                                </td>
                              <td className='table__tbody__estado'>
                                {e.estado === 1 && <span className='table__tbody__estado--pendiente rounded-pill text-white badge'>Pendiente</span>}
                                {e.estado === 2 && <span className='table__tbody__estado--proceso rounded-pill text-white badge'>En proceso</span>}
                                {e.estado === 3 && <span className='table__tbody__estado--completada rounded-pill text-white badge'>Completada</span>}
                                {e.estado === 4 && <span className='table__tbody__estado--espera rounded-pill text-white badge'>En espera</span>}
                                {e.estado === 5 && <span className='table__tbody__estado--cancelada rounded-pill text-white badge'>Cancelada</span>}
                                {e.estado === 6 && <span className='table__tbody__estado--bloqueada rounded-pill text-white badge'>Bloqueada</span>}
                              </td>
                              <td className='table__tbody__progreso'>
                                <ProgressBar className='table__tbody__progreso__bar' now={e.progreso} label={`${e.progreso}%`} max={100}/>
                              </td>
                              <td className='table__tbody__notas'>{e.notas}</td>
                              <td className='table__tbody__notas'>{e.Empleados.mail}</td>
                              <td className='table__tbody__equipo'>{e.AreasApollo.nombre_del_Area}</td>
                              <td className='table__tbody__buttons d-flex flex-row'>
                                <button onClick={(() => handleEditTask(e.id_tarea))} className='btn bg-success rounded-circle text-white me-2'><i className="bi bi-pencil"></i></button>
                                <button onClick={(() => handleModalDelete(e.id_tarea))} className='btn bg-danger rounded-circle text-white'><i className="bi bi-trash3"></i></button>
                              </td>
                            </tr>
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                </div>
              ) : (
              <div className='planes__accion__tareas--empty rounded-3 d-flex flex-column align-items-center justify-content-center'>
                <h2 className='fw-semibold mb-1 text-center'>No tienes Planes de Acción aún.</h2>
                <p className='mb-4 text-center'>Para comenzar, crea tu primer proyecto:</p>
                <button 
                onClick={handleForm} 
                className='planes__accion__tareas--empty__btn btn rounded-pill shadow-sm fw-medium'>Agregar Proyecto
                </button>
              </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default PlanesAccion