import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'
import { Login } from './components/Login'
import { Home } from './components/Home'
import { CreateTicket } from './components/CreateTicket'
import { Dashboard } from './components/Dashboard'
import { TicketDetails } from './components/TicketDetails'
import { AdminPanel } from './components/AdminPanel'
import { Departments } from './components/Departments'
import { Statuses } from './components/Statuses'
import { EscalationRule } from './components/EscalationRule'
import { ProtectedRoute } from './components/ProtectedRoute'
import SignUp from './components/SignUp'
import { AgentTickets } from './components/AgentTickets'
import ScrollToTop from './components/ScrollToTop'

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  
    axios.defaults.baseURL="http://localhost:5000"

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login'element={<Login/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/createticket' element={<ProtectedRoute><CreateTicket/></ProtectedRoute>}></Route>
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
        <Route path='/ticket/:id' element={<ProtectedRoute><TicketDetails/></ProtectedRoute>}></Route>
        <Route path='/admin' element={<ProtectedRoute requiredRole="admin"><AdminPanel/></ProtectedRoute>}></Route>
        <Route path='/department' element={<ProtectedRoute><Departments/></ProtectedRoute>}></Route>
        <Route path='/statuses' element={<ProtectedRoute><Statuses/></ProtectedRoute>}></Route>
        <Route path='/escalationrule' element={<ProtectedRoute><EscalationRule/></ProtectedRoute>}></Route>
        <Route path='/agenttickets' element={<ProtectedRoute requiredRole="agent"><AgentTickets/></ProtectedRoute>}></Route>
      </Routes>
    </>
  )
}

export default App
