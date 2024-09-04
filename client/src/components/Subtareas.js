import React, { useState, useEffect, useContext } from 'react'
import { ProgressBar } from 'react-bootstrap';
import ModalSubtarea from './Modales/ModalSubtarea'
import { tareasContext } from './Tareas'
import { Oval } from 'react-loader-spinner'

export const subtareasContext = React.createContext()

function Subtareas() {

    const { subtareas, loadingSub, errorSub } = useContext(tareasContext)

    const [modalSubtarea, setModalSubtarea] = useState(false)
    const [subtareaObj, setSubtareaObj] = useState(null)

    useEffect(()=> {
    },[])
    
    const handleEditSubtarea = (id) => {
        console.log(id)
        const obj = subtareas.find((e) => e.id_sub_tarea === id)
        setSubtareaObj(JSON.stringify(obj))
        // const pro = ciclos.find(e => e.id_ciclo === idCiclo)
        // setCicloSelec(JSON.stringify(pro))
        setModalSubtarea(true)
    }

    const handleModalDelete = (id) => {
        console.log(id)
    }

    return (
        <>  
            <subtareasContext.Provider value={{ subtareaObj, setSubtareaObj }}>
                <ModalSubtarea show={modalSubtarea} onHide={()=>setModalSubtarea(false)} />
            </subtareasContext.Provider>
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
                                    <button className='btn btn-primary rounded-pill px-4'>Crea una subtarea</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {subtareas.map(s => {
                                        return <div className='table__custom__row' key={s.id_sub_tarea}>
                                            <div className='table__custom__cell cell__dropdown'></div>
                                            <div className='table__custom__cell cell__buttons'>
                                                <button onClick={()=> handleEditSubtarea(s.id_sub_tarea)} className='btn btn__edit--icon me-2'><i className="bi bi-pencil"></i></button>
                                                <button onClick={()=> handleModalDelete(s.id_sub_tarea)} className='btn btn__delete--icon'><i className="bi bi-trash3"></i></button>
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
                                            <div className="table__custom__cell cell__date"></div>
                                            {/* <div className="table__custom__cell cell__date">{s.fecha_final.replace(/-/g, '/').split("/").reverse().join("/")}</div> */}
                                        </div>
                                    })}
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