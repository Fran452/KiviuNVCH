import React, { useState, useEffect, useContext } from 'react'
import { Modal } from 'react-bootstrap';
import "./ModalProyecto.scss"
import { tareasContext } from '../Tareas';
import { newContext } from '../../pages/PlanesAccion/Ciclo';

function ModalEditProyecto(props) {
    const { procesos, setProcesos, fetchProcesos, setTitleProyecto, setDescripcionProyecto } = useContext(newContext)
    const { proyectoSelec, setProyectoSelec } = useContext(tareasContext)

    const [formProceso, setFormProceso] = useState({
        nombre: "",
        detalles: "",
        fechaInicio: "",
        fechaFinal: "",
    })
    const [errors, setErrors] = useState({})
    const [errorFetch, setErrorFetch] = useState(null)

    useEffect(() => {
        if(proyectoSelec){
            const pro = JSON.parse(proyectoSelec)
            const obj = procesos.find((e) => e.id_proyecto === pro.id_proyecto)
            setFormProceso({
                nombre: obj.nombre,
                detalles: obj.detalles,
                fechaInicio: obj.fecha_inicio,
                fechaFinal: obj.fecha_final,
            })
        }
    },[proyectoSelec, procesos])

    const handleClose = () => {
        setErrors({})
        setFormProceso({
            nombre: "",
            detalles: "",
            fechaInicio: "",
            fechaFinal: ""
        })
        setProyectoSelec(null)
        setErrorFetch(null)
        props.onHide()
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormProceso({
        ...formProceso,
        [name]: value,
        })
    }

    const validateForm = (data) => {
        const errors = {}
        if(!data.nombre.trim()) {
            errors.nombre = "Escoja un nombre"
        }
        if(!data.detalles.trim()) {
            errors.detalles = "Escoja una descripción"
        }
        if(!data.fechaInicio.trim()) {
            errors.fechaInicio = "Escoja una fecha de inicio."
        }
        if(!data.fechaFinal.trim()) {
            errors.fechaFinal = "Escoja una fecha de término."
        }
        return errors;
    }

    const handleChangeProyecto = async (e) => {
        e.preventDefault()
        const newErrors = validateForm(formProceso)
        setErrors(newErrors)
        const pro = JSON.parse(proyectoSelec)
        if (Object.keys(newErrors).length === 0){
            try {
                const res = await fetch("http://localhost:3030/apis/plan-accion/modProceso", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idProceso: pro.id_procesos,
                        nombre: formProceso.nombre,
                        detalles: formProceso.detalles,
                        fecha_inicio: formProceso.fechaInicio,
                        fecha_final: formProceso.fechaFinal,
                    })
                })
                const data = await res.json()
                if(data.error !== 0){
                    setErrorFetch(data.errorDetalle)
                } else {
                    setFormProceso({
                        nombre: "",
                        detalles: "",
                        fechaInicio: "",
                        fechaFinal: "",
                    })
                    setErrorFetch(null)
                    setProyectoSelec(null)
                    setTitleProyecto(formProceso.nombre)
                    setDescripcionProyecto(formProceso.detalles)
                    fetchProcesos().then(res => setProcesos(res.objeto))
                    props.onHide()
                }
            } catch (error) {
                setErrorFetch(error)
            }
        }
    }

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            className='modal__proyectos'
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter" className='d-flex flex-row'>
                    <h3 className='m-0'>Modificar Proceso</h3>
                    <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form__proyectos d-flex flex-column' onSubmit={handleChangeProyecto}>
                    <div className='mb-2 col-12'>
                        <label className='mb-1'>Nombre del Proceso</label>
                        <input 
                            onChange={handleChange}
                            type="text" 
                            id="nombre"
                            name='nombre'
                            autoFocus
                            className="form-control form-control-sm"
                            value={formProceso.nombre}
                        />
                        {errors.nombre && <span className='form__proyectos__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.nombre}</span>}
                    </div>
                    <div className='mb-2 col-12'>
                        <label className='mb-1'>Descripción del Proceso</label>
                        <input 
                            onChange={handleChange}
                            type="text" 
                            id="detalles"
                            name='detalles'
                            className="form-control form-control-sm"
                            value={formProceso.detalles}
                        />
                        {errors.detalles && <span className='form__proyectos__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.detalles}</span>}
                    </div>
                    {/* Agregar fecha inicio y final */}
                    <div className='row mb-4'>
                        <div className='col-6'>
                            <label className='mb-1'>Fecha de inicio</label>
                            <input
                                onChange={handleChange}
                                type="date" 
                                id="fechaInicio" 
                                name="fechaInicio" 
                                className="form-control form-control-sm"
                                value={formProceso.fechaInicio}
                            />
                            {errors.fechaInicio && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.fechaInicio}</span>}
                        </div>
                        <div className='col-6'>
                            <label className='mb-1'>Fecha de término</label>
                            <input
                                onChange={handleChange}
                                type="date" 
                                id="fechaFinal" 
                                name="fechaFinal" 
                                className="form-control form-control-sm"
                                value={formProceso.fechaFinal}
                            />
                            {errors.fechaFinal && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.fechaFinal}</span>}
                        </div>
                    </div>
                    {errorFetch !== null && <span className='align-self-center text-danger my-2'><i className="bi bi-exclamation-circle me-1"></i>{errorFetch}</span>}
                    <button type='submit' className='btn btn-primary rounded-pill form__proyectos__btn align-self-center'>
                        Modificar proyecto
                    </button>
                </form>
            </Modal.Body>
        </Modal>
    )
    }

export default ModalEditProyecto