import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Oval } from 'react-loader-spinner'
import './CiclosAuditoria.scss'
import Auditoria from '../../assets/img/ciclos-auditoria.png'

const ciclos = [
    {
        id: 1,
        año: 2024
    }
]

function CiclosAuditoria() {
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        if(ciclos){
            setLoading(false)
        }
    },[])

    return (
        <>
            <div className='ciclos__auditoria section'>
                <div className='section__header d-flex flex-row align-items-end mb-4'>
                    <i className='bi bi-bar-chart-steps me-2'></i>
                    <h4 className='m-0'>Ciclos de auditoría</h4>
                </div>
                {loading ? (
                    <div className='loading__auditoria d-flex flex-column align-items-center justify-content-center'>
                        <Oval
                            visible={true}
                            height="80"
                            width="80"
                            color="#0d6efd"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                        <p className='fw-medium'>Loading...</p>
                    </div>
                ) : (
                    <div className='ciclos__auditoria__main'>
                        <div className='ciclos__auditoria__main__info rounded-3'>
                            <div className='ciclos__auditoria__main__info__textos mb-3 mb-xl-0'>
                                <h2 className='text-white'>Tus ciclos de auditoría están aquí</h2>
                                <p className='text-white m-0'>Aquí podrás editar las tareas y subtareas de tus ciclos por año.</p>
                            </div>
                            <img className='' src={Auditoria} alt="" />
                        </div>
                        <div className='ciclos__auditoria__main__years'>
                            {ciclos.map((e,i) => {
                                return <Link className="card__year d-flex flex-row align-items-center btn shadow-sm rounded-3 border border-light-subtle" to={`/ciclos-de-auditoria/${e.año}`} key={i}>
                                    <h4 className='p-0 m-0 text-start'>Ciclos {e.año}</h4>
                                </Link>
                            })}
                        </div>
                    </div>
                )}
                </div>
        </>
    )
}

export default CiclosAuditoria