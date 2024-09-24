import React, { useState, useEffect, useContext } from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';
import { subtareasContext } from '../Subtareas';
import { muestrasContext } from '../Muestras'
import { newContext } from '../../pages/PlanesAccion/Ciclo'

function ModalMuestra(props) {
    const { USER } = useContext(newContext)
    const { 
        fetchMetrica, 
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
        setSubtareas
    } = useContext(subtareasContext)
    
    const { 
        idSubtask, 
        muestraObj, 
        setMuestraObj,
        setLoadingMuestra,
        fetchMuestrasById,
        setErrorMuestra,
        setMuestras
    } = useContext(muestrasContext)

    const [formMuestra, setFormMuestra] = useState({
        orden: 0,
        titulo: "",
        responsable: "",
        horas: 0,
        avance: 0,
        notas: ""
    })
    const [errors, setErrors] = useState({})
    const [modalErr, setModalErr] = useState(null)

    useEffect(() => {

    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormMuestra({
          ...formMuestra,
          [name]: value,
        })
    }

    const validateForm = (data) => {
        const errors = {}
    
        if(isNaN(data.orden) === true || data.orden === 0) {
            errors.orden = "Define el número de un orden"
          }
        if(!data.titulo.trim()) {
          errors.titulo = "Escoja un nombre."
        }
        if(!data.responsable.trim()) {
          errors.responsable = "Escriba el mail."
        } else if (!/\S+@\S+\.\S+/.test(data.responsable)){
          errors.responsable = "El email no es válido."
        }
        if(isNaN(data.horas) === true || data.horas === 0) {
          errors.horas = "Define una cantidad de horas."
        }
        // if(isNaN(data.avance) === true || data.avance === 0) {
        //   errors.avance = "Escoge un valor."
        // }
        if(!data.notas.trim()) {
          errors.notas = "Escribe una nota."
        }
        return errors;
    }

    const handleClose = () => {
        setErrors({})
        setModalErr(null)
        setFormMuestra({
            orden: 0,
            titulo: "",
            responsable: "",
            horas: 0,
            avance: 0,
            notas: ""
        })
        props.onHide()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validateForm(formMuestra);
        setErrors(newErrors)
        //
        if (Object.keys(newErrors).length === 0){
            const obj = {
                id_Subtareas: idSubtask,
                numero_de_orden: parseInt(formMuestra.orden),
                titulo: formMuestra.titulo,
                responsable: formMuestra.responsable,
                horasAprox: parseInt(formMuestra.horas),
                avance: parseInt(formMuestra.avance),
                notas: formMuestra.notas
            }
            try {
                const res = await fetch("http://localhost:3040/apis/plan-accion/addMuestras", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(obj)
                })
                const data = await res.json()
                if(data.error !== 0) {
                    setModalErr(data.errorDetalle)
                } else {
                    setFormMuestra({
                        orden: 0,
                        titulo: "",
                        responsable: "",
                        horas: 0,
                        avance: 0,
                        notas: ""
                    })
                    setModalErr(null)
                    setMuestraObj(null)
                    props.onHide()
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
                    // fin de actualiza tareas
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
                    // fin de actualiza subtareas
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
                    // fin de actualiza muestras
                }
            } catch (error) {
                setModalErr(error)
            }
        } else {
            setModalErr("Completar los campos mencionados.")
        }
    }

    const handleDecrease = (e) => {
        e.preventDefault()
        if(formMuestra.avance === 0){
          setFormMuestra({
            ...formMuestra,
            avance: 0
          })
        } else {
          setFormMuestra({
            ...formMuestra,
            avance: formMuestra.avance - 10
          })
        }
    }
    const handleIncrese = (e) => {
        e.preventDefault()
        if(formMuestra.avance === 100){
          setFormMuestra({
            ...formMuestra,
            avance: 100
          })
        } else {
          setFormMuestra({
            ...formMuestra,
            avance: formMuestra.avance + 10
          })
        }
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
                    {muestraObj ? <h3 className='m-0'>Modificar Muestra</h3>: <h3 className='m-0'>Agregar Muestra</h3>}
                    <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {muestraObj ? (
                    <h1>Hay una muestra</h1>
                ) : (
                    <form className='formPA d-flex flex-column' onSubmit={handleSubmit}>
                        <div className='mb-2'>
                            <label className='mb-1'>Nombre</label>
                            <input
                                onChange={handleChange}
                                type="text" 
                                id="titulo" 
                                name="titulo" 
                                autoFocus
                                className="form-control form-control-sm col-12"
                                value={formMuestra.titulo}
                            />
                            {errors.titulo && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.titulo}</span>}
                        </div>
                        <div className='row mb-2'>
                            <div className='col-6'>
                                <label className='mb-1'>Correo del responsable</label>
                                <input
                                    onChange={handleChange}
                                    type="email" 
                                    id="responsable" 
                                    name="responsable" 
                                    placeholder="usuario@correo.com.ar" 
                                    className="form-control form-control-sm col-12"
                                    value={formMuestra.responsable}
                                />
                                {errors.responsable && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.responsable}</span>}
                            </div>
                            <div className='col-6'>
                                <label className='mb-1'>Horas</label>
                                <input
                                    onChange={handleChange}
                                    type="number" 
                                    id="horas" 
                                    name="horas" 
                                    className="input--arrows form-control form-control-sm col-12"
                                    value={formMuestra.horas}
                                />
                                {errors.horas && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.horas}</span>}
                            </div>
                        </div>
                        <div className='row mb-2'>
                            <div className='col-6'>
                                <label className='mb-1'>Orden</label>
                                <input
                                    onChange={handleChange}
                                    type="number" 
                                    id="orden" 
                                    name="orden" 
                                    className="input--arrows form-control form-control-sm col-12"
                                    value={formMuestra.orden}
                                />
                                {errors.orden && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.orden}</span>}
                            </div>
                        </div>
                        <div className='mb-2'>
                            <label className='mb-1'>Notas</label>
                            <textarea 
                                onChange={handleChange}
                                id="notas" 
                                name="notas"
                                placeholder="Agrega notas" 
                                rows="3"
                                className="form-control form-control-sm col-12"
                                value={formMuestra.notas}
                            >
                            </textarea>
                            {errors.notas && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.notas}</span>}
                        </div>
                        {modalErr !== null && <span className='align-self-center text-danger my-2'><i className="bi bi-exclamation-circle me-1"></i>{modalErr}</span>}
                        <button type="submit" className='formPAsub__btn btn btn-primary rounded-pill shadow-sm fw-medium align-self-center'>
                            Agregar muestra
                        </button>
                    </form>
                )}
            </Modal.Body>
        </Modal>
    )

}

export default ModalMuestra