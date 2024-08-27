import React, { useContext, useEffect, useState } from 'react'
import { ProgressBar, Modal, OverlayTrigger } from 'react-bootstrap';
import { Oval } from 'react-loader-spinner'
import illustrationPlanes from "../assets/img/planes.png"
import IllustrationAccess from "../assets/img/access.png"
import "./Tareas.scss"
import ModalEditProyecto from './Modales/ModalEditProyecto';
import ModalPlanes from './Modales/ModalPlanes';
// import { newContext } from '../pages/PlanesAccion/PlanesAccion'
import { newContext } from '../pages/PlanesAccion/Ciclo'

import { 
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

export const tareasContext = React.createContext()

const subtareas = [
  {
    id_subtarea: 1,
    nombre: "Subtarea 1 de la tarea 1",
    estado: 2,
    prioridad: 1,
    progreso: 10,
    notas: 'Escriba una nota...',
    Empleados: {
      mail: 'correo@gmail.com.ar'
    },
    AreasApollo: {
      nombre_del_Area: 'Recursos Humanos'
    },
    fecha_inicio: '2024-09-01',
    fecha_final: '2024-09-07'
  },
  {
    id_subtarea: 2,
    nombre: "Subtarea 2 de la tarea 1",
    estado: 2,
    prioridad: 1,
    progreso: 10,
    notas: 'Escriba una nota...',
    Empleados: {
      mail: 'correo@gmail.com.ar'
    },
    AreasApollo: {
      nombre_del_Area: 'Recursos Humanos'
    },
    fecha_inicio: '2024-09-08',
    fecha_final: '2024-09-14'
  }
]

function Tareas() {

  const arr1 = [57, 71]
  const data = {
    labels: ['Realizadas', 'No realizadas'],
    datasets: [{
        label: '',
        data: arr1,
        backgroundColor: ['#0d6efd', '#9ec5fe'],
        borderColor: '#fff',
        hoverOffset: 4,
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.label;
                    let value = context.formattedValue;
    
                    if (!label)
                        label = 'Unknown'
    
                    let sum = 0;
                    let dataArr = context.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += Number(data);
                    });
    
                    let percentage = (value * 100 / sum).toFixed(2) + '%';
                    return percentage.slice(0,4) + '%';
                }
            }
        }
    }]
  }
  const options = {
    plugins: {
        legend: {
            display: false
        },
    },
    cutout: 40
  }
  
  const { loadingTar, setLoadingTar, setErrorTar, errorTar, procesos, setProcesos, fetchProcesos, fetchTareasById, tareasByProyecto, setTareasByProyecto, idProyecto, setIdProyecto, titleArea, titleProyecto, descripcionProyecto } = useContext(newContext)
  
  const [modalDeleteProyecto, setModalDeleteProyecto] = useState(false)
  const [modalEditProyecto, setModalEditProyecto] = useState(false)
  const [modalTarea, setModalTarea] = useState(false)
  const [proyectoSelec, setProyectoSelec] = useState(null)
  const [tareaObj, setTareaObj] = useState(null)
  const [idTask, setIdTask] = useState(null)
  const [modalDeleteTarea, setModalDeleteTarea] = useState(false)
  const [errorDel, setErrorDel] = useState(null)

  useEffect(() => {
  },[])

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {descripcionProyecto}
    </Tooltip>
  );

  const handleEditProyecto = () => {
    const pro = procesos.find(e => e.id_proyecto === idProyecto)
    setProyectoSelec(JSON.stringify(pro))
    setModalEditProyecto(true)
  }

  const handleModalDeleteProyecto = () => {
    setModalDeleteProyecto(true)
  }

  const handleDeleteProyecto = async () => {
    try {
      const res = await fetch("http://localhost:3030/apis/plan-accion/deleteProyect", {
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
        setTareasByProyecto(null)
        setIdProyecto(null)
        fetchProcesos().then(res => setProcesos(res.objeto))
        setModalDeleteProyecto(false)
      }
    } catch (error) {
      console.log(error)
    } 
  }

  const handleNewTarea = (e) => {
    e.preventDefault()
    const pro = procesos.find(e => e.id_proyecto === idProyecto)
    setProyectoSelec(JSON.stringify(pro))
    setModalTarea(true)
  }

  const handleEditTarea = (id) => {
    const obj = tareasByProyecto.find((e) => e.id_tarea === id)
    setTareaObj(JSON.stringify(obj))
    const pro = procesos.find(e => e.id_proyecto === idProyecto)
    setProyectoSelec(JSON.stringify(pro))
    setModalTarea(true)
  }

  const handleModalDelete = (i) => {
    setIdTask(i)
    setModalDeleteTarea(true)
  }

  const handleDeleteTarea = async () => {
    const obj = {
      idTarea: parseInt(idTask)
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
        setErrorDel(data.errorDetalle)
      } else {
        setModalDeleteTarea(false)
        // actualiza tareas
        setLoadingTar(true)
        fetchTareasById(idProyecto)
        .then(res => {
            if(res.error !== 0){
                setLoadingTar(false)
                setErrorTar(res.errorDetalle)
            } else {
                setLoadingTar(false)
                setTareasByProyecto(res.objeto)
            }
        })
        // fin de actualiza tareas
      }
    } catch (error) {
      setErrorDel(error)
    } 
  }

  return (
    <>
      <tareasContext.Provider value={{proyectoSelec, setProyectoSelec, tareaObj, setTareaObj}}>
        <ModalEditProyecto show={modalEditProyecto} onHide={()=>setModalEditProyecto(false)} />
        <ModalPlanes show={modalTarea} onHide={()=>setModalTarea(false)} />
      </tareasContext.Provider>
      {/* Modal Eliminar Proyecto */}
      <Modal className='modal__delete__proyecto' show={modalDeleteProyecto} onHide={() => setModalDeleteProyecto(false)} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title><h3>Eliminar proyecto</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de eliminar este proyecto?</Modal.Body>
        <Modal.Footer>
          <button className='btn btn-secondary rounded-pill' onClick={() => setModalDeleteProyecto(false)}>Cancelar</button>
          <button className='btn btn-danger rounded-pill' onClick={handleDeleteProyecto}>Borrar</button>
        </Modal.Footer>
      </Modal>
      {/* Modal Eliminar Tarea */}
      <Modal className='modal__delete' show={modalDeleteTarea} onHide={() => setModalDeleteTarea(false)} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title><h3>Eliminar tarea</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de eliminar esta tarea?</Modal.Body>
        <Modal.Footer className='d-flex flex-column'>
          <div className='d-flex flex-row align-items-center align-self-end'>
            <button className='btn btn-secondary rounded-pill me-2' onClick={() => setModalDeleteTarea(false)}>Cancelar</button>
            <button className='btn btn-danger rounded-pill' onClick={handleDeleteTarea}>Borrar</button>
          </div>
          {errorDel && <p>{errorDel}</p>}
        </Modal.Footer>
      </Modal>
      {loadingTar ? (
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
          {errorTar ? (
            <div className='tareas__error d-flex flex-column align-items-center justify-content-center'>
              <img className='mb-4' src={IllustrationAccess} alt="" />
              <h2>Mensaje de error:</h2>
              <p>{errorTar}</p>
          </div>
          ) : (
            <>
              {tareasByProyecto === null ? (
                <div className='tareas__inicio d-flex flex-column align-items-center justify-content-center'>
                <img className='mb-4' src={illustrationPlanes} alt="" />
                <h2 className='fw-semibold mb-2'>¡Bienvenido!</h2>
                <p className='text-center w-75'>Aquí encontrarás los proyectos por cada área. Cada proyecto cuenta con sus propias tareas, 
                  aquellas que deberás realizar para alcanzar los objetivos establecidos.
                </p>
              </div>
              ): (
                <div className='tareas d-flex flex-column'>
                  <div className='tareas__header d-flex flex-column flex-md-row justify-content-between align-items-center mb-4'>
                    <div className='d-flex flex-row flex-md-wrap align-items-center mb-2 mb-md-0'>
                        <h3 className='m-0 me-2'>{titleArea}<i className="bi bi-chevron-right mx-2"></i>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 100, hide: 100 }}
                          overlay={renderTooltip}
                        >
                            <span className='tareas__header__title'>{titleProyecto}</span>
                        </OverlayTrigger>
                        </h3>
                        <div className='d-flex flex-column flex-md-row'>
                            <button className='btn__edit btn bg-success rounded-circle mb-2 mb-md-0 me-md-2 text-white' onClick={()=> handleEditProyecto(idProyecto)}><i className="bi bi-pencil"></i></button>
                            <button className='btn__delete btn bg-danger rounded-circle text-white' onClick={handleModalDeleteProyecto}><i className="bi bi-trash3"></i></button>
                        </div>
                    </div>
                    <button className='btn__addTarea btn btn-primary rounded-pill fw-medium' onClick={handleNewTarea}>Agregar tarea</button>
                  </div>
                  {tareasByProyecto.length === 0 ? (
                    <div className='tareas--empty__main py-4 py-md-0 d-flex flex-column align-items-center justify-content-center rounded-3'>
                      <h2 className='fw-semibold mb-1 text-center'>No tienes Planes de Acción aún.</h2>
                      <p className='mb-3 text-center'>Para comenzar, crea tu primera tarea:</p>
                      <button 
                      onClick={handleNewTarea} 
                      className='tareas--empty__main__btn btn rounded-pill shadow-sm fw-medium'>Agregar Tarea
                      </button>
                    </div>
                  ) : (
                    <div className='tareas__main d-flex flex-column'>
                      {/* <div className='tareas__main__graficas mb-4'>
                        <div className='tareas__main__graficas__doughnut d-flex flex-column shadow-sm rounded-3 border border-light-subtle'>
                          <div className='tareas__main__graficas__doughnut__info d-flex flex-row align-items-center'>
                              <div className='tareas__main__graficas__doughnut__info__textos'>
                                  <h4 className='mb-2'>Total de tareas</h4>
                                  <p className='mb-1 fw-medium'>Tareas realizadas: <span>{arr1[0]}</span></p>
                                  <p className='mb-0'>Tareas no realizadas: <span>{arr1[1]}</span></p>
                              </div>
                              <div className='tareas__main__graficas__doughnut__info__chart'>
                                  <Doughnut 
                                      data = {data}
                                      options={options}
                                  />
                              </div>
                          </div>
                        </div>
                        <div className='tareas__main__graficas__doughnut d-flex flex-column shadow-sm rounded-3 border border-light-subtle'>
                          <div className='tareas__main__graficas__doughnut__info d-flex flex-row align-items-center'>
                              <div className='tareas__main__graficas__doughnut__info__textos'>
                                  <h4 className='mb-2'>Total de tareas</h4>
                                  <p className='mb-1 fw-medium'>Tareas realizadas: <span>{arr1[0]}</span></p>
                                  <p className='mb-0'>Tareas no realizadas: <span>{arr1[1]}</span></p>
                              </div>
                              <div className='tareas__main__graficas__doughnut__info__chart'>
                                  <Doughnut 
                                      data = {data}
                                      options={options}
                                  />
                              </div>
                          </div>
                        </div>
                      </div> */}
                      <div className='tareas__main__tabla scroll--y'>
                        <table className='table align-middle'>
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
                              {/* <th scope="col" className='position-absolute end-0'>Acciones</th> */}
                            </tr>
                          </thead>
                          <tbody className='table__tbody'>
                          {tareasByProyecto.map((e,i) => {
                            return <><tr key={i} className='table__tbody__tarea table-secondary'>
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
                                <td className='table__tbody__mail'>{e.Empleados.mail}</td>
                                <td className='table__tbody__equipo'>{e.AreasApollo.nombre_del_Area}</td>
                                <td className='table__tbody__fechaInicial'>{new Date(e.fecha_inicio.replace(/-/g, '/')).toLocaleDateString()}</td>
                                <td className='table__tbody__fechaFinal'>{new Date(e.fecha_final.replace(/-/g, '/')).toLocaleDateString()}</td>
                                <td className='table__tbody__buttons active'>
                                  <button onClick={()=> handleEditTarea(e.id_tarea)} className='btn bg-success rounded-circle text-white me-2'><i className="bi bi-pencil"></i></button>
                                  <button onClick={()=> handleModalDelete(e.id_tarea)} className='btn bg-danger rounded-circle text-white'><i className="bi bi-trash3"></i></button>
                                </td>
                              </tr>
                              <>
                                {
                                  subtareas.map((e, i) => {
                                    return <tr key={i} className='table__tbody__tarea'>
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
                                      <td className='table__tbody__mail'>{e.Empleados.mail}</td>
                                      <td className='table__tbody__equipo'>{e.AreasApollo.nombre_del_Area}</td>
                                      <td className='table__tbody__fechaInicial'>{new Date(e.fecha_inicio.replace(/-/g, '/')).toLocaleDateString()}</td>
                                      <td className='table__tbody__fechaFinal'>{new Date(e.fecha_final.replace(/-/g, '/')).toLocaleDateString()}</td>
                                      <td className='table__tbody__buttons active'>
                                        <button onClick={()=> handleEditTarea(e.id_tarea)} className='btn bg-success rounded-circle text-white me-2'><i className="bi bi-pencil"></i></button>
                                        <button onClick={()=> handleModalDelete(e.id_tarea)} className='btn bg-danger rounded-circle text-white'><i className="bi bi-trash3"></i></button>
                                      </td>
                                    </tr>
                                  })
                                }
                                <tr>
                                  <button className='btn__subtarea btn rounded-pill fw-medium'>Agregar subtarea</button>
                                </tr>
                              </>
                            </>
                          })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          
        </>
      )}
    </>
    
  )
}

export default Tareas