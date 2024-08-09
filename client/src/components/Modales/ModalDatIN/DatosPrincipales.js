import React, { useContext } from 'react'
import { PasosContext } from '../../../context/PasosContext'
import './Pasos.scss'

function DatosPrincipales() {
  const { userData, setUserData } = useContext(PasosContext)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  return (
    <div>
      <h4 className='text-center mb-4'>Ingresa un indicador:</h4>
      <div className='form__datos'>
        {/* Area o proyecto */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <label className='me-1 col-12 col-md-3 col-form-label'>Área o proyecto</label>
          <div className='col-12 col-md-9'>
            <input
              onChange={handleChange}
              type="text"  
              name="area" 
              autoFocus
              className="form-control form-control-sm"
              value={userData["area"] || ""}
            />
          </div>
        </div>
        {/* Nombre del indicador */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <label className='me-1 col-12 col-md-3 col-form-label'>Nombre del indicador</label>
          <div className='col-12 col-md-9'>
            <input
              onChange={handleChange}
              type="text"  
              name="indicador" 
              className="form-control form-control-sm"
              value={userData["indicador"] || ""}
            />
          </div>
        </div>
        {/* Descripción del indicador */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <label className='me-1 col-12 col-md-3 col-form-label'>Descripción del indicador</label>
          <div className='col-12 col-md-9'>
            <input
              onChange={handleChange}
              type="text"  
              name="descripcion" 
              className="form-control form-control-sm"
              value={userData["descripcion"] || ""}
            />
          </div>
        </div>
        {/* Frecuencia de carga */}
        <div className="d-flex flex-column flex-md-row align-items-center mb-2">
          <label className='me-1 col-12 col-md-3 col-form-label'>Frecuencia</label>
          <div className='col-12 col-md-3'>
            <select 
              className="form-select form-select-sm" 
              name="frecuencia" 
              onChange={handleChange} 
              value={userData["frecuencia"] || ""}
            >
              <option value="">Elija la frecuencia</option>
              <option value="1">Semanal</option>
              <option value="2">Quincenal</option>
              <option value="3">Mensual</option>
              <option value="4">Trimestral</option>
            </select>
          </div>
        </div>
        {/* Email del responsable */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <label className='me-1 col-12 col-md-3 col-form-label'>Responsable</label>
          <div className='col-12 col-md-9'>
            <input
              onChange={handleChange}
              type="email"  
              name="responsable" 
              placeholder="usuario@correo.com.ar"
              className="form-control form-control-sm"
              value={userData["responsable"] || ""}
            />
          </div>
        </div>
        {/* Email del suplente */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <label className='me-1 col-12 col-md-3 col-form-label'>Responsable suplente</label>
          <div className='col-12 col-md-9'>
            <input
              onChange={handleChange}
              type="email"  
              name="suplente" 
              placeholder="usuario@correo.com.ar"
              className="form-control form-control-sm"
              value={userData["suplente"] || ""}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatosPrincipales