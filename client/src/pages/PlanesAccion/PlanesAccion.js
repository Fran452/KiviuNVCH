import React, { useState, useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import { ProgressBar, Modal, Accordion } from 'react-bootstrap';
import "./PlanesAccion.scss"
import ModalPlanes from "../../components/ModalPlanes"
import { jwtDecode } from "jwt-decode"
import ModalProyecto from '../../components/ModalProyecto';
import illustrationComingSoon from "../../assets/img/planes.png"


export const loadingContext = React.createContext()

function PlanesAccion() {
  const [loading, setLoading] = useState(true)
  const [areas, setAreas] = useState([]);
  const [tareas, setTareas] = useState([])
  const [modal, modalShow] = useState(false)
  const [tareaObj, setTareaObj] = useState(null)
  const [modalDelete, setModalDelete] = useState(false)
  const [idTask, setIdTask] = useState(null)
  const [proyectos, setProyectos] = useState([])
  const [idProyecto, setIdProyecto] = useState(null)
  const [modalProyecto, setModalProyecto] = useState(false)
  const [titleArea, setTitleArea] = useState(null)
  const [titleProyecto, setTitleProyecto] = useState(null)
  const [modalDeletePro, setModalDeletePro] = useState(false)
  const [proyectoObj, setProyectoObj] = useState(null)

  const auth = localStorage.getItem("token")
  const jwtParse = jwtDecode(auth)
  
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch("http://164.92.77.143:3030/apis/index",{
          method: "GET"
        })
        const data = await res.json()
        setAreas(data.objeto.areas)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchProyectos = async () => {
      try {
        const res = await fetch("http://164.92.77.143:3030/apis/plan-accion/viewProyect", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user: jwtParse.apirest.objeto
          })
        })
        const data = await res.json()
        setProyectos(data.objeto)
      } catch (error) {
        console.log(error)
      }
    }
    fetchAreas()
    fetchProyectos()
  }, [jwtParse.apirest.objeto, loading])
 
  const handleForm = (e) => {
    e.preventDefault()
    const pro = proyectos.find((e) => e.id_proyecto === idProyecto)
    setProyectoObj(JSON.stringify(pro))
    modalShow(true)
  }

  const handleFormProyecto = (e) => {
    e.preventDefault()
    setModalProyecto(true)
  }

  // Truco
  const handleUpdate = async () => {
    try {
      const res = await fetch("http://164.92.77.143:3030/apis/plan-accion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: jwtParse.apirest.objeto,
          idProyecto: idProyecto
        })
      })
      const data = await res.json()
      setTareas(data.objeto)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditTask = (i) => {
    const obj = tareas.find((e) => e.id_tarea === i)
    setTareaObj(JSON.stringify(obj))
    const pro = proyectos.find((e) => e.id_proyecto === idProyecto)
    setProyectoObj(JSON.stringify(pro))
    modalShow(true)
  }

  const handleModalDelete = (i) => {
    setIdTask(i)
    setModalDelete(true)
  }

  const handleDeleteTask = async () => {
    const obj = {
      idTarea: parseInt(idTask)
    }
    try {
      const res = await fetch("http://164.92.77.143:3030/apis/plan-accion/deleteTask", {
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
        handleUpdate()
      }
    } catch (error) {
      console.log(error)
    }    
  }

  // Proyectos
  const handleTareasByProyecto = async (i, titleArea, titleProyecto) => {
    setTitleArea(titleArea)
    setTitleProyecto(titleProyecto)
    setIdProyecto(i)
    try {
      const res = await fetch("http://164.92.77.143:3030/apis/plan-accion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: jwtParse.apirest.objeto,
          idProyecto: i
        })
      })
      const data = await res.json()
      setTareas(data.objeto)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditProyecto = () => {
    const obj = proyectos.find((e) => e.id_proyecto === idProyecto)
    setProyectoObj(JSON.stringify(obj))
    setModalProyecto(true)
  }

  const handleModalDeleteProyecto = () => {
    setModalDeletePro(true)
  }

  const handleDeleteProyecto = async () => {
    try {
      const res = await fetch("http://164.92.77.143:3030/apis/plan-accion/deleteProyect", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idProyecto: parseInt(idProyecto)
        })
      })
      const data = await res.json()
      if(data.error !== 0){
        console.log(data.errorDetalle)
      } else {
        setModalDeletePro(false)
        setIdProyecto(null)
      }
    } catch (error) {
      console.log(error)
    } 
  }

  return (
    <>
      {/* Proyectos */}
      <Modal className='modal__delete__proyecto' show={modalDeletePro} onHide={() => setModalDeletePro(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title><h3>Eliminar proyecto</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de eliminar este proyecto?</Modal.Body>
        <Modal.Footer>
          <button className='btn btn-secondary rounded-pill' onClick={() => setModalDeletePro(false)}>Cancelar</button>
          <button className='btn btn-danger rounded-pill' onClick={handleDeleteProyecto}>Borrar</button>
        </Modal.Footer>
      </Modal>
      {/* Tareas */}
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
      <loadingContext.Provider value={{handleUpdate, tareaObj, setTareaObj, proyectoObj, setProyectoObj, setTitleProyecto}}>
        <ModalProyecto show={modalProyecto} onHide={()=>setModalProyecto(false)} />
        <ModalPlanes show={modal} onHide={()=>modalShow(false)} />
      </loadingContext.Provider>
      <div className='planes__accion section'>
        <div className='section__header d-flex flex-row align-items-end mb-4'>
          <i className='bi bi-bar-chart-steps me-2'></i>
          <h4 className='m-0'>Planes de Acción</h4>
        </div>
        <div className='planes__accion__main d-flex flex-row'>
          <div className='planes__accion__menu d-flex flex-column align-items-start justify-content-between'>
            <Accordion className='w-100' defaultActiveKey="0">
              {areas.map((e,i) => {
                return e.id_area === jwtParse.apirest.objeto.area && <Accordion.Item key={i} eventKey={i}>
                  <Accordion.Header >{e.nombre_del_Area}</Accordion.Header>
                  <Accordion.Body className='d-flex flex-column align-items-start'>
                    {proyectos.map((a, index) => {
                      return a.fk_area === e.id_area && <button className='btn d-flex align-items-center' key={index} onClick={() => handleTareasByProyecto(a.id_proyecto, e.nombre_del_Area, a.nombre)}>
                        <i className="bi bi-chevron-right me-2 active"></i><span>{a.nombre}</span>
                      </button>
                    })}
                  </Accordion.Body>
                </Accordion.Item>
              })}
            </Accordion>
            <button 
              className='planes__accion__menu__btn btn btn-primary rounded-pill shadow-sm fw-medium'
              onClick={handleFormProyecto}
            >Agregar Proyecto</button>
          </div>
          {idProyecto ? (
            <>
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
                      <div className='d-flex flex-row flex-wrap align-items-center'>
                        <h3 className='m-0 me-2'>{titleArea}<i className="bi bi-chevron-right mx-2"></i>{titleProyecto}</h3>
                        <button className='btn__edit btn bg-success rounded-circle me-2 text-white' onClick={handleEditProyecto}><i className="bi bi-pencil"></i></button>
                        <button className='btn__delete btn bg-danger rounded-circle text-white' onClick={handleModalDeleteProyecto}><i className="bi bi-trash3"></i></button>
                      </div>
                      <button className='btn__addTarea btn btn-primary rounded-pill' onClick={handleForm}>Agregar tarea</button>
                    </div>
                    <div className='planes__accion__tareas__main d-flex flex-column flex-md-row w-100'>
                      <div className='planes__accion__tareas__main__tabla'>
                        <table className="table table-striped align-middle">
                          <thead>
                            <tr>
                              <th scope="col">Tareas</th>
                              <th scope="col">Prioridad</th>
                              <th scope="col">Estado</th>
                              <th scope="col">Progreso</th>
                              <th scope="col">Notas</th>
                              <th scope="col">Responsable</th>
                              <th scope="col">Equipo de apoyo</th>
                              <th scope="col">Inicio</th>
                              <th scope="col">Final</th>
                              <th scope="col"></th>
                            </tr>
                          </thead>
                          <tbody className='table__tbody'>
                            {tareas.map((e,i) => {
                              return <tr key={i}>
                                <td className='table__tbody__nombre'>{e.nombre}</td>
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
                                <td className='table__tbody__fechaInicial'>{new Date(e.fecha_inicio.replace(/-/g, '/')).toLocaleDateString()}</td>
                                <td className='table__tbody__fechaFinal'>{new Date(e.fecha_final.replace(/-/g, '/')).toLocaleDateString()}</td>
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
                  <div className='planes__accion__tareas--empty'>
                    <div className='planes__accion__tareas__header d-flex flex-row justify-content-between align-items-center mb-4'>
                      <div className='d-flex flex-row flex-wrap align-items-center'>
                        <h3 className='m-0 me-2'>{titleArea}<i className="bi bi-chevron-right mx-2"></i>{titleProyecto}</h3>
                        <button className='btn__edit btn bg-success rounded-circle me-2 text-white' onClick={handleEditProyecto}><i className="bi bi-pencil"></i></button>
                        <button className='btn__delete btn bg-danger rounded-circle text-white' onClick={handleModalDeleteProyecto}><i className="bi bi-trash3"></i></button>
                      </div>
                    </div>
                    <div className='planes__accion__tareas--empty__main d-flex flex-column align-items-center justify-content-center rounded-3'>
                      <h2 className='fw-semibold mb-1 text-center'>No tienes Planes de Acción aún.</h2>
                      <p className='mb-4 text-center'>Para comenzar, crea tu primera tarea:</p>
                      <button 
                      onClick={handleForm} 
                      className='planes__accion__tareas--empty__main__btn btn rounded-pill shadow-sm fw-medium'>Agregar Tarea
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            </>
          ) : (
            <div className='planes__accion__inicio d-flex flex-column align-items-center justify-content-center'>
              <img className='mb-4' src={illustrationComingSoon} alt="" />
              <h2 className='fw-semibold mb-2'>¡Bienvenido!</h2>
              <p className='text-center w-75'>Aquí encontrarás los proyectos por cada área. Cada proyecto cuenta con sus propias tareas, 
                aquellas que deberás realizar para alcanzar los objetivos establecidos.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PlanesAccion