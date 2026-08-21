import React from 'react'
import { Routes,Route } from 'react-router-dom'
import HomePage from "./pages/HomePage"
import AuthPage from './pages/AuthPage'
import Layout from './pages/Layout'
import Loading from './components/Loading'

const App = () => {
  return (
    <Routes>
      {/* Login Routes */}
      <Route element={<Layout/>}>
      <Route path='/login' element={<AuthPage mode="login"/>}></Route>
      <Route path='/register' element={<AuthPage mode="register"/>}></Route>
      <Route path='/login' element={<Loading/>}/>
      </Route>
    </Routes>
  )
}

export default App