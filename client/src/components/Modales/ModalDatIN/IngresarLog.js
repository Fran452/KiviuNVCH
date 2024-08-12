import React, { useContext } from 'react'
import { PasosContext } from '../../../context/PasosContext'
import './Pasos.scss'

function IngresarLog() {
  const { logData, setLogData } = useContext(PasosContext)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogData({
      ...logData,
      [name]: value,
    })
  }

  return (
    <div>
      <h4 className='text-center mb-4'>Ingresa un log:</h4>
      <div className='form__log'>
        {/* Log (métrica) */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <label className='me-1 col-12 col-md-3 col-form-label'>Ingresar el valor</label>
          <div className='col-12 col-md-9'>
            <input
              onChange={handleChange}
              type="number"  
              name="log" 
              autoFocus
              className="form-control form-control-sm"
              value={logData["log"] || ""}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default IngresarLog