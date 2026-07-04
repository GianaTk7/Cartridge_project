import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Products from './Pages/Products'
import About from './Pages/About'
import Login from './Pages/Login'
import Uploadproduct from './Pages/Uploadproduct'
import Productsdetails from './Pages/Productsdetails'

const App = () => {
  return (
    <div>
        <Routes>
<Route path='/' element={<Home />} />
<Route path='/home' element={<Home />} />
<Route path='/products' element={<Products />} />
<Route path='/about' element={<About />} />
<Route path='/Login' element={<Login />} />
<Route path="/product/:id" element={<Productsdetails />} />
<Route path="/uploadproduct" element={<Uploadproduct />} />
   </Routes>

    
    </div>
  )
}

export default App
