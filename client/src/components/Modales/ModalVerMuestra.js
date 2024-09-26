import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { muestrasContext } from '../Muestras';
import './ModalVer.scss'
import { Oval } from 'react-loader-spinner'

function ModalVerMuestra(props) {
    const { muestraObj, setMuestraObj } = useContext(muestrasContext)
    const [objSelec, setObjSelec] = useState({
        orden: 0,
        titulo: "",
        responsable: "",
        horas: 0,
        avance: 0,
        notas: ""
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(muestraObj){
            setLoading(false)
            const obj = JSON.parse(muestraObj)
            setObjSelec({
                orden: obj.numero_de_orden,
                titulo: obj.titulo,
                responsable: obj.Empleados.mail,
                horas: obj.horasAprox,
                avance: obj.avance,
                notas: obj.notas
            })
        }
    },[muestraObj])

    const handleClose = () => {
        setObjSelec({
            orden: 0,
            titulo: "",
            responsable: "",
            horas: 0,
            avance: 0,
            notas: ""
        })
        props.onHide()
        setMuestraObj(null)
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
                <h3 className='m-0'>Detalles de la muestra</h3>
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
                        <h3 className='modal__ver__nombre'>{objSelec.titulo}</h3>
                        <div className='modal__ver__info'>
                            <div className='d-flex flex-column'>
                                <p>Progreso de la tarea: {Math.round(objSelec.avance)}%</p>
                                <p>Horas aprox.: {objSelec.horas} hs</p>
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

export default ModalVerMuestra