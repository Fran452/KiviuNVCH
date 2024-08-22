import React from 'react'
import { useParams, useNavigate } from "react-router-dom"

function Proceso() {
    const { id } = useParams()
    const navigate = useNavigate()
    return (
        <div>
            <button onClick={()=>navigate(-1)}>Anterior</button>
            <p>{id}</p>
        </div>
    )
}

export default Proceso