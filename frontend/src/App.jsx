import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css'
import Header from './components/NavBar/Header.jsx'
import Community from './Pages/community.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/community" element={<Community />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
