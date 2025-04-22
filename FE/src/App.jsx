// c:\Users\Ori\Downloads\FE Project\FE-final-project\FE\src\App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Info from './Info';
import Help from './Help';
import StudentsList from './StudentsList';
import StudentsForm from './StudentsForm';
import Header from './Header';
import Box from '@mui/material/Box'; // Import Box
import About from './About';
import NotificationsList from './NotificationsList';

function App() {
  // Initial data loading logic (Requirement 7) goes here
  React.useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (!storedStudents || JSON.parse(storedStudents).length === 0) {
      console.log("Populating initial student data...");
      const initialStudents = [
        { firstName: 'Alice', lastName: 'Wonder', email: 'alice@example.com', studentId: 'S1001', major: 'Literature', dateOfBirth: '2001-03-14', phoneNumber: '1112223330', address: '1 Wonderland Ave' },
        { firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com', studentId: 'S1002', major: 'Engineering', dateOfBirth: '2000-05-20', phoneNumber: '2223334440', address: '2 Construction Ln' },
        { firstName: 'Charlie', lastName: 'Chaplin', email: 'charlie@example.com', studentId: 'S1003', major: 'Film Studies', dateOfBirth: '1999-08-11', phoneNumber: '3334445550', address: '3 Silent Rd' },
        { firstName: 'Diana', lastName: 'Prince', email: 'diana@example.com', studentId: 'S1004', major: 'History', dateOfBirth: '1998-11-01', phoneNumber: '4445556660', address: '4 Amazon Trail' },
        { firstName: 'Ethan', lastName: 'Hunt', email: 'ethan@example.com', studentId: 'S1005', major: 'Espionage', dateOfBirth: '2002-01-25', phoneNumber: '5556667770', address: '5 Mission St' },
        { firstName: 'Fiona', lastName: 'Shrek', email: 'fiona@example.com', studentId: 'S1006', major: 'Biology', dateOfBirth: '2000-07-30', phoneNumber: '6667778880', address: '6 Swamp Way' },
        { firstName: 'George', lastName: 'Costanza', email: 'george@example.com', studentId: 'S1007', major: 'Architecture', dateOfBirth: '1999-04-19', phoneNumber: '7778889990', address: '7 Vandelay Apt' },
        { firstName: 'Hermione', lastName: 'Granger', email: 'hermione@example.com', studentId: 'S1008', major: 'Magical Law', dateOfBirth: '2001-09-19', phoneNumber: '8889990000', address: '8 Library Ct' },
        { firstName: 'Indiana', lastName: 'Jones', email: 'indy@example.com', studentId: 'S1009', major: 'Archaeology', dateOfBirth: '1997-06-12', phoneNumber: '9990001110', address: '9 Museum Pl' },
        { firstName: 'Jack', lastName: 'Sparrow', email: 'jack@example.com', studentId: 'S1010', major: 'Navigation', dateOfBirth: '1996-10-27', phoneNumber: '0001112220', address: '10 Pearl Deck' }
      ];
      localStorage.setItem('students', JSON.stringify(initialStudents));
    }
    // Add similar checks for other entities (e.g., 'courses') if needed
  }, []); // Runs only once on component mount

  return (
    <>
    
      <Header />
      {/* Add Box with padding-top to push content below AppBar */}
      <Box component="main" sx={{ pt: { xs: 7, sm: 8 }, p: 2 }}> {/* Adjust pt based on AppBar height, add padding */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Info" element={<Info />} />
          <Route path="/Help" element={<Help />} />
          <Route path="/Notifications" element={<NotificationsList />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/students/add" element={<StudentsForm />} />
          <Route path="/about" element={<About />} />
          {/* Add routes for any other components */}
        </Routes>
      </Box>
    </>
  );
}

export default App;
