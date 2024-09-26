import React, { useState, useContext, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import { DataInContext } from '../../context/DataInContext'
import { jwtDecode } from "jwt-decode"

function ModalEditIndicador(props) {
    const { editIndicador, setLoading, fetchIndicadores, setError, setIndicadores } = useContext(DataInContext)

    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)
    const USER = jwtParse.apirest.objeto

    const [userDatos, setUserDatos] = useState({
        area: "",
        indicador: "",
        descripcion: "",
        frecuencia: "",
        responsable: "",
        suplente: ""
    })
    const [errores, setErrores] = useState({})
    const [objInicial, setObjInicial] = useState(null)

    useEffect(() => {
        if(editIndicador) {
            const obj = JSON.parse(editIndicador)
            setObjInicial(obj)
            const frec = obj.tipo_recordartorio.toString()
            setUserDatos({
                area: obj.Areas.nombre_del_Area,
                indicador: obj.nombre_indicador,
                descripcion: obj.detalles_metrica,
                frecuencia: frec,
                responsable: obj.Empleados.mail,
                suplente: obj.ResponsableSuplente.mail
            })
        }
    },[editIndicador])
    

    const validateFormDatos = (data) => {
        const errors = {}
    
        if(!data.area.trim()) {
            errors.area = "Escriba el nombre del Área o Proyecto."
        }
        if(!data.indicador.trim()) {
            errors.indicador = "Escriba un nombre para el indicador."
        }
        if(!data.descripcion.trim()) {
            errors.descripcion = "Escriba un texto para la descripcion."
        }
        if(!data.frecuencia.trim()) {
            errors.frecuencia = "Elija una frecuencia."
        }
        if(!data.responsable.trim()) {
            errors.responsable = "Escriba el mail."
        } else if (!/\S+@\S+\.\S+/.test(data.responsable)){
            errors.responsable = "El email no es válido."
        }
        if(!data.suplente.trim()) {
            errors.suplente = "Escriba el mail."
        } else if (!/\S+@\S+\.\S+/.test(data.suplente)){
            errors.suplente = "El email no es válido."
        }
        return errors;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDatos({
          ...userDatos,
          [name]: value,
        })
      }
    
    const handleClose = () => {
        props.onHide()
        setUserDatos({
            area: "",
            indicador: "",
            descripcion: "",
            frecuencia: "",
            responsable: "",
            suplente: ""
        })
        setErrores({})
    }

    const handleChangeIndicador = async (e) => {
        e.preventDefault()
        const newErrors = validateFormDatos(userDatos);
        setErrores(newErrors)
        if (Object.keys(newErrors).length === 0){
            const objInd = {
                user: USER,
                indicador: objInicial,
                area: userDatos.area,
                nombre_indicador: userDatos.indicador,
                detalles_metrica: userDatos.descripcion,
                tipo_recordartorio: parseInt(userDatos.frecuencia),
                responsable: userDatos.responsable,
                empleadoSuplente: userDatos.suplente
            }
            try {
                const res = await fetch("http://164.92.77.143:3040/apis/dateIn/editIndicador", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(objInd)
                })
                const data = await res.json()
                if(data.error !== 0){
                    console.log(objInd)
                    console.log(data.errorDetalle)
                } else {
                    handleClose()
                    setObjInicial(null)
                    setLoading(true)
                    fetchIndicadores()
                    .then(res => {
                        if(res.error !== 0){
                            setLoading(false)
                            setError(res.errorDetalle)
                        } else {
                            setLoading(false)
                            setIndicadores(res.objeto)
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Completar los campos.")
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
                    <h3 className='m-0'>Modificar Indicador</h3>
                    <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleChangeIndicador} className='d-flex flex-column align-items-center'>
                    <div className='form__datos w-100 mb-4'>
                        {/* Area o proyecto */}
                        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
                            <label className='me-1 col-12 col-md-3 col-form-label'>Área o proyecto</label>
                            <div className='d-flex flex-column col-12 col-md-9'>
                                <input
                                    onChange={handleChange}
                                    type="text"  
                                    name="area" 
                                    autoFocus
                                    className="form-control form-control-sm"
                                    value={userDatos.area}
                                />
                                {errores.area && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errores.area}</span>}
                            </div>
                        </div>
                        {/* Nombre del indicador */}
                        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
                            <label className='me-1 col-12 col-md-3 col-form-label'>Nombre del indicador</label>
                            <div className='d-flex flex-column col-12 col-md-9'>
                                    <input
                                    onChange={handleChange}
                                    type="text"  
                                    name="indicador" 
                                    className="form-control form-control-sm"
                                    value={userDatos.indicador}
                                />
                                {errores.indicador && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errores.indicador}</span>}
                            </div>
                        </div>
                        {/* Descripción del indicador */}
                        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
                            <label className='me-1 col-12 col-md-3 col-form-label'>Descripción del indicador</label>
                            <div className='d-flex flex-column col-12 col-md-9'>
                                <input
                                    onChange={handleChange}
                                    type="text"  
                                    name="descripcion" 
                                    className="form-control form-control-sm"
                                    value={userDatos.descripcion}
                                />
                                {errores.descripcion && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errores.descripcion}</span>}
                            </div>
                        </div>
                        {/* Frecuencia de carga */}
                        <div className="d-flex flex-column flex-md-row align-items-center mb-2">
                            <label className='me-1 col-12 col-md-3 col-form-label'>Frecuencia</label>
                            <div className='d-flex flex-column col-12 col-md-3'>
                                <select 
                                    className="form-select form-select-sm" 
                                    name="frecuencia" 
                                    onChange={handleChange} 
                                    value={userDatos.frecuencia}
                                >
                                    <option value="">Elija la frecuencia</option>
                                    <option value="1">Semanal</option>
                                    <option value="2">Quincenal</option>
                                    <option value="3">Mensual</option>
                                    <option value="4">Trimestral</option>
                                </select>
                                {errores.frecuencia && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errores.frecuencia}</span>}
                            </div>
                        </div>
                        {/* Email del responsable */}
                        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
                            <label className='me-1 col-12 col-md-3 col-form-label'>Responsable</label>
                            <div className='d-flex flex-column col-12 col-md-9'>
                                <input
                                    onChange={handleChange}
                                    type="email"  
                                    name="responsable" 
                                    placeholder="usuario@correo.com.ar"
                                    className="form-control form-control-sm"
                                    value={userDatos.responsable}
                                />
                                {errores.responsable && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errores.responsable}</span>}
                            </div>
                        </div>
                        {/* Email del suplente */}
                        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
                            <label className='me-1 col-12 col-md-3 col-form-label'>Responsable suplente</label>
                            <div className='d-flex flex-column col-12 col-md-9'>
                                <input
                                    onChange={handleChange}
                                    type="email"  
                                    name="suplente" 
                                    placeholder="usuario@correo.com.ar"
                                    className="form-control form-control-sm"
                                    value={userDatos.suplente}
                                />
                                {errores.suplente && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errores.suplente}</span>}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className='btn btn-primary rounded-pill shadow-sm fw-medium align-self-center'>
                        Modificar Indicador
                    </button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalEditIndicador