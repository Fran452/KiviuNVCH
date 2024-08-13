import React, { useContext } from 'react'
import { PasosContext } from '../../context/PasosContext'

function IngresarLog() {
  const { logData, setLogData, errorsLog } = useContext(PasosContext)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogData({
      ...logData,
      [name]: value,
    })
  }

  return (
    <div className='mb-4'>
      <h4 className='text-center mb-4'>Ingresa un log:</h4>
      <div className='form__log'>
        {/* Log (métrica) */}
        <div className='d-flex flex-column flex-md-row align-items-center mb-2'>
          <label className='me-1 col-12 col-md-3 col-form-label'>Ingresar el valor</label>
          <div className='d-flex flex-column col-12 col-md-9'>
            <input
              onChange={handleChange}
              type="number"  
              name="log" 
              autoFocus
              className="form-control form-control-sm"
              value={logData.log}
            />
            {errorsLog.log && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorsLog.log}</span>}
          </div>
        </div>

      </div>
    </div>
  )
}

export default IngresarLog