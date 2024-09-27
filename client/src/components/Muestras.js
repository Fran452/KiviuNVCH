import React, { useState, useEffect, useContext } from 'react';
import { ProgressBar, Modal } from 'react-bootstrap';
import ModalMuestra from './Modales/ModalMuestra';
import { subtareasContext } from './Subtareas';
import { Oval } from 'react-loader-spinner'
import "./Tareas.scss"
import IcoListMuestra from '../assets/img/ico-list2.svg';
import excel from '../assets/muestras-ejemplo.xlsx'
import ModalVerMuestra from './Modales/ModalVerMuestra';

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
        setIdSubtask,
        fetchMuestrasById,
        idTask,
        idCiclo, 
        setTareasRealporCiclo, 
        setTareasNorealporCiclo,
        setLoadingTar,
        fetchTareasById,
        setErrorTar, 
        setTareasByCiclo,
        setLoadingSub,
        fetchSubtareasById,
        setErrorSub,
        setSubtareas,
        fetchMetrica
    } = useContext(subtareasContext)

    const [idMuestra, setIdMuestra] = useState(null)
    const [modalMuestra, setModalMuestra] = useState(false)
    const [muestraObj, setMuestraObj] = useState(null)

    const [modalDeleteMuestra, setModalDeleteMuestra] = useState(false)
    const [errorDel, setErrorDel] = useState(null)

    const [modalFinalizar, setModalFinalizar] = useState(false)
    const [modalVerMuestra, setModalVerMuestra] = useState(false)

    const [selectedFile, setSelectedFile] = useState();
    const [errorExcel, setErrorExcel] = useState(null)

    // CREAR MUESTRA
    const handleNewMuestra = (e) => {
        e.preventDefault()
        setModalMuestra(true)
    }

    // EDITAR MUESTRA
    const handleEditMuestra = (id) => {
        const obj = muestras.find((e) => e.id_muestra === id)
        setMuestraObj(JSON.stringify(obj))
        setModalMuestra(true)
    }

    // DELETE MUESTRA
    const handleModalDelete = (id) => {
        setIdMuestra(id)
        setModalDeleteMuestra(true)
    }

    const handleDeleteMuestra = async () => {
        const obj = {
            id_muestra: parseInt(idMuestra)
        }
        try {
            const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/deleteMuestras", {
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
                setModalDeleteMuestra(false)
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
                // actualiza muestras
                setLoadingMuestra(true)
                fetchMuestrasById(idSubtask)
                .then(res => {
                    if(res.error !== 0){
                        setLoadingMuestra(false)
                        setErrorMuestra(res.errorDetalle)
                    } else {
                        setLoadingMuestra(false)
                        setMuestras(res.objeto)
                    }
                })
            }
        } catch (error) {
            setErrorDel(error)
        }
    }

    // FINALIZAR
    const handleModalFinalizar = (id) => {
        setIdMuestra(id)
        setModalFinalizar(true)
    }

    const handleFinalizarMuestra = async () => {
        const obj = muestras.find((e) => e.id_muestra === idMuestra)
        try {
            const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/muestrasok", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    muestra: obj
                })
            })
            const data = await res.json()
            if(data.error !== 0){
                console.log(data.errorDetalle)
            } else {
                setModalFinalizar(false)
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
                // actualiza muestras
                setLoadingMuestra(true)
                fetchMuestrasById(idSubtask)
                .then(res => {
                    if(res.error !== 0){
                        setLoadingMuestra(false)
                        setErrorMuestra(res.errorDetalle)
                    } else {
                        setLoadingMuestra(false)
                        setMuestras(res.objeto)
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // VER MODAL MUESTRA
    const handleShowInfo = (id) => {
        const obj = muestras.find((e) => e.id_muestra === id)
        setMuestraObj(JSON.stringify(obj))
        setModalVerMuestra(true)
    }

    // SUBIDA DE EXCEL
    const changeHandler = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const cargaExcel = async () => {
        try {
            const res = await fetch("http://localhost:3040/apis/plan-accion/cargaExcel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_subtarea: idSubtask
                })
              })
              const data = await res.json()
              if(data.error !== 0){
                setErrorExcel(data.errorDetalle)
              } else {
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
                // actualiza muestras
                setLoadingMuestra(true)
                fetchMuestrasById(idSubtask)
                .then(res => {
                    if(res.error !== 0){
                        setLoadingMuestra(false)
                        setErrorMuestra(res.errorDetalle)
                    } else {
                        setLoadingMuestra(false)
                        setMuestras(res.objeto)
                    }
                })
              }
        } catch (error) {
            setErrorExcel(error)
        }
    }

    const handleSubmission = async () => {
        const formData = new FormData();
		formData.append('excel', selectedFile);
        try {
            const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/subitExcel", {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            if(data.error !== 0){
                setErrorExcel(data.errorDetalle)
            } else {
                cargaExcel()
            }
        } catch (error) {
            setErrorExcel(error)
        }
    }

    return (
        <>
            <muestrasContext.Provider value={{ idSubtask, setIdSubtask, muestraObj, setMuestraObj, setLoadingMuestra, fetchMuestrasById, setErrorMuestra, setMuestras }}>
                <ModalMuestra show={modalMuestra} onHide={()=>setModalMuestra(false)} />
                {/* Modal Ver muestra */}
                <ModalVerMuestra show={modalVerMuestra} onHide={()=>setModalVerMuestra(false)} />
                {/* Modal Eliminar muestra */}
                <Modal className='modal__delete' show={modalDeleteMuestra} onHide={() => setModalDeleteMuestra(false)} backdrop="static" centered>
                    <Modal.Header closeButton>
                    <Modal.Title><h3>Eliminar muestra</h3></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Está seguro de eliminar esta muestra?</Modal.Body>
                    <Modal.Footer className='d-flex flex-column'>
                    <div className='d-flex flex-row align-items-center align-self-end'>
                        <button className='btn btn-secondary rounded-pill me-2' onClick={() => setModalDeleteMuestra(false)}>Cancelar</button>
                        <button className='btn btn-danger rounded-pill' onClick={handleDeleteMuestra}>Borrar</button>
                    </div>
                    {errorDel && <p>{errorDel}</p>}
                    </Modal.Footer>
                </Modal>
                {/* Modal Finalizar muestra */}
                <Modal className='modal__delete' show={modalFinalizar} onHide={() => setModalFinalizar(false)} backdrop="static" centered>
                    <Modal.Header closeButton>
                        <Modal.Title><h3>Finalizar muestra</h3></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Está seguro que desea finalizar esta muestra?</Modal.Body>
                    <Modal.Footer className='d-flex flex-column'>
                        <div className='d-flex flex-row align-items-center align-self-end'>
                            <button className='btn btn-secondary rounded-pill me-2' onClick={() => setModalFinalizar(false)}>Cancelar</button>
                            <button className='btn btn-danger rounded-pill' onClick={handleFinalizarMuestra}>Finalizar</button>
                        </div>
                        {errorDel && <p>{errorDel}</p>}
                    </Modal.Footer>
                </Modal>
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
                                        {/* Botones */}
                                        <div className='table__custom__row--btnadd d-flex flex-column'>
                                            <button onClick={handleNewMuestra} className='btn__addMuestra btn btn-outline-success btn-sm rounded-pill px-3 mb-2 fw-medium'><i className="bi bi-plus me-1"></i>Crear una muestra</button>
                                            <p className='mb-2'>ó suba un archivo excel:</p>
                                            <div className='d-flex flex-row align-items-center mb-2'>
                                                <p className='mb-0 me-2'><b>Descargue una plantilla aquí:</b></p>
                                                <a href={excel} download="muestras-ejemplo.xlsx" className='btn btn-warning text-white btn-sm rounded-pill px-3 fw-medium'>Descargar</a>
                                            </div>
                                            <div className='d-flex flex-row align-items-center'>
                                                <input type='file' onChange={changeHandler} className='btn__file me-2'/>
                                                <button onClick={handleSubmission} className='btn btn-success btn-sm rounded-pill px-3 fw-medium me-2'>
                                                    <i className="bi bi-upload me-2"></i>
                                                    Subir excel
                                                </button>
                                            </div>
                                            {errorExcel && <p>{errorExcel}</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {muestras.map((m, i) => {
                                            return <div className='d-flex flex-row' key={i}>
                                                <div className='icon__lista__muestra d-flex justify-content-start'>
                                                    <img src={IcoListMuestra} alt=''/>
                                                </div>
                                                <div className='table__custom__row'>
                                                    <div className='table__custom__cell cell__buttons'>
                                                        {Math.round(m.avance) === 100 ? (
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
                                                                <button onClick={()=> handleEditMuestra(m.id_muestra)} className='btn__ico--g btn btn__edit--icon border-0 p-0'><i className="bi bi-pencil"></i></button>
                                                                <button onClick={()=> handleModalDelete(m.id_muestra)} className='btn__ico--g btn btn__delete--icon border-0 p-0'><i className="bi bi-trash3"></i></button>
                                                            </>
                                                        )}
                                                        
                                                    </div>
                                                    <div className='table__custom__cell cell__orden'>{m.numero_de_orden}</div>
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
                                            {/* Botones */}
                                            <div className='table__custom__row--btnadd d-flex flex-column'>
                                                <button onClick={handleNewMuestra} className='btn__addMuestra btn btn-outline-success btn-sm rounded-pill px-3 mb-2 fw-medium'><i className="bi bi-plus me-1"></i>Crear una muestra</button>
                                                <p className='mb-2'>ó suba un archivo excel:</p>
                                                <div className='d-flex flex-row align-items-center mb-2'>
                                                    <p className='mb-0 me-2'><b>Descargue una plantilla aquí:</b></p>
                                                    <a href={excel} download="muestras-ejemplo.xlsx" className='btn btn-warning text-white btn-sm rounded-pill px-3 fw-medium'>Descargar</a>
                                                </div>
                                                <div className='d-flex flex-row align-items-center'>
                                                    <input type='file' onChange={changeHandler} className='btn__file me-2'/>
                                                    <button onClick={handleSubmission} className='btn btn-success btn-sm rounded-pill px-3 fw-medium me-2'>
                                                        <i className="bi bi-upload me-2"></i>
                                                        Subir excel
                                                    </button>
                                                </div>
                                                {errorExcel && <p>{errorExcel}</p>}
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