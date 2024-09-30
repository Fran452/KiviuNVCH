import React, { useContext, useEffect, useState, useRef } from 'react'
// import { ProgressBar, Modal, OverlayTrigger } from 'react-bootstrap';
import { ProgressBar, Modal } from 'react-bootstrap';
import { Oval } from 'react-loader-spinner'
import illustrationPlanes from "../assets/img/planes.png"
import IllustrationAccess from "../assets/img/access.png"
import "./Tareas.scss"
import ModalEditCiclo from './Modales/ModalEditCiclo';
import ModalPlanes from './Modales/ModalPlanes';
import Subtareas from './Subtareas';
import { newContext } from '../pages/PlanesAccion/Ciclo'
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import ModalVer from './Modales/ModalVer';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

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

function Tareas() {
  
  const { 
    subtareas, 
    setSubtareas, 
    loadingTar, 
    setLoadingTar, 
    setErrorTar, 
    errorTar, 
    ciclos, 
    setCiclos, 
    fetchCiclos, 
    fetchTareasById, 
    tareasByCiclo, 
    setTareasByCiclo, 
    idCiclo, 
    setIdCiclo, 
    yearSelec, 
    titleCiclo, 
    // descripcionCiclo, 
    expandedRow, 
    setExpandedRow,
    tareasRealporCiclo,
    tareasNorealporCiclo,
    setTareasRealporCiclo,
    setTareasNorealporCiclo,
    fetchMetrica,
    handleCloseCiclos,
    ciclosClose
  } = useContext(newContext)
  
  const [modalDeleteCiclo, setModalDeleteCiclo] = useState(false)
  const [modalEditCiclo, setModalEditCiclo] = useState(false)
  const [modalTarea, setModalTarea] = useState(false)
  const [cicloSelec, setCicloSelec] = useState(null)
  const [tareaObj, setTareaObj] = useState(null)
  const [idTask, setIdTask] = useState(null)
  const [modalDeleteTarea, setModalDeleteTarea] = useState(false)
  const [errorDel, setErrorDel] = useState(null)

  const [loadingSub, setLoadingSub] = useState(true)
  const [errorSub, setErrorSub] = useState(null)

  const [modalVer, setModalVer] = useState(false)

  const [metricasClose, setMetricasClose] = useState(false)

  // const [subtareas, setSubtareas] = useState([])
  // const [errorSubtarea, setErrorSubtarea] = useState(null)

  const [idSubtask, setIdSubtask] = useState(null)
  const [expandedRowMuestra, setExpandedRowMuestra] = useState(null);
  const [muestras, setMuestras] = useState([])

  useEffect(() => {
    // const fetchAllSubTareas = () => {
    //   fetchSubtareasById(idProyecto)
    //   .then(res => {
    //     if(res.error !== 0){
    //       setErrorSubtarea(res.errorDetalle)
    //     } else {
    //       setSubtareas(res.objeto)
    //     }
    //     console.log(res)
    //   })
    // }
    
    // fetchAllSubTareas()

  },[])

  // const renderTooltip = (props) => (
  //   <Tooltip id="button-tooltip" {...props}>
  //     {descripcionCiclo}
  //   </Tooltip>
  // );

  const handleEditCiclo = () => {
    const pro = ciclos.find(e => e.id_ciclo === idCiclo)
    setCicloSelec(JSON.stringify(pro))
    setModalEditCiclo(true)
  }

  const handleModalDeleteCiclo = () => {
    setModalDeleteCiclo(true)
  }

  const handleDeleteCiclo = async () => {
    try {
      const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/deleteCiclos", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_ciclo: parseInt(idCiclo)
        })
      })
      const data = await res.json()
      if(data.error !== 0){
        console.log(data.errorDetalle)
      } else {
        setTareasByCiclo(null)
        setIdCiclo(null)
        fetchCiclos().then(res => setCiclos(res.objeto))
        setModalDeleteCiclo(false)
      }
    } catch (error) {
      console.log(error)
    } 
  }

  const handleNewTarea = (e) => {
    e.preventDefault()
    const pro = ciclos.find(e => e.id_ciclo === idCiclo)
    setCicloSelec(JSON.stringify(pro))
    setModalTarea(true)
  }

  const handleEditTarea = (id) => {
    const obj = tareasByCiclo.find((e) => e.id_tarea === id)
    setTareaObj(JSON.stringify(obj))
    const pro = ciclos.find(e => e.id_ciclo === idCiclo)
    setCicloSelec(JSON.stringify(pro))
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
      const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/deleteTask", {
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
        // Actualizar métricas
        fetchMetrica()
        .then(res => {
            if(res.error !== 0){
                console.log(res.errorDetalle)
            } else {
                let tareasNorealizadas = 0;
                const arr = res.objeto
                const selec = arr.find(e => e.id_ciclo === idCiclo)
                if(selec === undefined) {
                    setTareasRealporCiclo(0)
                    setTareasNorealporCiclo(0)
                } else {
                    tareasNorealizadas = selec.tareas_totales - selec.tareas_realizadas
                    setTareasNorealporCiclo(tareasNorealizadas)
                    setTareasRealporCiclo(selec.tareas_realizadas)
                } 
            }
        })
        // actualiza tareas
        setLoadingTar(true)
        fetchTareasById(idCiclo)
        .then(res => {
            if(res.error !== 0){
                setLoadingTar(false)
                setErrorTar(res.errorDetalle)
            } else {
                setLoadingTar(false)
                setTareasByCiclo(res.objeto)
            }
        })
        // fin de actualiza tareas
      }
    } catch (error) {
      setErrorDel(error)
    } 
  }

  const fetchSubtareasById = async (id) => {
    try {
      const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/viewSubTask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idtarea: id
        })
      })
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubtareasById = async (id) => {
    setExpandedRow(expandedRow === id ? null : id);
    // setLoadingSub(true)
    fetchSubtareasById(id)
    .then(res => {
      if(res.error !== 0){
        setLoadingSub(false)
        setErrorSub(res.errorDetalle)
      } else {
        setLoadingSub(false)
        setSubtareas(res.objeto)
      }
    })
    setIdTask(id)
    // setExpandedRowMuestra(null)
    // setMuestras([])
  }

  const handleShowInfo = (id) => {
    const obj = tareasByCiclo.find((e) => e.id_tarea === id)
    setTareaObj(JSON.stringify(obj))
    setModalVer(true)
  }

  const nodeRef = useRef()

  // Doughnut gráfica
  const data = {
    labels: ['Realizadas', 'No realizadas'],
    datasets: [{
        label: '',
        data: [tareasRealporCiclo, tareasNorealporCiclo],
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
                    // eslint-disable-next-line array-callback-return
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
      cutout: 30
  }

  const handleCloseMetricas = () => {
    setMetricasClose(!metricasClose)
  }

  const handleDragDrop = async (results) => {
    const {source, destination, type, draggableId } = results;
    if(!destination) return;
    if(
      source.droppableId === destination.droppableId && 
      source.index === destination.index
    ) 
      return;
    if(type === 'group'){
      const reorderedTareas = [...tareasByCiclo];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedTarea] = reorderedTareas.splice(sourceIndex, 1)
      reorderedTareas.splice(destinationIndex, 0, removedTarea)
      //
      const inicioMod = parseInt(sourceIndex)+1
      const finalMod = parseInt(destinationIndex)+1
      // Fetch PUT MOVE TAREA
      const obj = {
        inicial: inicioMod,
        final: finalMod,
        idTarea: parseInt(draggableId),
        idCiclo: idCiclo
      }
      try {
        const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/moveTask", {
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
          console.log(data.objeto)
        }
      } catch (error) {
        console.log(error)
      }
      return setTareasByCiclo(reorderedTareas)
    }
  }

  return (
    <>
      <tareasContext.Provider value={{setLoadingTar, setErrorTar, setTareasByCiclo, cicloSelec, setCicloSelec, tareaObj, setTareaObj, subtareas, loadingSub, setLoadingSub, errorSub, setErrorSub, fetchSubtareasById, fetchTareasById, idCiclo, setSubtareas, idTask, setTareasRealporCiclo, setTareasNorealporCiclo, fetchMetrica, expandedRowMuestra, setExpandedRowMuestra, muestras, setMuestras, idSubtask, setIdSubtask }}>
        <ModalEditCiclo show={modalEditCiclo} onHide={()=>setModalEditCiclo(false)} />
        <ModalPlanes show={modalTarea} onHide={()=>setModalTarea(false)} />
        <ModalVer show={modalVer} onHide={()=>setModalVer(false)} />
      {/* Modal Eliminar Proyecto */}
      <Modal className='modal__delete__proyecto' show={modalDeleteCiclo} onHide={() => setModalDeleteCiclo(false)} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title><h3>Eliminar ciclo</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de eliminar este ciclo?</Modal.Body>
        <Modal.Footer>
          <button className='btn btn-secondary rounded-pill' onClick={() => setModalDeleteCiclo(false)}>Cancelar</button>
          <button className='btn btn-danger rounded-pill' onClick={handleDeleteCiclo}>Borrar</button>
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
      <div className={`${ciclosClose ? "tareas__container--close" : "tareas__container"} d-flex flex-column`}>
        <button className='d-none ciclos__btn btn border-0 p-0 d-md-flex flex-row align-items-center' onClick={handleCloseCiclos}>
          {ciclosClose ? <i className="bi bi-arrow-bar-right me-2"></i>: <i className="bi bi-arrow-bar-left me-2"></i>}
          <span>{ciclosClose ? "Mostrar ciclos" : "Ocultar ciclos"}</span>
        </button>
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
                {tareasByCiclo === null ? (
                  <div className='tareas__inicio d-flex flex-column align-items-center justify-content-center'>
                    <img className='mb-4' src={illustrationPlanes} alt="" />
                    <h2 className='fw-semibold mb-2'>¡Bienvenido!</h2>
                    <p className='text-center w-75'>Aquí encontrarás los procesos por cada año. Cada proceso cuenta con sus propias tareas y subtareas, 
                      aquellas que deberás realizar para alcanzar los objetivos establecidos.
                    </p>
                  </div>
                ): (
                  <div className='tareas d-flex flex-column'>
                    <div className='tareas__header d-flex flex-column flex-md-row justify-content-between align-items-center mb-3'>
                      <div className='w-100 d-flex flex-row justify-content-between justify-content-md-start flex-md-wrap align-items-center mb-2 mb-md-0'>
                          <h3 className='m-0 me-2'>{yearSelec}<i className="bi bi-chevron-right mx-2"></i>
                            <span className='tareas__header__title'>{titleCiclo}</span>
                          </h3>
                          {/* <h3 className='m-0 me-2'>{yearSelec}<i className="bi bi-chevron-right mx-2"></i>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 100, hide: 100 }}
                            overlay={renderTooltip}
                          >
                              <span className='tareas__header__title'>{titleCiclo}</span>
                          </OverlayTrigger>
                          </h3> */}
                          <div className='d-flex flex-column flex-md-row'>
                              <button className='btn__edit btn bg-success rounded-circle mb-2 mb-md-0 me-md-2 text-white' onClick={()=> handleEditCiclo(idCiclo)}><i className="bi bi-pencil"></i></button>
                              <button className='btn__delete btn bg-danger rounded-circle text-white' onClick={handleModalDeleteCiclo}><i className="bi bi-trash3"></i></button>
                          </div>
                      </div>
                      <button className='btn__addTarea btn btn-primary rounded-pill fw-medium' onClick={handleNewTarea}>Agregar tarea</button>
                    </div>
                    {tareasByCiclo.length === 0 ? (
                      <div className='tareas--empty__main py-4 py-md-0 d-flex flex-column align-items-center justify-content-center rounded-3'>
                        <h2 className='fw-semibold mb-1 text-center'>No tienes tareas aún.</h2>
                        <p className='mb-3 text-center'>Para comenzar, crea tu primera tarea:</p>
                        <button 
                        onClick={handleNewTarea} 
                        className='tareas--empty__main__btn btn rounded-pill shadow-sm fw-medium'>Agregar Tarea
                        </button>
                      </div>
                    ) : (
                      <div className='tareas__main d-flex flex-column'>
                        <div>
                          <div className={`${metricasClose ? "invisible tareas__main__graficas--close mb-0" : "d-flex mb-2"} tareas__main__graficas`}>
                            {/* Gráfica 1 */}
                            <div className='tareas__main__graficas__doughnut d-flex flex-column shadow-sm rounded-3 border border-light-subtle'>
                              <div className='tareas__main__graficas__doughnut__info d-flex flex-row align-items-center'>
                                  <div className='tareas__main__graficas__doughnut__info__textos'>
                                      <h4 className='mb-2'>{titleCiclo}</h4>
                                      <p className='mb-1 fw-medium'>Tareas realizadas: <span>{tareasRealporCiclo}</span></p>
                                      <p className='mb-0'>Tareas no realizadas: <span>{tareasNorealporCiclo}</span></p>
                                  </div>
                                  <div className='tareas__main__graficas__doughnut__info__chart'>
                                      <Doughnut 
                                          data = {data}
                                          options={options}
                                      />
                                  </div>
                              </div>
                            </div>
                          </div>
                          {metricasClose ? (
                            <div className='d-flex flex-row'>
                              <div className='d-flex justify-content-center doughnut--empty shadow-sm rounded-pill border border-light-subtle'>
                                <i className="bi bi-pie-chart text-muted"></i>
                              </div>
                            </div>
                          ): ("")}
                          <button className='ciclos__btn btn border-0 p-0 d-flex flex-row align-items-center' onClick={handleCloseMetricas}>
                            {metricasClose ? <i className="bi bi-eye me-2"></i>: <i className="bi bi-eye-slash me-2"></i>}
                            <span>{metricasClose ? "Mostrar métricas" : "Ocultar métricas"}</span>
                          </button>
                        </div>
                        <div className='tareas__main__tabla'>
                          {/* Table custom */}
                          <div className='table__custom'>
                            {/* Cabecera de la tabla */}
                            <div className='table__custom__header'>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__dropdown'></div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__buttons--task'></div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__orden'>Orden</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__nombre'>Tareas</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__prioridad'>Prioridad</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__estado'>Estado</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__progreso'>Progreso</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__horas'>Horas totales</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__notas'>Notas</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__mail'>Responsable</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__date'>Fecha inicial</div>
                              <div className='table__custom__cell table__custom__cell--title fw-bold cell__date'>Fecha final</div>
                            </div>
                            <DragDropContext onDragEnd={handleDragDrop}>
                              <div className='table__custom__body'>
                                <Droppable droppableId='ROOT' type='group'>
                                  {(provided)=> (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                      {tareasByCiclo.map((e,i) => {
                                      return <Draggable draggableId={e.id_tarea.toString()} key={e.id_tarea.toString()} index={i}>
                                          {(provided) => (
                                            <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                              <React.Fragment>
                                                {/* Row de cada tarea */}
                                                <div className='table__custom__row bgblue'>
                                                  <div className='table__custom__cell'>
                                                    <button className='btn__ico btn p-0' onClick={()=>handleSubtareasById(e.id_tarea)}>
                                                      {expandedRow === e.id_tarea ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                                                    </button>
                                                  </div>
                                                  <div className='table__custom__cell cell__buttons--task'>
                                                    <button onClick={()=> handleShowInfo(e.id_tarea)} className='btn__ico--g btn border-0 p-0'><i className="bi bi-eye"></i></button>
                                                    <button onClick={()=> handleEditTarea(e.id_tarea)} className='btn__ico--g btn border-0 p-0 btn__edit--icon'><i className="bi bi-pencil"></i></button>
                                                    <button onClick={()=> handleModalDelete(e.id_tarea)} className='btn__ico--g btn border-0 p-0 btn__delete--icon'><i className="bi bi-trash3"></i></button>
                                                  </div>
                                                  <div className='table__custom__cell cell__orden'>{i+1}</div>
                                                  {/* <div className='table__custom__cell cell__orden'>{e.numero_de_orden}</div> */}
                                                  <div className='table__custom__cell cell__nombre'>{e.nombre}</div>
                                                  <div className='table__custom__cell cell__prioridad'>
                                                    {e.prioridad === 1 && <span className='table__tbody__prioridad--baja rounded-pill text-white badge'>baja</span>}
                                                    {e.prioridad === 2 && <span className='table__tbody__prioridad--media rounded-pill text-white badge'>media</span>}
                                                    {e.prioridad === 3 && <span className='table__tbody__prioridad--alta rounded-pill text-white badge'>alta</span>}
                                                  </div>
                                                  <div className='table__custom__cell cell__estado'>
                                                    {e.estado === 1 && <span className='table__tbody__estado--pendiente rounded-pill text-white badge'>Pendiente</span>}
                                                    {e.estado === 2 && <span className='table__tbody__estado--proceso rounded-pill text-white badge'>En proceso</span>}
                                                    {e.estado === 3 && <span className='table__tbody__estado--completada rounded-pill text-white badge'>Completada</span>}
                                                    {e.estado === 4 && <span className='table__tbody__estado--espera rounded-pill text-white badge'>En espera</span>}
                                                    {e.estado === 5 && <span className='table__tbody__estado--cancelada rounded-pill text-white badge'>Cancelada</span>}
                                                    {e.estado === 6 && <span className='table__tbody__estado--bloqueada rounded-pill text-white badge'>Bloqueada</span>}
                                                  </div>
                                                  <div className='table__custom__cell cell__progreso'>
                                                    <ProgressBar className='table__tbody__progreso__bar' now={Math.round(e.progreso_tarea)} label={`${Math.round(e.progreso_tarea)}%`} max={100}/>
                                                  </div>
                                                  <div className='table__custom__cell cell__horas'>{e.horas_tarea}</div>
                                                  <div className="table__custom__cell cell__notas">{e.notas}</div>
                                                  <div className="table__custom__cell cell__mail">{e.nombreUser}</div>
                                                  <div className="table__custom__cell cell__date">{e.fecha_inicio.replace(/-/g, '/').split("/").reverse().join("/")}</div>
                                                  {e.fecha_final === null ? (
                                                    <div className="table__custom__cell cell__date"></div>
                                                  ): (
                                                    <div className="table__custom__cell cell__date">{e.fecha_final.replace(/-/g, '/').split("/").reverse().join("/")}</div>
                                                  )}
                                                  {/* <div className="table__custom__cell cell__date">{e.fecha_inicio.replace(/-/g, '/').split("/").reverse().join("/")}</div>
                                                  <div className="table__custom__cell cell__date">{e.fecha_final.replace(/-/g, '/').split("/").reverse().join("/")}</div> */}
                                                </div>
                                                <CSSTransition
                                                    in={expandedRow === e.id_tarea}
                                                    timeout={300}
                                                    classNames="details"
                                                    unmountOnExit
                                                    nodeRef={nodeRef}
                                                >
                                                  <div ref={nodeRef}>
                                                    <Subtareas />
                                                  </div>
                                                </CSSTransition>
                                              </React.Fragment>
                                            </div>
                                          )}
                                        </Draggable>
                                      })}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </DragDropContext>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      </tareasContext.Provider>
    </>
    
  )
}

export default Tareas