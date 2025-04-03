import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Info from './Info';
import Help from './Help';
import StudentsList from './StudentsList';
import StudentsForm from './StudentsForm';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Info" element={<Info />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/students" element={<StudentsList />} />
        <Route path="/students/add" element={<StudentsForm />} />
      </Routes>
    </>
  );
}

export default App;
