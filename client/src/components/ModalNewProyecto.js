import React, { useState, useEffect, useContext } from 'react'
import { Modal } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode"
import "./ModalProyecto.scss"
import { newContext } from '../pages/PlanesAccion/PlanesAccion';

function ModalNewProyecto(props) {
    const { proyectos, handleUpdate } = useContext(newContext)
    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)

    const [formProyecto, setFormProyecto] = useState({
        nombre: "",
        detalles: ""
    })
    const [errors, setErrors] = useState({})
    const [errorFetch, setErrorFetch] = useState(null)

    useEffect(() => {

    },[proyectos])

    const handleClose = () => {
        setErrors({})
        setFormProyecto({
            nombre: "",
            detalles: ""
        })
        setErrorFetch(null)
        props.onHide()
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormProyecto({
        ...formProyecto,
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
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validateForm(formProyecto)
        setErrors(newErrors)
        if (Object.keys(newErrors).length === 0){
            try {
                const res = await fetch("http://164.92.77.143:3030/apis/plan-accion/addProyect", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user: jwtParse.apirest.objeto,
                        nombre: formProyecto.nombre,
                        detalles: formProyecto.detalles
                    })
                })
                const data = await res.json()
                if(data.error !== 0){
                    setErrorFetch(data.errorDetalle)
                } else {
                    handleUpdate(true)
                    setFormProyecto({
                        nombre: "",
                        detalles: ""
                    })
                    setErrorFetch(null)
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
                    <h3 className='m-0'>Crear Proyecto</h3>
                    <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form__proyectos d-flex flex-column align-items-center' onSubmit={handleSubmit}>
                    <div className='mb-2 col-12'>
                        <label className='mb-1'>Nombre del Proyecto</label>
                        <input 
                            onChange={handleChange}
                            type="text" 
                            id="nombre"
                            name='nombre'
                            autoFocus
                            className="form-control form-control-sm"
                            value={formProyecto.nombre}
                        />
                        {errors.nombre && <span className='form__proyectos__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.nombre}</span>}
                    </div>
                    <div className='mb-2 col-12'>
                        <label className='mb-1'>Descripción del Proyecto</label>
                        <input 
                            onChange={handleChange}
                            type="text" 
                            id="detalles"
                            name='detalles'
                            className="form-control form-control-sm"
                            value={formProyecto.detalles}
                        />
                        {errors.detalles && <span className='form__proyectos__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.detalles}</span>}
                    </div>
                    {errorFetch !== null && <span className='align-self-center text-danger my-2'><i className="bi bi-exclamation-circle me-1"></i>{errorFetch}</span>}
                    <button type='submit' className='btn btn-primary rounded-pill form__proyectos__btn'>
                        Agregar proyecto
                    </button>
                </form>
            </Modal.Body>
        </Modal>
    )
    }

export default ModalNewProyecto