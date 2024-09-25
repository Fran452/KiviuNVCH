import React, { useContext } from 'react'
import { PasosContext } from '../../context/PasosContext'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function DatosPrincipales() {
  const { userData, setUserData, errorsDatos } = useContext(PasosContext)

  const Icono = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      {children}
    </OverlayTrigger>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  return (
    <div className='mb-4'>
      <h4 className='text-center mb-4'>Ingresa un indicador:</h4>
      <div className='form__datos'>
        {/* Area o proyecto */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <div className='col-12 col-md-4 d-flex flex-row align-items-center me-1'>
            <label className='me-1 col-form-label'>Área o proyecto</label>
            <Icono title="Designe el indicador a un área o proyecto." id="1">
              <i className="icon__dato bi bi-info-circle"></i>
            </Icono>
          </div>
          <div className='d-flex flex-column col-12 col-md-8'>
            <input
              onChange={handleChange}
              type="text"  
              name="area" 
              autoFocus
              className="form-control form-control-sm"
              value={userData.area}
            />
            {errorsDatos.area && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorsDatos.area}</span>}
          </div>
        </div>
        {/* Nombre del indicador */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <div className='col-12 col-md-4 d-flex flex-row align-items-center me-1'>
            <label className='me-1 col-form-label'>Nombre del indicador</label>
            <Icono title="Ingrese el nombre del indicador." id="2">
              <i className="icon__dato bi bi-info-circle"></i>
            </Icono>
          </div>
          <div className='d-flex flex-column col-12 col-md-8'>
            <input
              onChange={handleChange}
              type="text"  
              name="indicador" 
              className="form-control form-control-sm"
              value={userData.indicador}
            />
            {errorsDatos.indicador && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorsDatos.indicador}</span>}
          </div>
        </div>
        {/* Descripción del indicador */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <div className='col-12 col-md-4 d-flex flex-row align-items-center me-1'>
            <label className='me-1 col-form-label'>Descripción del indicador</label>
            <Icono title="Ingrese la descripción del indicador." id="3">
              <i className="icon__dato bi bi-info-circle"></i>
            </Icono>
          </div>
          <div className='d-flex flex-column col-12 col-md-8'>
            <input
              onChange={handleChange}
              type="text"  
              name="descripcion" 
              className="form-control form-control-sm"
              value={userData.descripcion}
            />
            {errorsDatos.descripcion && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorsDatos.descripcion}</span>}
          </div>
        </div>
        {/* Frecuencia de carga */}
        <div className="d-flex flex-column flex-md-row align-items-center mb-2">
          <div className='col-12 col-md-4 d-flex flex-row align-items-center me-1'>
            <label className='me-1 col-form-label'>Frecuencia</label>
            <Icono title="Seleccione la frecuencia con la que se deben cargar los datos de este KPI (Semanal, Quincenal, Mensual, Trimestral)." id="4">
              <i className="icon__dato bi bi-info-circle"></i>
            </Icono>
          </div>
          <div className='d-flex flex-column col-12 col-md-3'>
            <select 
              className="form-select form-select-sm" 
              name="frecuencia" 
              onChange={handleChange} 
              value={userData.frecuencia}
            >
              <option value="">Elija la frecuencia</option>
              <option value="1">Semanal</option>
              <option value="2">Quincenal</option>
              <option value="3">Mensual</option>
              <option value="4">Trimestral</option>
            </select>
            {errorsDatos.frecuencia && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorsDatos.frecuencia}</span>}
          </div>
        </div>
        {/* Email del responsable */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <div className='col-12 col-md-4 d-flex flex-row align-items-center me-1'>
            <label className='me-1 col-form-label'>Responsable</label>
            <Icono title="Ingrese el correo electrónico del responsable." id="5">
              <i className="icon__dato bi bi-info-circle"></i>
            </Icono>
          </div>
          <div className='d-flex flex-column col-12 col-md-8'>
            <input
              onChange={handleChange}
              type="email"  
              name="responsable" 
              placeholder="usuario@correo.com.ar"
              className="form-control form-control-sm"
              value={userData.responsable}
            />
            {errorsDatos.responsable && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorsDatos.responsable}</span>}
          </div>
        </div>
        {/* Email del suplente */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <div className='col-12 col-md-4 d-flex flex-row align-items-center me-1'>
            <label className='me-1 col-form-label'>Responsable suplente</label>
            <Icono title="Ingrese el correo electrónico del responsable suplente." id="6">
              <i className="icon__dato bi bi-info-circle"></i>
            </Icono>
          </div>
          <div className='d-flex flex-column col-12 col-md-8'>
            <input
              onChange={handleChange}
              type="email"  
              name="suplente" 
              placeholder="usuario@correo.com.ar"
              className="form-control form-control-sm"
              value={userData.suplente}
            />
            {errorsDatos.suplente && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorsDatos.suplente}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatosPrincipales