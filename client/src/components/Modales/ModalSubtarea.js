import React, { useState, useEffect, useContext } from 'react'
import { Modal, ProgressBar } from 'react-bootstrap';
import { subtareasContext } from '../Subtareas';
import { newContext } from '../../pages/PlanesAccion/Ciclo'

function ModalSubtarea(props) {
  const { USER } = useContext(newContext)
  const { subtareaObj, setSubtareaObj, setLoadingSub, setErrorSub, fetchSubtareasById, setSubtareas, idTask, fetchMetrica, idCiclo, setTareasRealporCiclo, setTareasNorealporCiclo, setLoadingTar, fetchTareasById, setErrorTar, setTareasByCiclo } = useContext(subtareasContext)

  const [formData, setFormData] = useState({
    titulo: "",
    fechaInicio: "",
    // fechaFinal: "",
    responsable: "",
    estado: "",
    prioridad: "",
    notas: "",
    horas: 0,
    avance: 0
  })
  const [errors, setErrors] = useState({})
  const [modalErrSub, setModalErrSub] = useState(null)

  useEffect(() => {
    if(subtareaObj){
      const obj = JSON.parse(subtareaObj)
      setFormData({
        titulo: obj.titulo,
        fechaInicio: obj.fecha_inicio,
        // fechaFinal: obj.fecha_final,
        responsable: obj.mailUser,
        estado: obj.estado.toString(),
        prioridad: obj.prioridad.toString(),
        notas: obj.notas,
        horas: obj.horas_tarea,
        avance: parseInt(obj.progreso_tarea),
      })
    }
  },[subtareaObj])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = (data) => {
    const errors = {}

    if(!data.titulo.trim()) {
      errors.titulo = "Escoja un nombre."
    }
    if(!data.fechaInicio.trim()) {
      errors.fechaInicio = "Escoja una fecha de inicio."
    }
    // if(!data.fechaFinal.trim()) {
    //   errors.fechaFinal = "Escoja una fecha de término."
    // }
    if(!data.responsable.trim()) {
      errors.responsable = "Escriba el mail."
    } else if (!/\S+@\S+\.\S+/.test(data.responsable)){
      errors.responsable = "El email no es válido."
    }
    if(!data.estado.trim()) {
      errors.estado = "Marca una opción."
    }
    if(!data.prioridad.trim()) {
      errors.prioridad = "Marca una opción."
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
    setFormData({
      titulo: "",
      fechaInicio: "",
      // fechaFinal: "",
      responsable: "",
      estado: "",
      prioridad: "",
      notas: "",
      horas: 0,
      avance: 0
    })
    props.onHide()
    setSubtareaObj(null)
    setModalErrSub(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm(formData);
    setErrors(newErrors)
    //
    if (Object.keys(newErrors).length === 0){
      const obj = {
        asignacion: formData.responsable,
        user: USER,
        titulo: formData.titulo,
        estado: parseInt(formData.estado),
        prioridad: parseInt(formData.prioridad),
        fechaInicial: formData.fechaInicio,
        // fechaFinal: formData.fechaFinal,
        notas: formData.notas,
        id_tareas: idTask,
        avance: parseInt(formData.avance),
        horasAprox: parseInt(formData.horas)
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/apis/plan-accion/addSubTask`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(obj)
        })
        const data = await res.json()
        if(data.error !== 0) {
          setModalErrSub(data.errorDetalle)
        } else {
          setFormData({
            titulo: "",
            fechaInicio: "",
            // fechaFinal: "",
            responsable: "",
            estado: "",
            prioridad: "",
            notas: "",
            horas: 0,
            avance: 0
          })
          setModalErrSub(null)
          setSubtareaObj(null)
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
        }
      } catch (error) {
        setModalErrSub(error)
      }
    } else {
      setModalErrSub("Completar los campos mencionados.")
    }
  }

  const handleChangeSubtarea = async (e) => {
    e.preventDefault()
    const newErrors = validateForm(formData);
    setErrors(newErrors)
    const subtask = JSON.parse(subtareaObj)
    if (Object.keys(newErrors).length === 0){
      const obj = {
        empleado_asignado: formData.responsable,
        user: USER,
        titulo: formData.titulo,
        estado: parseInt(formData.estado),
        prioridad: parseInt(formData.prioridad),
        fechaInicio: formData.fechaInicio,
        // fechaFinal: formData.fechaFinal,
        notas: formData.notas,
        subtarea: subtask,
        avance: parseInt(formData.avance),
        horasAprox: parseInt(formData.horas)
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/apis/plan-accion/modSubTask`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(obj)
        })
        const data = await res.json()
        if(data.error !== 0) {
          setModalErrSub(data.errorDetalle)
        } else {
          setFormData({
            titulo: "",
            fechaInicio: "",
            // fechaFinal: "",
            responsable: "",
            estado: "",
            prioridad: "",
            notas: "",
            horas: 0,
            avance: 0
          })
          setModalErrSub(null)
          setSubtareaObj(null)
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
          // fin de actualiza tareas
        }
      } catch (error) {
        setModalErrSub(error)
      }
    } else {
      setModalErrSub("Completar los campos mencionados.")
    }
  }

  const handleDecrease = (e) => {
    e.preventDefault()
    if(formData.avance === 0){
      setFormData({
        ...formData,
        avance: 0
      })
    } else {
      setFormData({
        ...formData,
        avance: formData.avance - 10
      })
    }
  }
  const handleIncrese = (e) => {
    e.preventDefault()
    if(formData.avance === 100){
      setFormData({
        ...formData,
        avance: 100
      })
    } else {
      setFormData({
        ...formData,
        avance: formData.avance + 10
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
          {subtareaObj ? <h3 className='m-0'>Modificar Subtarea</h3>: <h3 className='m-0'>Agregar Subtarea</h3>}
          <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {subtareaObj ? (
          <form className='formPA d-flex flex-column' onSubmit={handleChangeSubtarea}>
          <div className='mb-2'>
            <label className='mb-1'>Nombre</label>
            <input
              onChange={handleChange}
              type="text" 
              id="titulo" 
              name="titulo" 
              autoFocus
              className="form-control form-control-sm col-12"
              value={formData.titulo}
            />
            {errors.titulo && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.titulo}</span>}
          </div>
          <div className='row mb-2'>
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
          <div className='row mb-2'>
            <div className='col-6'>
              <label className='mb-1'>Progreso de la subtarea</label>
              <div className="formPA__progressBar d-flex flex-row align-items-center justify-content-between">
                <button className='btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center' onClick={handleDecrease}><i className="bi bi-dash"></i></button>
                <ProgressBar className='formPA__progressBar__bar' now={Math.round(formData.avance)} label={`${Math.round(formData.avance)}%`} max={100}/>
                <button className='btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center' onClick={handleIncrese}><i className="bi bi-plus"></i></button>
              </div>
              {errors.avance && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.avance}</span>}
            </div>
            <div className='col-6'>
              <label className='mb-1'>Horas</label>
              <input
                onChange={handleChange}
                type="number" 
                id="horas" 
                name="horas" 
                className="input--arrows form-control form-control-sm col-12"
                value={formData.horas}
              />
              {errors.horas && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.horas}</span>}
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
          {modalErrSub !== null && <span className='align-self-center text-danger my-2'><i className="bi bi-exclamation-circle me-1"></i>{modalErrSub}</span>}
          <button type="submit" className='formPAsub__btn btn btn-primary rounded-pill shadow-sm fw-medium align-self-center'>
              Modificar subtarea
          </button>
        </form>
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
              value={formData.titulo}
            />
            {errors.titulo && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.titulo}</span>}
          </div>
          <div className='row mb-2'>
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
          <div className='row mb-2'>
            {/* <div className='col-6'>
              <label className='mb-1'>Progreso de la subtarea</label>
              <div className="formPA__progressBar d-flex flex-row align-items-center justify-content-between">
                <button className='btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center' onClick={handleDecrease}><i className="bi bi-dash"></i></button>
                <ProgressBar className='formPA__progressBar__bar' now={formData.avance} label={`${formData.avance}%`} max={100}/>
                <button className='btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center' onClick={handleIncrese}><i className="bi bi-plus"></i></button>
              </div>
              {errors.avance && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.avance}</span>}
            </div> */}
            <div className='col-6'>
              <label className='mb-1'>Horas</label>
              <input
                onChange={handleChange}
                type="number" 
                id="horas" 
                name="horas" 
                className="input--arrows form-control form-control-sm col-12"
                value={formData.horas}
              />
              {errors.horas && <span className='formPA__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errors.horas}</span>}
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
          {modalErrSub !== null && <span className='align-self-center text-danger my-2'><i className="bi bi-exclamation-circle me-1"></i>{modalErrSub}</span>}
          <button type="submit" className='formPAsub__btn btn btn-primary rounded-pill shadow-sm fw-medium align-self-center'>
              Agregar subtarea
          </button>
        </form>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ModalSubtarea