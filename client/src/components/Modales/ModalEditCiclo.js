import React, { useState, useEffect, useContext } from 'react'
import { Modal } from 'react-bootstrap';
import "./ModalProyecto.scss"
import { tareasContext } from '../Tareas';
import { newContext } from '../../pages/PlanesAccion/Ciclo';

function ModalEditCiclo(props) {
    const { ciclos, setCiclos, fetchCiclos, setTitleCiclo, setDescripcionCiclo } = useContext(newContext)
    const { cicloSelec, setCicloSelec } = useContext(tareasContext)

    const [formCiclo, setFormCiclo] = useState({
        nombre: "",
        detalles: "",
        fechaInicio: "",
        fechaFinal: "",
    })
    const [errors, setErrors] = useState({})
    const [errorFetch, setErrorFetch] = useState(null)

    useEffect(() => {
        if(cicloSelec){
            const pro = JSON.parse(cicloSelec)
            const obj = ciclos.find((e) => e.id_ciclo === pro.id_ciclo)
            setFormCiclo({
                nombre: obj.nombre,
                detalles: obj.detalles,
                fechaInicio: obj.fecha_inicio,
                fechaFinal: obj.fecha_final,
            })
        }
    },[cicloSelec, ciclos])

    const handleClose = () => {
        setErrors({})
        setFormCiclo({
            nombre: "",
            detalles: "",
            fechaInicio: "",
            fechaFinal: ""
        })
        setCicloSelec(null)
        setErrorFetch(null)
        props.onHide()
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCiclo({
        ...formCiclo,
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
        const newErrors = validateForm(formCiclo)
        setErrors(newErrors)
        const pro = JSON.parse(cicloSelec)
        if (Object.keys(newErrors).length === 0){
            try {
                const res = await fetch("http://localhost:3030/apis/plan-accion/modCiclos", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_ciclo: pro.id_ciclo,
                        nombre: formCiclo.nombre,
                        detalles: formCiclo.detalles,
                        fechaInicio: formCiclo.fechaInicio,
                        fechaFinal: formCiclo.fechaFinal,
                    })
                })
                const data = await res.json()
                if(data.error !== 0){
                    setErrorFetch(data.errorDetalle)
                } else {
                    setFormCiclo({
                        nombre: "",
                        detalles: "",
                        fechaInicio: "",
                        fechaFinal: "",
                    })
                    setErrorFetch(null)
                    setCicloSelec(null)
                    setTitleCiclo(formCiclo.nombre)
                    setDescripcionCiclo(formCiclo.detalles)
                    fetchCiclos().then(res => setCiclos(res.objeto))
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
                    <h3 className='m-0'>Modificar Ciclo</h3>
                    <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form__proyectos d-flex flex-column' onSubmit={handleChangeProyecto}>
                    <div className='mb-2 col-12'>
                        <label className='mb-1'>Nombre del Ciclo</label>
                        <input 
                            onChange={handleChange}
                            type="text" 
                            id="nombre"
                            name='nombre'
                            autoFocus
                            className="form-control form-control-sm"
                            value={formCiclo.nombre}
                        />
                        {errors.nombre && <span className='form__proyectos__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.nombre}</span>}
                    </div>
                    <div className='mb-2 col-12'>
                        <label className='mb-1'>Descripción del Ciclo</label>
                        <input 
                            onChange={handleChange}
                            type="text" 
                            id="detalles"
                            name='detalles'
                            className="form-control form-control-sm"
                            value={formCiclo.detalles}
                        />
                        {errors.detalles && <span className='form__proyectos__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.detalles}</span>}
                    </div>
                    {/* Agregar fecha inicio y final */}
                    <div className='row mb-4'>
                        <div className='col-6'>
                            <label className='mb-1'>Fecha de inicio</label>
                            <input
                                disabled
                                onChange={handleChange}
                                type="date" 
                                id="fechaInicio" 
                                name="fechaInicio" 
                                className="form-control form-control-sm"
                                value={formCiclo.fechaInicio}
                            />
                            {errors.fechaInicio && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.fechaInicio}</span>}
                        </div>
                        <div className='col-6'>
                            <label className='mb-1'>Fecha de término</label>
                            <input
                                disabled
                                onChange={handleChange}
                                type="date" 
                                id="fechaFinal" 
                                name="fechaFinal" 
                                className="form-control form-control-sm"
                                value={formCiclo.fechaFinal}
                            />
                            {errors.fechaFinal && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.fechaFinal}</span>}
                        </div>
                    </div>
                    {errorFetch !== null && <span className='align-self-center text-danger my-2'><i className="bi bi-exclamation-circle me-1"></i>{errorFetch}</span>}
                    <button type='submit' className='btn btn-primary rounded-pill form__proyectos__btn align-self-center'>
                        Modificar ciclo
                    </button>
                </form>
            </Modal.Body>
        </Modal>
    )
    }

export default ModalEditCiclo