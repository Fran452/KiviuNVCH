import React, { useState, useEffect, useContext } from 'react'
import { Modal, ProgressBar } from 'react-bootstrap';
import "./ModalPlanes.scss"
import { jwtDecode } from "jwt-decode"
import { loadingContext } from '../pages/PlanesAccion/PlanesAccion';

function ModalPlanes(props) {
  const { handleUpdate, tareaObj, setTareaObj } = useContext(loadingContext)
  const auth = localStorage.getItem("token")
  const jwtParse = jwtDecode(auth)

  // State
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    responsable: "",
    equipo: "",
    estado: "",
    prioridad: "",
    notas: "",
    progreso: 0
  })
  const [errors, setErrors] = useState({})
  const [modalErr, setModalErr] = useState(null)

  // Obtener áreas
  const fetchAreas = async () => {
    try {
      const res = await fetch("http://localhost:3030/apis/index",{
        method: "GET"
      })
      const data = await res.json()
      setAreas(data.objeto.areas)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(tareaObj){
      const obj = JSON.parse(tareaObj)
      setFormData({
        nombre: obj.nombre,
        fechaInicio: obj.fecha_inicio,
        fechaFinal: obj.fecha_final,
        responsable: obj.Empleados.mail,
        equipo: obj.AreasApollo.nombre_del_Area,
        estado: obj.estado.toString(),
        prioridad: obj.prioridad.toString(),
        notas: obj.notas,
        progreso: obj.progreso,
      })
    }
    fetchAreas()
  }, [tareaObj])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })

  }
    
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm(formData);
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0){
      const obj = {
        empleado_asignado: formData.responsable,
        user: jwtParse.apirest.objeto,
        nombre: formData.nombre,
        estado: parseInt(formData.estado),
        prioridad: parseInt(formData.prioridad),
        fechaInicio: formData.fechaInicio,
        fechaFinal: formData.fechaFinal,
        notas: formData.notas,
        areaApoyo: formData.equipo,
        progreso: parseInt(formData.progreso)
      }

      try {
        const res = await fetch("http://164.92.77.143:3030/apis/plan-accion/addTask", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(obj)
        })
        const data = await res.json()
        if(data.error !== 0) {
          handleUpdate(false)
          setModalErr(data.errorDetalle)
        } else {
          setFormData({
            nombre: "",
            fechaInicio: "",
            fechaFinal: "",
            responsable: "",
            equipo: "",
            estado: "",
            prioridad: "",
            notas:"",
            progreso: 0
          })
          setModalErr(null)
          handleUpdate(true)
          props.onHide()
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("Form no enviado")
    }
  }

  const validateForm = (data) => {
    const errors = {}

    if(!data.nombre.trim()) {
      errors.nombre = "Escoja un nombre."
    }
    if(!data.fechaInicio.trim()) {
      errors.fechaInicio = "Escoja una fecha de inicio."
    }
    if(!data.fechaFinal.trim()) {
      errors.fechaFinal = "Escoja una fecha de término."
    }
    if(!data.responsable.trim()) {
      errors.responsable = "Escriba el mail."
    } else if (!/\S+@\S+\.\S+/.test(data.responsable)){
      errors.responsable = "El email no es válido."
    }
    if(!data.equipo.trim()) {
      errors.equipo = "Escoje un equipo de apoyo."
    }
    if(!data.estado.trim()) {
      errors.estado = "Marca una opción."
    }
    if(!data.prioridad.trim()) {
      errors.prioridad = "Marca una opción."
    }
    if(isNaN(data.progreso) === true || data.progreso === 0) {
      errors.progreso = "Escoge un valor."
    }
    if(!data.notas.trim()) {
      errors.notas = "Escribe una nota."
    }
    return errors;
  }

  const handleClose = () => {
    setErrors({})
    setFormData({
      nombre: "",
      fechaInicio: "",
      fechaFinal: "",
      responsable: "",
      equipo: "",
      estado: "",
      prioridad: "",
      notas: "",
      progreso: 0
    })
    props.onHide()
    setTareaObj(null)
    setModalErr(null)
  }

  const handleChangeTask = async (e) => {
    e.preventDefault()
    const newErrors = validateForm(formData);
    setErrors(newErrors)
    const task = JSON.parse(tareaObj)
    if (Object.keys(newErrors).length === 0){
      const obj = {
        empleado_asignado: formData.responsable,
        user: jwtParse.apirest.objeto,
        nombre: formData.nombre,
        estado: parseInt(formData.estado),
        prioridad: parseInt(formData.prioridad),
        fechaInicio: formData.fechaInicio,
        fechaFinal: formData.fechaFinal,
        notas: formData.notas,
        areaApoyo: formData.equipo,
        idTarea: task.id_tarea,
        progreso: parseInt(formData.progreso)
      }
      try {
        const res = await fetch("http://localhost:3030/apis/plan-accion/modTask", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(obj)
        })
        const data = await res.json()
        if(data.error !== 0) {
          handleUpdate(false)
          setModalErr(data.errorDetalle)
        } else {
          setFormData({
            nombre: "",
            fechaInicio: "",
            fechaFinal: "",
            responsable: "",
            equipo: "",
            estado: "",
            prioridad: "",
            notas:"",
            progreso: 0
          })
          setModalErr(null)
          handleUpdate(true)
          props.onHide()
          setTareaObj(null)
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("Form no actualizado")
    }
  }

  const handleDecrease = (e) => {
    e.preventDefault()
    if(formData.progreso === 0){
      setFormData({
        ...formData,
        progreso: 0
      })
    } else {
      setFormData({
        ...formData,
        progreso: formData.progreso - 10
      })
    }
  }
  const handleIncrese = (e) => {
    e.preventDefault()
    if(formData.progreso === 100){
      setFormData({
        ...formData,
        progreso: 100
      })
    } else {
      setFormData({
        ...formData,
        progreso: formData.progreso + 10
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
        <Modal.Title id="contained-modal-title-vcenter d-flex flex-row">
          {tareaObj ? <h3 className='m-0'>Modificar Tarea</h3>: <h3 className='m-0'>Crear Tarea</h3>}
          <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {tareaObj ? (
          <form className='formPA d-flex flex-column' onSubmit={handleChangeTask}>
          <div className='mb-2'>
            <label className='mb-1'>Nombre</label>
            <input
              onChange={handleChange}
              type="text" 
              id="nombre" 
              name="nombre" 
              autoFocus
              className="form-control form-control-sm col-12"
              value={formData.nombre}
            />
            {errors.nombre && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.nombre}</span>}
          </div>
          <div className='row mb-2'>
            <div className='col-6'>
              <label className='mb-1'>Fecha de inicio</label>
              <input
                onChange={handleChange}
                type="date" 
                id="fechaInicio" 
                name="fechaInicio" 
                className="form-control form-control-sm"
                value={formData.fechaInicio}
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
                value={formData.fechaFinal}
              />
              {errors.fechaFinal && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.fechaFinal}</span>}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className='mb-1'>Correo del responsable</label>
              <input
                onChange={handleChange}
                type="email" 
                id="responsable" 
                name="responsable" 
                placeholder="usuario@correo.com.ar" 
                className="form-control form-control-sm col-12"
                value={formData.responsable}
              />
              {errors.responsable && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.responsable}</span>}
            </div>
            <div className="col-6">
              <label className='mb-1'>Equipo</label>
              <select className="form-select form-select-sm" id="equipo" name="equipo" onChange={handleChange} value={formData.equipo}>
                <option value="">Elija el equipo de apoyo</option>
                {areas.map((e,i) => {
                  return <option key={i} value={e.nombre_del_Area}>{e.nombre_del_Area}</option>
                })}
              </select>
              {errors.equipo && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.equipo}</span>}
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-12 col-md-6'>
                <label className='mb-1'>Prioridad</label>
                <div className='d-flex flex-row'>
                  <div className="form-check me-3">
                      <input 
                          className="form-check-input" 
                          type="radio" 
                          name="prioridad" 
                          value="1"
                          checked={formData.prioridad === "1"}
                          onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">Baja</label>
                  </div>
                  <div className="form-check me-3">
                      <input 
                          className="form-check-input" 
                          type="radio" 
                          name="prioridad" 
                          value="2" 
                          checked={formData.prioridad === "2"}
                          onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">Media</label>
                  </div>
                  <div className="form-check">
                      <input 
                          className="form-check-input" 
                          type="radio" 
                          name="prioridad" 
                          value="3" 
                          checked={formData.prioridad === "3"}
                          onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="flexRadioDefault3">Alta</label>
                  </div>
                </div>
              {errors.prioridad && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.prioridad}</span>}
            </div>
            <div className="col-12 col-md-6">
                <label className='mb-1'>Estado</label>
                <select className="form-select form-select-sm" id="estado" name="estado" onChange={handleChange} value={formData.estado}>
                  <option value="">Elija el estado</option>
                  <option value="1">Pendiente</option>
                  <option value="2">En progreso</option>
                  <option value="3">Completada</option>
                  <option value="4">En espera</option>
                  <option value="5">Cancelada</option>
                  <option value="6">Bloqueada</option>
                </select>
              {errors.estado && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.estado}</span>}
            </div>
          </div>
          <div className='col-12 col-md-6 mb-2'>
            <label className='mb-1'>Progreso de la tarea</label>
            <div className="formPA__progressBar d-flex flex-row align-items-center justify-content-between">
              <button className='btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center' onClick={handleDecrease}><i className="bi bi-dash"></i></button>
              <ProgressBar className='formPA__progressBar__bar' now={formData.progreso} label={`${formData.progreso}%`} max={100}/>
              <button className='btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center' onClick={handleIncrese}><i className="bi bi-plus"></i></button>
            </div>
            {errors.progreso && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.progreso}</span>}
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
              value={formData.notas}
            >
            </textarea>
            {errors.notas && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.notas}</span>}
          </div>
          {modalErr !== null && <span className='align-self-center text-danger my-2'><i className="bi bi-exclamation-circle me-1"></i>{modalErr}</span>}
          <button type="submit" className='formPA__btn btn btn-primary rounded-pill shadow-sm fw-medium align-self-center'>
              Modificar tarea
          </button>
        </form>
        ) : (
          <form className='formPA d-flex flex-column' onSubmit={handleSubmit}>
            <div className='mb-2'>
              <label className='mb-1'>Nombre</label>
              <input
                onChange={handleChange}
                type="text" 
                id="nombre" 
                name="nombre" 
                autoFocus
                className="form-control form-control-sm col-12"
                value={formData.nombre}
              />
              {errors.nombre && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.nombre}</span>}
            </div>
            <div className='row mb-2'>
              <div className='col-6'>
                <label className='mb-1'>Fecha de inicio</label>
                <input
                  onChange={handleChange}
                  type="date" 
                  id="fechaInicio" 
                  name="fechaInicio" 
                  className="form-control form-control-sm"
                  value={formData.fechaInicio}
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
                  value={formData.fechaFinal}
                />
                {errors.fechaFinal && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.fechaFinal}</span>}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-1'>Correo del responsable</label>
                <input
                  onChange={handleChange}
                  type="email" 
                  id="responsable" 
                  name="responsable" 
                  placeholder="usuario@correo.com.ar" 
                  className="form-control form-control-sm col-12"
                  value={formData.responsable}
                />
                {errors.responsable && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.responsable}</span>}
              </div>
              <div className="col-6">
                <label className='mb-1'>Equipo</label>
                <select className="form-select form-select-sm" id="equipo" name="equipo" onChange={handleChange} value={formData.equipo}>
                  <option value="">Elija el equipo de apoyo</option>
                  {areas.map((e,i) => {
                    return <option key={i} value={e.nombre_del_Area}>{e.nombre_del_Area}</option>
                  })}
                </select>
                {errors.equipo && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.equipo}</span>}
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-12 col-md-6'>
                    <label className='mb-1'>Prioridad</label>
                    <div className='d-flex flex-row'>
                      <div className="form-check me-3">
                          <input 
                              className="form-check-input" 
                              type="radio" 
                              name="prioridad" 
                              value="1"
                              checked={formData.prioridad === "1"}
                              onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefault1">Baja</label>
                      </div>
                      <div className="form-check me-3">
                          <input 
                              className="form-check-input" 
                              type="radio" 
                              name="prioridad" 
                              value="2" 
                              checked={formData.prioridad === "2"}
                              onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefault2">Media</label>
                      </div>
                      <div className="form-check">
                          <input 
                              className="form-check-input" 
                              type="radio" 
                              name="prioridad" 
                              value="3" 
                              checked={formData.prioridad === "3"}
                              onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefault3">Alta</label>
                      </div>
                    </div>
                  {errors.prioridad && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.prioridad}</span>}
              </div>
              <div className="col-12 col-md-6">
                  <label className='mb-1'>Estado</label>
                  <select className="form-select form-select-sm" id="estado" name="estado" onChange={handleChange} value={formData.estado}>
                    <option value="">Elija el estado</option>
                    <option value="1">Pendiente</option>
                    <option value="2">En progreso</option>
                    <option value="3">Completada</option>
                    <option value="4">En espera</option>
                    <option value="5">Cancelada</option>
                    <option value="6">Bloqueada</option>
                  </select>
                {errors.estado && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.estado}</span>}
              </div>
            </div>
            <div className='col-12 col-md-6 mb-2'>
              <label className='mb-1'>Progreso de la tarea</label>
              <div className="formPA__progressBar d-flex flex-row align-items-center justify-content-between">
                <button className='btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center' onClick={handleDecrease}><i className="bi bi-dash"></i></button>
                <ProgressBar className='formPA__progressBar__bar' now={formData.progreso} label={`${formData.progreso}%`} max={100}/>
                <button className='btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center' onClick={handleIncrese}><i className="bi bi-plus"></i></button>
              </div>
              {errors.progreso && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.progreso}</span>}
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
                value={formData.notas}
              >
              </textarea>
              {errors.notas && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.notas}</span>}
            </div>
            {modalErr !== null && <span className='align-self-center text-danger my-2'><i className="bi bi-exclamation-circle me-1"></i>{modalErr}</span>}
            <button type="submit" className='formPA__btn btn btn-primary rounded-pill shadow-sm fw-medium align-self-center'>
                Agregar tarea
            </button>
          </form>
        )}
        </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={handleSubmit}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  )
}

export default ModalPlanes