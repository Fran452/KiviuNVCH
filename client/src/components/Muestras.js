import React, { useState, useEffect, useContext } from 'react';
import { ProgressBar, Modal } from 'react-bootstrap';
import ModalMuestra from './Modales/ModalMuestra';
import { subtareasContext } from './Subtareas';
import { Oval } from 'react-loader-spinner'
import "./Tareas.scss"
import IcoListMuestra from '../assets/img/ico-list2.svg';

export const muestrasContext = React.createContext()

function Muestras(){
    const {
        muestras,
        setMuestras,
        loadingMuestra,
        setLoadingMuestra,
        errorMuestra,
        setErrorMuestra,
        idSubtask,
        fetchMuestrasById
    } = useContext(subtareasContext)

    const [idMuestra, setIdMuestra] = useState(null)
    const [modalMuestra, setModalMuestra] = useState(false)
    const [muestraObj, setMuestraObj] = useState(null)

    const handleShowInfo = (id) => {
        console.log(id)
    }

    const handleNewMuestra = (e) => {
        e.preventDefault()
        setModalMuestra(true)
    }

    const handleModalFinalizar = () => {

    }

    const handleEditSubtarea = () => {

    }

    const handleModalDelete = () => {

    }

    return (
        <>
            <muestrasContext.Provider value={{ idSubtask, muestraObj, setMuestraObj, setLoadingMuestra, fetchMuestrasById, setErrorMuestra, setMuestras }}>
                <ModalMuestra show={modalMuestra} onHide={()=>setModalMuestra(false)} />
                {/* Modal Ver muestra */}
                {/* Modal Eliminar muestra */}
                {/* Modal Finalizar muestra */}
                {loadingMuestra ? (
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
                        {errorMuestra ? (
                            <p>{errorMuestra}</p>
                        ) : (
                            <>
                                {muestras.length === 0 ? (
                                    <div className='d-flex flex-row'>
                                        <div className='icon__lista__muestra d-flex justify-content-end'>
                                            <img src={IcoListMuestra} alt=''/>
                                        </div>
                                        <div className='table__custom__row--btnadd d-flex flex-row align-items-center'>
                                            <button onClick={handleNewMuestra} className='btn btn-outline-success btn-sm rounded-pill px-3 me-2 fw-medium'><i className="bi bi-plus me-1"></i>Crear una muestra</button>
                                            <button className='btn btn-success btn-sm rounded-pill px-3 fw-medium'><i className="bi bi-plus me-1"></i>Subir excel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {muestras.map((m, i) => {
                                            return <div className='d-flex flex-row'>
                                                <div className='icon__lista__muestra d-flex justify-content-start'>
                                                    <img src={IcoListMuestra} alt=''/>
                                                </div>
                                                <div className='table__custom__row' key={i}>
                                                    <div className='table__custom__cell cell__buttons'>
                                                        {m.avance === 100 ? (
                                                            <>
                                                                <button onClick={()=> handleShowInfo(m.id_muestra)} className='btn__ico--g btn border-0 p-0'><i className="bi bi-eye"></i></button>
                                                                <button className='disabled btn__ico--g btn border-0 p-0'><i className="bi bi-check-square"></i></button>
                                                                <button className='disabled btn__ico--g btn border-0 p-0'><i className="bi bi-pencil"></i></button>
                                                                <button className='disabled btn__ico--g btn border-0 p-0'><i className="bi bi-trash3"></i></button>
                                                            </>
                                                        ): (
                                                            <>
                                                                <button onClick={()=> handleShowInfo(m.id_muestra)} className='btn__ico--g btn border-0 p-0'><i className="bi bi-eye"></i></button>
                                                                <button onClick={()=> handleModalFinalizar(m.id_muestra)} className='btn__ico--g btn border-0 p-0'><i className="bi bi-square"></i></button>
                                                                <button onClick={()=> handleEditSubtarea(m.id_muestra)} className='btn__ico--g btn btn__edit--icon border-0 p-0'><i className="bi bi-pencil"></i></button>
                                                                <button onClick={()=> handleModalDelete(m.id_muestra)} className='btn__ico--g btn btn__delete--icon border-0 p-0'><i className="bi bi-trash3"></i></button>
                                                            </>
                                                        )}
                                                        
                                                    </div>
                                                    <div className='table__custom__cell cell__nombre'>{m.titulo}</div>
                                                    <div className='table__custom__cell cell__prioridad'></div>
                                                    <div className='table__custom__cell cell__estado'></div>
                                                    <div className='table__custom__cell cell__progreso'>
                                                        <ProgressBar className='table__tbody__progreso__bar' now={Math.round(m.avance)} label={`${Math.round(m.avance)}%`} max={100}/>
                                                    </div>
                                                    <div className='table__custom__cell cell__horas'>{m.horasAprox}</div>
                                                    <div className="table__custom__cell cell__notas">{m.notas}</div>
                                                    <div className="table__custom__cell cell__mail">{m.Empleados.nombre}</div>
                                                    <div className="table__custom__cell cell__date"></div>
                                                    <div className="table__custom__cell cell__date"></div>
                                                </div>
                                            </div>
                                        })}
                                        <div className='d-flex flex-row'>
                                            <div className='icon__lista__muestra d-flex justify-content-end'>
                                                <img src={IcoListMuestra} alt=''/>
                                            </div>
                                            <div className='table__custom__row--btnadd d-flex flex-row align-items-center'>
                                                <button onClick={handleNewMuestra} className='btn btn-outline-success btn-sm rounded-pill px-3 me-2 fw-medium'><i className="bi bi-plus me-1"></i>Crear una muestra</button>
                                                <button className='btn btn-success btn-sm rounded-pill px-3 fw-medium'><i className="bi bi-plus me-1"></i>Subir excel</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </muestrasContext.Provider>
        </>
    )
}

export default Muestras