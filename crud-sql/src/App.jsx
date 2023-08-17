import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Books } from './components/Books';
import { AddBook } from './components/AddBook';
import { Update } from './components/Update';
import './App.css';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Books />} />
          <Route path='/add' element={<AddBook />} />
          <Route path='/update/:id' element={<Update />} />
        </Routes>
      </Router>
    </>
  )
}


export default App;