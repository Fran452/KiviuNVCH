import React, { useState, useEffect, useContext } from 'react'
import { ProgressBar, Modal } from 'react-bootstrap';
import ModalSubtarea from './Modales/ModalSubtarea'
import { tareasContext } from './Tareas'
import { Oval } from 'react-loader-spinner'
import ModalVerSub from './Modales/ModalVerSub';

export const subtareasContext = React.createContext()

function Subtareas() {

    const { subtareas, loadingSub, setLoadingSub, errorSub, setErrorSub, fetchSubtareasById, setSubtareas, idTask } = useContext(tareasContext)

    const [idSubtask, setIdSubtask] = useState(null)
    const [modalSubtarea, setModalSubtarea] = useState(false)
    const [subtareaObj, setSubtareaObj] = useState(null)

    const [modalDeleteSub, setModalDeleteSub] = useState(false)
    const [errorDel, setErrorDel] = useState(null)

    const [modalFinalizar, setModalFinalizar] = useState(false)

    const [modalVerSub, setModalVerSub] = useState(false)

    useEffect(()=> {
    },[])
    
    const handleEditSubtarea = (id) => {
        const obj = subtareas.find((e) => e.id_sub_tarea === id)
        setSubtareaObj(JSON.stringify(obj))
        // const pro = ciclos.find(e => e.id_ciclo === idCiclo)
        // setCicloSelec(JSON.stringify(pro))
        setModalSubtarea(true)
    }

    const handleNewSubtarea = (e) => {
        e.preventDefault()
        setModalSubtarea(true)
    }

    const handleModalDelete = (id) => {
        setIdSubtask(id)
        setModalDeleteSub(true)
    }

    const handleDeleteSubtarea = async () => {
        const obj = {
            id_subtarea: parseInt(idSubtask)
        }
        try {
            const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/deleteSubTask", {
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
                setModalDeleteSub(false)
                // actualiza subtareas
                setLoadingSub(true)
                fetchSubtareasById(idTask)
                .then(res => {
                    if(res.error !== 0){
                        setLoadingSub(false)
                        setErrorSub(res.errorDetalle)
                    } else {
                        setLoadingSub(false)
                        setSubtareas(res.objeto)
                    }
                })
            }
        } catch (error) {
            setErrorDel(error)
        }
    }

    // Finalizar tarea
    const handleModalFinalizar = (id) => {
        setIdSubtask(id)
        setModalFinalizar(true)
    }

    const handleFinalizarSubtarea = async () => {
        const obj = subtareas.find((e) => e.id_sub_tarea === idSubtask)
        console.log(obj)
        try {
            const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/subTareaok", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subtarea: obj
                })
              })
              const data = await res.json()
              if(data.error !== 0){
                console.log(data.errorDetalle)
              } else {
                setModalFinalizar(false)
                // actualiza subtareas
                setLoadingSub(true)
                fetchSubtareasById(idTask)
                .then(res => {
                    if(res.error !== 0){
                        setLoadingSub(false)
                        setErrorSub(res.errorDetalle)
                    } else {
                        setLoadingSub(false)
                        setSubtareas(res.objeto)
                    }
                })
              }
        } catch (error) {
            console.log(error)
        }
    }

    // Ver subtarea
    const handleShowInfo = (id) => {
        const obj = subtareas.find((e) => e.id_sub_tarea === id)
        setSubtareaObj(JSON.stringify(obj))
        setModalVerSub(true)
      }

    return (
        <>  
            <subtareasContext.Provider value={{ subtareaObj, setSubtareaObj, setLoadingSub, setErrorSub, fetchSubtareasById, setSubtareas, idTask }}>
                <ModalSubtarea show={modalSubtarea} onHide={()=>setModalSubtarea(false)} />
                <ModalVerSub show={modalVerSub} onHide={()=>setModalVerSub(false)} />
            </subtareasContext.Provider>
            {/* Modal Eliminar subtarea */}
            <Modal className='modal__delete' show={modalDeleteSub} onHide={() => setModalDeleteSub(false)} backdrop="static" centered>
                <Modal.Header closeButton>
                <Modal.Title><h3>Eliminar subtarea</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Está seguro de eliminar esta subtarea?</Modal.Body>
                <Modal.Footer className='d-flex flex-column'>
                <div className='d-flex flex-row align-items-center align-self-end'>
                    <button className='btn btn-secondary rounded-pill me-2' onClick={() => setModalDeleteSub(false)}>Cancelar</button>
                    <button className='btn btn-danger rounded-pill' onClick={handleDeleteSubtarea}>Borrar</button>
                </div>
                {errorDel && <p>{errorDel}</p>}
                </Modal.Footer>
            </Modal>
            {/* Modal finalizar subtarea */}
            <Modal className='modal__delete' show={modalFinalizar} onHide={() => setModalFinalizar(false)} backdrop="static" centered>
                <Modal.Header closeButton>
                <Modal.Title><h3>Finalizar subtarea</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Está seguro que desea finalizar esta subtarea?</Modal.Body>
                <Modal.Footer className='d-flex flex-column'>
                <div className='d-flex flex-row align-items-center align-self-end'>
                    <button className='btn btn-secondary rounded-pill me-2' onClick={() => setModalFinalizar(false)}>Cancelar</button>
                    <button className='btn btn-danger rounded-pill' onClick={handleFinalizarSubtarea}>Finalizar</button>
                </div>
                {errorDel && <p>{errorDel}</p>}
                </Modal.Footer>
            </Modal>
            {loadingSub ? (
                <div className='loading__subtareas d-flex flex-row align-items-center'>
                    <div className='me-2'>
                        <Oval
                            visible={true}
                            height="20"
                            width="20"
                            color="#0d6efd"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                    <p className='fw-medium m-0'>Loading...</p>
                </div>
            ) : (
                <>
                    {errorSub ? (
                        <p>{errorSub}</p>
                    ) : (
                        <>
                            {subtareas.length === 0 ? (
                                <div className='table__custom__row'>
                                    <div className='table__custom__cell cell__dropdown'>
                                        <button onClick={handleNewSubtarea} className='btn btn-outline-primary btn-sm rounded-pill px-4'>Crea una subtarea</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {subtareas.map(s => {
                                        return <div className='table__custom__row' key={s.id_sub_tarea}>
                                            <div className='table__custom__cell cell__dropdown'></div>
                                            <div className='table__custom__cell cell__buttons'>
                                                {s.avance === 100 ? (
                                                    <>
                                                        <button onClick={()=> handleShowInfo(s.id_sub_tarea)} className='btn me-2'><i className="bi bi-eye"></i></button>
                                                        <button className='disabled btn me-2'><i className="bi bi-check-square"></i></button>
                                                        <button className='disabled btn me-2'><i className="bi bi-pencil"></i></button>
                                                        <button className='disabled btn'><i className="bi bi-trash3"></i></button>
                                                    </>
                                                ): (
                                                    <>
                                                        <button onClick={()=> handleShowInfo(s.id_sub_tarea)} className='btn me-2'><i className="bi bi-eye"></i></button>
                                                        <button onClick={()=> handleModalFinalizar(s.id_sub_tarea)} className='btn me-2'><i className="bi bi-square"></i></button>
                                                        <button onClick={()=> handleEditSubtarea(s.id_sub_tarea)} className='btn btn__edit--icon me-2'><i className="bi bi-pencil"></i></button>
                                                        <button onClick={()=> handleModalDelete(s.id_sub_tarea)} className='btn btn__delete--icon'><i className="bi bi-trash3"></i></button>
                                                    </>
                                                )}
                                                
                                            </div>
                                            <div className='table__custom__cell cell__nombre'>{s.titulo}</div>
                                            <div className='table__custom__cell cell__prioridad'>
                                                {s.prioridad === 1 && <span className='table__tbody__prioridad--baja rounded-pill text-white badge'>baja</span>}
                                                {s.prioridad === 2 && <span className='table__tbody__prioridad--media rounded-pill text-white badge'>media</span>}
                                                {s.prioridad === 3 && <span className='table__tbody__prioridad--alta rounded-pill text-white badge'>alta</span>}
                                            </div>
                                            <div className='table__custom__cell cell__estado'>
                                                {s.estado === 1 && <span className='table__tbody__estado--pendiente rounded-pill text-white badge'>Pendiente</span>}
                                                {s.estado === 2 && <span className='table__tbody__estado--proceso rounded-pill text-white badge'>En proceso</span>}
                                                {s.estado === 3 && <span className='table__tbody__estado--completada rounded-pill text-white badge'>Completada</span>}
                                                {s.estado === 4 && <span className='table__tbody__estado--espera rounded-pill text-white badge'>En espera</span>}
                                                {s.estado === 5 && <span className='table__tbody__estado--cancelada rounded-pill text-white badge'>Cancelada</span>}
                                                {s.estado === 6 && <span className='table__tbody__estado--bloqueada rounded-pill text-white badge'>Bloqueada</span>}
                                            </div>
                                            <div className='table__custom__cell cell__progreso'>
                                                <ProgressBar className='table__tbody__progreso__bar' now={s.avance} label={`${s.avance}%`} max={100}/>
                                            </div>
                                            <div className='table__custom__cell cell__horas'>{s.horasAprox}</div>
                                            <div className="table__custom__cell cell__notas">{s.notas}</div>
                                            <div className="table__custom__cell cell__mail">{s.Empleados.nombre}</div>
                                            <div className="table__custom__cell cell__date">{s.fecha_inicio.replace(/-/g, '/').split("/").reverse().join("/")}</div>
                                            <div className="table__custom__cell cell__date">
                                                {s.avance === 100 ? `${s.fecha_final.replace(/-/g, '/').split("/").reverse().join("/")}` : ""}
                                            </div>
                                            {/* <div className="table__custom__cell cell__date">{s.fecha_final.replace(/-/g, '/').split("/").reverse().join("/")}</div> */}
                                        </div>
                                    })}
                                    <div className='table__custom__row'>
                                        <div className='table__custom__cell cell__dropdown'>
                                            <button onClick={handleNewSubtarea} className='btn btn-outline-primary btn-sm rounded-pill px-4'>Crea una subtarea</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            
        </>
  )
}

export default Subtareas