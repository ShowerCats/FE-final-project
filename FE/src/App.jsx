import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Info from './Info';
import Help from './Help';
import StudentsList from './StudentsList';
import StudentsForm from './StudentsForm';
import Header from './Header';
import Box from '@mui/material/Box';
import About from './About';
import NotificationsList from './NotificationsList';
import Grades from './Grades';
import Courses from './Courses';
import Typography from '@mui/material/Typography';


// Firestore imports
import { firestore as db } from './Firebase/config.js';
import { collection, getDocs, writeBatch, doc } from "firebase/firestore"; // Added doc for specific ID setting

function App() {

  React.useEffect(() => {
    const populateInitialData = async () => {
      // Populate Students
      const studentsCollectionRef = collection(db, "students");
      const studentsSnapshot = await getDocs(studentsCollectionRef);
      if (studentsSnapshot.empty) {
        console.log("Populating initial student data into Firestore...");
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
        const studentBatch = writeBatch(db);
        initialStudents.forEach(student => {
          const studentDocRef = doc(collection(db, "students")); // Firestore will auto-generate an ID
          studentBatch.set(studentDocRef, student);
        });
        await studentBatch.commit();
        console.log("Initial student data populated into Firestore.");
      } else {
        console.log("Student data already exists in Firestore. Skipping population.");
      }

      // Populate Notifications
      const notificationsCollectionRef = collection(db, "notifications");
      const notificationsSnapshot = await getDocs(notificationsCollectionRef);
      if (notificationsSnapshot.empty) {
        console.log("Populating initial notification data into Firestore...");
        const initialNotifications = [
            { id: 1, sender: 'Prof. Smith', message: 'Your grade for the Midterm Exam has been updated.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), type: 'grade_update', read: false },
            { id: 2, sender: 'Admin Office', message: 'Reminder: Course registration deadline is approaching.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'announcement', read: false },
            { id: 3, sender: 'Prof. Davis', message: 'Assignment 3 feedback is available. Check your grades.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), type: 'grade_update', read: true },
            { id: 4, sender: 'Teaching Assistant', message: 'Office hours cancelled for this Wednesday.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'info', read: false },
        ];
        const notificationBatch = writeBatch(db);
        initialNotifications.forEach(notification => {
          // Using your existing 'id' field as the document ID. Ensure it's unique and a string.
          const notificationDocRef = doc(db, "notifications", String(notification.id));
          notificationBatch.set(notificationDocRef, notification);
        });
        await notificationBatch.commit();
        console.log("Initial notification data populated into Firestore.");
      } else {
        console.log("Notification data already exists in Firestore. Skipping population.");
      }
    };

    populateInitialData().catch(error => {
      console.error("Error populating initial data:", error);
    });

  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <>
      <Header />
      <Box component="main" sx={{ pt: { xs: 7, sm: 8 }, p: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Info" element={<Info />} />
          <Route path="/Help" element={<Help />} />
          <Route path="/Notifications" element={<NotificationsList />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/students/add" element={<StudentsForm />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Typography>Page Not Found</Typography>} />
          <Route path="/students/edit/:studentId" element={<StudentsForm />} /> {/* For editing */}
        </Routes>
      </Box>
    </>
  );
}

export default App;