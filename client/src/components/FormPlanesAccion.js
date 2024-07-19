import React, { useState } from 'react'
import "./FormPlanesAccion.scss"

function FormPlanesAccion({form, setForm}) {
    const [nombre, setNombre] = useState("")
    const [tarea, setTarea] = useState("")
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFinal, setFechaFinal] = useState("")
    const [encargado, setEncargado] = useState("")
    const [equipo, setEquipo] = useState("")
    const [prioridad, setPrioridad] = useState("")
    const [estado, setEstado] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("clic")
    }

  return (
    <>
        {form ? (
            <form onSubmit={handleSubmit} className='formPA d-flex flex-column justify-content-center'>
                <h2 className='text-white mb-4'>Crear tarea</h2>
                <input
                    onChange={(e)=>setNombre(e.target.value)}
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    placeholder="Nombre del Proyecto" 
                    className="form-control col-12 mb-2"
                    value={nombre}
                />
                <input
                    onChange={(e)=>setTarea(e.target.value)}
                    type="text" 
                    id="tarea" 
                    name="tarea" 
                    placeholder="Nombre de la tarea" 
                    className="form-control col-12 mb-2"
                    value={tarea}
                />
                <div className='row mb-2'>
                    <div className='col-6'>
                        <input
                            onChange={(e)=>setFechaInicio(e.target.value)}
                            type="date" 
                            id="tarea" 
                            name="tarea" 
                            placeholder="Nombre de la tarea" 
                            className="form-control"
                            value={fechaInicio}
                        />
                    </div>
                    <div className='col-6'>
                        <input
                            onChange={(e)=>setFechaFinal(e.target.value)}
                            type="date" 
                            id="tarea" 
                            name="tarea" 
                            placeholder="Nombre de la tarea" 
                            className="form-control"
                            value={fechaFinal}
                        />
                    </div>
                </div>
                <input
                    onChange={(e)=>setEncargado(e.target.value)}
                    type="text" 
                    id="tarea" 
                    name="tarea" 
                    placeholder="Nombre del encargado" 
                    className="form-control col-12 mb-2"
                    value={encargado}
                />
                <input
                    onChange={(e)=>setEquipo(e.target.value)}
                    type="text" 
                    id="tarea" 
                    name="tarea" 
                    placeholder="Equipo de apoyo" 
                    className="form-control col-12 mb-2"
                    value={equipo}
                />
                <div className='d-flex flex-row mb-2' onChange={(e)=>setPrioridad(e.target.value)} value={prioridad}>
                    <label className='text-white me-3'>Prioridad</label>
                    <div className="form-check me-3">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="flexRadioDefault" 
                            id="flexRadioDefault1" 
                            value="1"
                            defaultChecked>
                        </input>
                        <label className="form-check-label" htmlFor="flexRadioDefault1">Baja</label>
                    </div>
                    <div className="form-check me-3">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="flexRadioDefault" 
                            id="flexRadioDefault2"
                            value="2" >
                        </input>
                        <label className="form-check-label" htmlFor="flexRadioDefault2">Media</label>
                    </div>
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="flexRadioDefault" 
                            id="flexRadioDefault3"
                            value="3" >
                        </input>
                        <label className="form-check-label" htmlFor="flexRadioDefault3">Alta</label>
                    </div>
                </div>
                <div className='w-75 d-flex flex-row align-items-center mb-4'>
                    <label className='me-3 text-white'>Estado</label>
                    <select onChange={(e)=>setEstado(e.target.value)} className="form-select" aria-label="Default select example" value={estado}>
                        <option>Elija el estado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Completada">Completada</option>
                        <option value="En espera">En espera</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Bloqueada">Bloqueada</option>
                    </select>
                </div>
                <button onClick={handleSubmit} className='formPA__btn btn rounded-pill shadow-sm fw-medium'>
                    Agregar tarea
                </button>
            </form>
            ) : (
            <div className='d-none'></div>
            )}
    </>
  )
}

export default FormPlanesAccion