import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Products from './Pages/Products'
import About from './Pages/About'

const App = () => {
  return (
    <div>
        <Routes>
<Route path='/' element={<Home />} />
<Route path='/home' element={<Home />} />
<Route path='/products' element={<Products />} />
<Route path='/about' element={<About />} />
        </Routes>
    
    </div>
  )
}

export default App
