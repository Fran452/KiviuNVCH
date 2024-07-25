import React, { useEffect } from 'react'
import { useState } from "react"
import Logo from "../../assets/img/logo.png"
import Ilustration from "../../assets/img/ilustration.png"
import "./Login.scss"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Oval } from 'react-loader-spinner'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            navigate("/home")
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const reqBody = {
            user: email,
            pass: password
        }
        setLoading(true)
        await fetch("http://localhost:3030/apis/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reqBody)
        })
        .then(res => res.json())
        .then(data => {
            const obj = jwtDecode(data)
            console.log(obj)
            setLoading(false)
            if(obj.apirest.status === 0){
                localStorage.setItem('token', JSON.stringify(data))
                navigate("/home")
            } else {
                setError(obj.apirest.codeError)
            }
        })
        .catch (err => {
            console.log(err)
        })
    }

    return (
        <>
            {loading ? (<div className='loading vh-100 vw-100 z-3 position-absolute d-flex flex-column align-items-center justify-content-center'>
                <Oval
                    visible={true}
                    height="80"
                    width="80"
                    color="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
                <p className='text-white fw-medium'>Loading...</p>
            </div>): ("") 
            }
            <div className="login vh-100 d-flex align-items-center justify-content-center">
                <div className="login__container d-flex flex-row bg-white shadow-sm rounded">
                    <div className="login__container__form col-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
                        <img className="login__container__form__img mb-4" src={Logo} alt="Logo" />
                        <form className="w-100 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                            <div className="w-100 d-flex flex-column mb-4">
                                <label htmlFor="email" className="form-label">Correo</label>
                                <input 
                                    onChange={(e)=>setEmail(e.target.value)} 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="ejemplo@correo.com.ar" 
                                    className="form-control"
                                    value={email}
                                />
                            </div>
                            <div className='w-100 d-flex flex-column mb-2'>
                                <label htmlFor="password" className='form-label'>Contraseña</label>
                                <input 
                                    onChange={(e)=>setPassword(e.target.value)} 
                                    type="password" 
                                    id='password' 
                                    name="password" 
                                    placeholder='' 
                                    className='form-control'
                                    value={password}
                                />
                            </div>
                            <div>
                                {error ? <div className='mb-4'><i className="bi bi-exclamation-circle pe-2 text-danger"></i><span className='text-danger'>{error}</span></div> : ""}
                            </div>
                            <button onClick={handleSubmit} className="btn btn-primary" type='submit'>Iniciar Sesión</button>
                        </form>
                    </div>
                    <div className='login__container__info d-none d-md-flex flex-column justify-content-center col-md-6 bg-gray-100 rounded-end'>
                        <h1 className="login__container__info__title mb-2">Muchos pueden mirar, pero pocos pueden ver.</h1>
                        <h4 className="login__container__info__subtitle mb-4">Plataforma de Gestión profesional y seguimiento con datos.</h4>
                        <img src={Ilustration} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login