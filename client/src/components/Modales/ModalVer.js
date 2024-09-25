import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { tareasContext } from '../Tareas';
import './ModalVer.scss'
import { Oval } from 'react-loader-spinner'

function ModalVer(props) {
    const { tareaObj, setTareaObj } = useContext(tareasContext)
    const [objSelec, setObjSelec] = useState({
        nombre: "",
        prioridad: "",
        estado: "",
        progreso: "",
        horas: "",
        notas: "",
        responsable: "",
        fechaInicio: "",
        fechaFinal: "",
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(tareaObj){
            setLoading(false)
            const obj = JSON.parse(tareaObj)
            setObjSelec({
                nombre: obj.nombre,
                prioridad: obj.prioridad,
                estado: obj.estado,
                progreso: obj.progreso_tarea,
                horas: obj.horas_tarea,
                notas: obj.notas,
                responsable: obj.nombreUser,
                fechaInicio: obj.fecha_inicio,
                fechaFinal: obj.fecha_final
            })
        }
    }, [tareaObj])

    const handleClose = () => {
        setObjSelec({
            nombre: "",
            prioridad: "",
            estado: "",
            progreso: "",
            horas: "",
            notas: "",
            responsable: "",
            fechaInicio: "",
            fechaFinal: "",
        })
        props.onHide()
        setTareaObj(null)
      }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter" className='d-flex flex-row'>
                <h3 className='m-0'>Detalles de la tarea</h3>
                <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className='loading__ver d-flex flex-column align-items-center justify-content-center'>
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
                    <div className='modal__ver d-flex flex-column'>
                        <h3 className='modal__ver__nombre'>{objSelec.nombre}</h3>
                        {objSelec.fechaFinal !== null ? (
                            <p className='text-muted'>Del {objSelec.fechaInicio.replace(/-/g, '/').split("/").reverse().join("/")} al {objSelec.fechaFinal.replace(/-/g, '/').split("/").reverse().join("/")}</p>
                        ) : (
                            <p className='text-muted'>Desde el {objSelec.fechaInicio.replace(/-/g, '/').split("/").reverse().join("/")}</p>
                        )}
                        <div className='modal__ver__info'>
                            <div className='d-flex flex-column'>
                                <p className='modal__ver__prioridad'>Prioridad: 
                                    {objSelec.prioridad === 1 && <span className='ms-2 modal__ver__info__prioridad--baja rounded-pill text-white badge'>baja</span>}
                                    {objSelec.prioridad === 2 && <span className='ms-2 modal__ver__info__prioridad--media rounded-pill text-white badge'>media</span>}
                                    {objSelec.prioridad === 3 && <span className='ms-2 modal__ver__info__prioridad--alta rounded-pill text-white badge'>alta</span>}
                                </p>
                                <p className='modal__ver__estado'>Estado: 
                                    {objSelec.estado === 1 && <span className='ms-2 modal__ver__info__estado--pendiente rounded-pill text-white badge'>Pendiente</span>}
                                    {objSelec.estado === 2 && <span className='ms-2 modal__ver__info__estado--proceso rounded-pill text-white badge'>En proceso</span>}
                                    {objSelec.estado === 3 && <span className='ms-2 modal__ver__info__estado--completada rounded-pill text-white badge'>Completada</span>}
                                    {objSelec.estado === 4 && <span className='ms-2 modal__ver__info__estado--espera rounded-pill text-white badge'>En espera</span>}
                                    {objSelec.estado === 5 && <span className='ms-2 modal__ver__info__estado--cancelada rounded-pill text-white badge'>Cancelada</span>}
                                    {objSelec.estado === 6 && <span className='ms-2 modal__ver__info__estado--bloqueada rounded-pill text-white badge'>Bloqueada</span>}
                                </p>
                                <p>Progreso de la tarea: {Math.round(objSelec.progreso)}%</p>
                                <p>Horas totales: {objSelec.horas} hs</p>
                                <p>Responsable: {objSelec.responsable}</p>
                            </div>
                            <div className='modal__ver__info__notas d-flex flex-column rounded-3'>
                                <h4>Notas:</h4>
                                <p>{objSelec.notas}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default ModalVer