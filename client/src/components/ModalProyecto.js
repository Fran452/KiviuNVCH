import React, { useState, useEffect, useContext } from 'react'
import { Modal } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode"
import "./ModalProyecto.scss"
import { loadingContext } from '../pages/PlanesAccion/PlanesAccion';

function ModalProyecto(props) {
    const { setTitleProyecto, proyectoObj, setProyectoObj } = useContext(loadingContext)
    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)

    const [formProyecto, setFormProyecto] = useState({
        nombre: "",
        detalles: ""
    })

    useEffect(() => {
        if(proyectoObj){
            const obj = JSON.parse(proyectoObj)
            setFormProyecto({
                nombre: obj.nombre,
                detalles: obj.detalles
            })
        }
    },[proyectoObj])

    const handleClose = () => {
        setFormProyecto({
            nombre: "",
            detalles: ""
        })
        props.onHide()
        setProyectoObj(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
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
              props.onHide()
              console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormProyecto({
        ...formProyecto,
        [name]: value,
        })
    }

    const handleChangeProyecto = async (e) => {
        e.preventDefault()
        const proyecto = JSON.parse(proyectoObj)
        try {
            const res = await fetch("http://164.92.77.143:3030/apis/plan-accion/modProyect", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idProyecto: proyecto.id_proyecto,
                    nombre: formProyecto.nombre,
                    detalles: formProyecto.detalles
                })
            })
            const data = await res.json()
            if(data.error !== 0){
                console.log(data)
            } else {
                setFormProyecto({
                    nombre: "",
                    detalles: ""
                })
                setTitleProyecto(formProyecto.nombre)
                props.onHide()
                setProyectoObj(null)
            }
        } catch (error) {
            console.log(error)
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
                    {proyectoObj ? <h3 className='m-0'>Modificar Proyecto</h3>: <h3 className='m-0'>Crear Proyecto</h3>}
                    <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {proyectoObj ? (
                    <form className='form__proyectos d-flex flex-column align-items-center' onSubmit={handleChangeProyecto}>
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
                        </div>
                        <button type='submit' className='btn btn-primary rounded-pill form__proyectos__btn'>
                            Modificar proyecto
                        </button>
                    </form>
                ) : (
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
                        </div>
                        <button type='submit' className='btn btn-primary rounded-pill form__proyectos__btn'>
                            Agregar proyecto
                        </button>
                    </form>
                )}
                
            </Modal.Body>
        </Modal>
    )
    }

export default ModalProyecto