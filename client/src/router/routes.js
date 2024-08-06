import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login/Login'
import Home from '../pages/Home/Home'
import PlanesAccion from '../pages/PlanesAccion/PlanesAccion'
import Okr from '../pages/Okr/Okr'
import AsistenteIA from '../pages/AsistenteIA/AsistenteIA'
import DatIN from '../pages/DatIN/DatIN'

import ProtectedRoutes from '../Services/ProtectedRoutes'
import Layout from '../components/Layout'
import PowerBI from '../components/PowerBI'
import NotFound from '../pages/NotFound/NotFound'

function MyRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />}/>
            {/* protected routes */}
            <Route element={<ProtectedRoutes />}>
              <Route element={<Layout />}>
                  <Route path="/home" element={<Home />}/>
                  <Route path="/planes-de-accion" element={<PlanesAccion />}/>
                  <Route path="/okr" element={<Okr />}/>
                  <Route path="/asistente-ia" element={<AsistenteIA />}/>
                  <Route path="/dat-in" element={<DatIN />}/>
                  <Route path="bi/:area" element={<PowerBI />}></Route>
                  <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default MyRoutes