import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import "./ModalPlanes.scss"

function ModalPlanes(props) {
  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    responsable: "",
    equipo: "",
    estado: "",
    prioridad: "",
    notas: ""
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })

  }
    
  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm(formData);
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0){
      setFormData({
        nombre: "",
        fechaInicio: "",
        fechaFinal: "",
        responsable: "",
        equipo: "",
        estado: "",
        prioridad: "",
        notas:""
      })
      console.log(formData)
      props.onHide()
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
      errors.equipo = "Escoje un equipo de apoyo"
    }
    if(!data.estado.trim()) {
      errors.estado = "Marca una opción."
    }
    if(!data.prioridad.trim()) {
      errors.prioridad = "Marca una opción."
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
      notas: ""
    })
    props.onHide()
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
          <h3 className='m-0'>Crear Tarea</h3>
          <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
                  <option selected value="">Elija el equipo de apoyo</option>
                  <option value="0">Finanzas</option>
                  <option value="1">Recursos humanos</option>
                  <option value="2">Ventas</option>
                </select>
                {errors.equipo && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.equipo}</span>}
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-6'>
                <div className='' onChange={handleChange} value={formData.prioridad}>
                    <label className='mb-1'>Prioridad</label>
                    <div className='d-flex flex-row'>
                      <div className="form-check me-3">
                          <input 
                              className="form-check-input" 
                              type="radio" 
                              name="prioridad" 
                              value="1"
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefault1">Baja</label>
                      </div>
                      <div className="form-check me-3">
                          <input 
                              className="form-check-input" 
                              type="radio" 
                              name="prioridad" 
                              value="2" 
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefault2">Media</label>
                      </div>
                      <div className="form-check">
                          <input 
                              className="form-check-input" 
                              type="radio" 
                              name="prioridad" 
                              value="3" 
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefault3">Alta</label>
                      </div>
                    </div>
                  {errors.prioridad && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.prioridad}</span>}
                </div>
              </div>
              <div className="col-6">
                  <label className='mb-1'>Estado</label>
                  <select className="form-select form-select-sm" id="estado" name="estado" onChange={handleChange} value={formData.estado}>
                    <option selected value="">Elija el estado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Completada">Completada</option>
                    <option value="En espera">En espera</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Bloqueada">Bloqueada</option>
                  </select>
                {errors.estado && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.estado}</span>}
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
                value={formData.notas}
              >
              </textarea>
              {errors.notas && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.notas}</span>}
            </div>
            <button type="submit" className='formPA__btn btn btn-primary rounded-pill shadow-sm fw-medium align-self-center'>
                Agregar tarea
            </button>
          </form>
        </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={handleSubmit}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  )
}

export default ModalPlanes