import React from 'react'
import { useParams, Link, useNavigate } from "react-router-dom"

function Year() {
    const { year } = useParams()
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={()=>navigate(-1)}>Anterior</button>
            <h1>{year}</h1>
            <Link to={`/ciclos-de-auditoria/${year}/1`}>Item 1</Link>
            <br />
            <Link to={`/ciclos-de-auditoria/${year}/2`}>Item 2</Link>
            <br />
            <Link to={`/ciclos-de-auditoria/${year}/3`}>Item 3</Link>
        </div>
    )
}

export default Year