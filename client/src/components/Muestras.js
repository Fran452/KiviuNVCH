import React, { useState, useEffect, useContext } from 'react';
import Subtareas, { subtareasContext } from './Subtareas';
import "./Tareas.scss"

export const muestrasContext = React.createContext()

function Muestras(){
    const {
        muestras,
        setMuestras,
        loadingMuestra,
        setLoadingMuestra,
        errorMuestra,
        setErrorMuestra
    } = useContext(subtareasContext)

    return (
        <>
            <muestrasContext.Provider value={{}}>
                {/* Modal Editar muestra */}
                {/* Modal Ver muestra */}
                {/* Modal Eliminar muestra */}
                {/* Modal Finalizar muestra */}
                {loadingMuestra ? (
                    <div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {errorMuestra ? (
                            <p>{errorMuestra}</p>
                        ) : (
                            <>
                                {muestras.length === 0 ? (
                                    <p>No hay muestras</p>
                                ) : (
                                    <>
                                        {muestras.map((m, i) => {
                                            return <div>
                                                <p>{m.titulo}</p>
                                            </div>
                                        })}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </muestrasContext.Provider>
        </>
    )
}

export default Muestras