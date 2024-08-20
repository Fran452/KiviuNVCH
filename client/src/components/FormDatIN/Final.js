import React, {useContext} from 'react'
import IllustrationAccess from '../../assets/img/access.png'
import IlustrationIndicador from '../../assets/img/indicadores.png'
import { PasosContext } from '../../context/PasosContext'

function Final() {
    const { userData, setAddIndicador, setCurrentStep, errorFetch, fetchIndicadores, setLoading, setError, setIndicadores } = useContext(PasosContext)

    const handleBackIndicadores = () => {
        setAddIndicador(false)
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
    return (
        <>
            {errorFetch ? (
                <div className='final__step d-flex flex-column align-items-center'>
                    <img className='mb-4' src={IllustrationAccess} alt="" />
                    <h2 className='fw-semibold mb-2'>Oops!</h2>
                    <p className=''>{errorFetch}</p>
                    <div className='d-flex flex-row'>
                        <button className='px-4 btn btn-outline-primary rounded-pill shadow-sm fw-medium me-4' onClick={() => setCurrentStep(1)}>Regresar al formulario</button>
                        <button className='px-4 btn btn-primary rounded-pill shadow-sm fw-medium' onClick={handleBackIndicadores}>Regresa al listado</button>
                    </div>
                </div>
            ) : (
                <div className='final__step d-flex flex-column align-items-center'>
                    <img className='mb-4' src={IlustrationIndicador} alt="" />
                    <h2 className='fw-semibold mb-2'>¡Carga exitosa!</h2>
                    <p className=''>El indicador {userData.nombre} ha sido creado.</p>
                    <div className='d-flex flex-column-reverse flex-md-row'>
                        <button className='px-4 btn btn-outline-primary rounded-pill shadow-sm fw-medium me-md-4' onClick={() => setCurrentStep(1)}>Crea un nuevo indicador</button>
                        <button className='px-4 btn btn-primary rounded-pill shadow-sm fw-medium mb-2 mb-md-0' onClick={handleBackIndicadores}>Regresa al listado</button>
                    </div>
                </div>
            )}
        </>
        
    )
}

export default Final