import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import Profile from './Profile';
import Schedule from './Schedule'; // Import the new Schedule page
import CourseDetails from './CourseDetails'; // Import CourseDetails
import Typography from '@mui/material/Typography';
import { LoadingProvider, useLoading } from './contexts/LoadingContext.jsx';
import LoadingScreen from './LoadingScreen'; // Import LoadingScreen

import './App.css';

// Firestore imports
import { firestore as db } from './Firebase/config.js';
import { collection, getDocs, writeBatch, doc } from "firebase/firestore"; // Added doc for specific ID setting

// Main App content component to access loading context
function AppContent() {
  const { isLoadingGlobal } = useLoading();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const pathSegments = pathname.split('/').filter(segment => segment);

    if (pathSegments.length === 0) return "HOME";

    const mainPath = pathSegments[0].toLowerCase();
    switch (mainPath) {
      case "info": return "INFO";
      case "help": return "HELP";
      case "notifications": return "NOTIFICATIONS";
      case "students":
        if (pathSegments[1] === "add") return "REGISTER STUDENT";
        if (pathSegments[1] === "edit") return "EDIT STUDENT";
        return "STUDENTS";
      case "courses":
        if (pathSegments.length > 1 && pathSegments[1] !== 'add') return "COURSE DETAILS";
        return "COURSES";
      case "profile": return "PROFILE";
      case "grades": return "GRADES";
      case "about": return "ABOUT";
      case "schedule": return "MY SCHEDULE";
      default: return pathSegments[0] ? pathSegments[0].toUpperCase() : "DASHBOARD";
    }
  };

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

      // Populate Professors
      const professorsCollectionRef = collection(db, "professors");
      const professorsSnapshot = await getDocs(professorsCollectionRef);
      if (professorsSnapshot.empty) {
        console.log("Populating initial professor data into Firestore...");
        const initialProfessors = [
          { id: "P2001", firstName: "Albus", lastName: "Dumbledore", department: "Transfiguration", email: "albus.d@hogwarts.edu" },
          { id: "P2002", firstName: "Minerva", lastName: "McGonagall", department: "Transfiguration", email: "minerva.m@hogwarts.edu" },
          { id: "P2003", firstName: "Severus", lastName: "Snape", department: "Potions", email: "severus.s@hogwarts.edu" },
          { id: "P2004", firstName: "Filius", lastName: "Flitwick", department: "Charms", email: "filius.f@hogwarts.edu" },
          { id: "P2005", firstName: "Pomona", lastName: "Sprout", department: "Herbology", email: "pomona.s@hogwarts.edu" },
          { id: "P2006", firstName: "Indiana", lastName: "Jones", department: "Archaeology", email: "indy.j@university.edu" },
          { id: "P2007", firstName: "Sheldon", lastName: "Cooper", department: "Theoretical Physics", email: "shelly.c@caltech.edu" },
        ];
        const professorBatch = writeBatch(db);
        initialProfessors.forEach(prof => {
          // Use the predefined 'id' as the document ID
          const profDocRef = doc(db, "professors", prof.id);
          professorBatch.set(profDocRef, { firstName: prof.firstName, lastName: prof.lastName, department: prof.department, email: prof.email });
        });
        await professorBatch.commit();
        console.log("Initial professor data populated into Firestore.");
      } else {
        console.log("Professor data already exists in Firestore. Skipping population.");
      }

      // Populate Courses
      const coursesCollectionRef = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollectionRef);
      if (coursesSnapshot.empty) {
        console.log("Populating initial course data into Firestore...");
        const initialCourses = [
          { name: "Introduction to Magic", description: "Fundamental magical theories and practices.", credits: 3, professorId: "P2001" },
          { name: "Transfiguration Basics", description: "Learn to change the form and appearance of objects.", credits: 4, professorId: "P2002" },
          { name: "Potions I", description: "Brewing simple potions and understanding ingredients.", credits: 3, professorId: "P2003" },
          { name: "Charms & Enchantments", description: "Mastering essential charms for everyday use.", credits: 4, professorId: "P2004" },
          { name: "Herbology Fundamentals", description: "Study of magical plants and their properties.", credits: 3, professorId: "P2005" },
          { name: "Defense Against the Dark Arts", description: "Basic defensive spells and creatures.", credits: 4, professorId: "P2001" }, // Dumbledore can teach this too
          { name: "Advanced Potion Brewing", description: "Complex potions and their applications.", credits: 4, professorId: "P2003" },
          { name: "Ancient Runes", description: "Translating and understanding ancient magical scripts.", credits: 3, professorId: "P2006" }, // Indy for a change
          { name: "Magical Creatures Care", description: "Understanding and caring for various magical beasts.", credits: 3, professorId: "P2005" },
          { name: "Theoretical Physics for Wizards", description: "Exploring the intersection of muggle science and magic.", credits: 3, professorId: "P2007" },
          { name: "Advanced Charms", description: "Complex enchantments and their practical uses.", credits: 4, professorId: "P2004" },
          { name: "Field Archaeology and Curse Breaking", description: "Practical applications of archaeology in hazardous environments.", credits: 4, professorId: "P2006" },
          { name: "String Theory and Spellcraft", description: "Advanced theoretical concepts in magic.", credits: 3, professorId: "P2007" },
          { name: "Intermediate Transfiguration", description: "More complex transformations and human transfiguration.", credits: 4, professorId: "P2002" },
          { name: "Muggle Studies", description: "Understanding the non-magical world.", credits: 2, professorId: "P2001" }
        ];
        const courseBatch = writeBatch(db);
        initialCourses.forEach(course => {
          const courseDocRef = doc(collection(db, "courses")); // Firestore auto-generates ID
          courseBatch.set(courseDocRef, course);
        });
        await courseBatch.commit();
        console.log("Initial course data populated into Firestore.");
      } else {
        console.log("Course data already exists in Firestore. Skipping population.");
      }

      // --- Auto-enroll students in empty courses using existing Firestore students ---
      console.log("Checking for empty courses to auto-enroll existing students...");
      const allStudentsSnapshot = await getDocs(collection(db, "students"));
      const allCoursesSnapshot = await getDocs(collection(db, "courses"));

      if (!allStudentsSnapshot.empty && !allCoursesSnapshot.empty) {
        const studentDocs = allStudentsSnapshot.docs; // Array of student DocumentSnapshots
        const courseDocs = allCoursesSnapshot.docs;   // Array of course DocumentSnapshots

        // Get current enrollments to find empty courses
        const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
        const courseIdsWithEnrollments = new Set();
        enrollmentsSnapshot.docs.forEach(enrollmentDoc => {
          courseIdsWithEnrollments.add(enrollmentDoc.data().courseId);
        });

        const enrollmentBatch = writeBatch(db);
        let enrollmentsMade = 0;

        courseDocs.forEach(courseDoc => {
          const currentCourseId = courseDoc.id;
          const currentCourseName = courseDoc.data().name || 'Unnamed Course';
          console.log(`Processing course: ${currentCourseName} (ID: ${currentCourseId})`);

          // If this course ID is not in the set of courses that already have enrollments
          if (!courseIdsWithEnrollments.has(currentCourseId)) {
            console.log(`  Course ${currentCourseName} is EMPTY.`);
            if (studentDocs.length > 0) {
              console.log(`  Students are available (count: ${studentDocs.length}). Attempting to enroll a random student.`);
              const randomStudentIndex = Math.floor(Math.random() * studentDocs.length);
              const randomStudentDoc = studentDocs[randomStudentIndex]; // This is a DocumentSnapshot
              const studentData = randomStudentDoc.data();

              console.log(`  Selected student: ${studentData.firstName || 'N/A'} ${studentData.lastName || 'N/A'} (ID: ${randomStudentDoc.id}) for course ${currentCourseName}`);

              const enrollmentRef = doc(collection(db, "enrollments")); // Auto-generate ID for the new enrollment
              enrollmentBatch.set(enrollmentRef, {
                studentId: randomStudentDoc.id, // Firestore document ID of the student
                courseId: currentCourseId,         // Firestore document ID of the course
                enrollmentDate: new Date().toISOString().split('T')[0] // Current date
              });
              enrollmentsMade++;
              console.log(`  Enrollment for ${studentData.firstName || 'N/A'} in ${currentCourseName} added to batch.`);
            } else {
              console.log(`  Course ${currentCourseName} is empty, but NO students are available to enroll.`);
            }
          } else {
            console.log(`  Course ${currentCourseName} (ID: ${currentCourseId}) already has enrollments. Skipping.`);
          }
        });

        if (enrollmentsMade > 0) {
          await enrollmentBatch.commit();
          console.log(`${enrollmentsMade} automatic enrollments created for empty courses.`);
        } else {
          console.log("No empty courses found needing auto-enrollment, or no students available in Firestore.");
        }
      } else {
        console.log("Skipping auto-enrollment for empty courses: No students or no courses found in Firestore.");
      }
    };

    populateInitialData().catch(error => {
      console.error("Error populating initial data:", error);
    });
  }, []);

  return (
    <>
      {isLoadingGlobal && <LoadingScreen />}
      <Header pageTitle={getPageTitle(location.pathname)} />
      <Box
        component="main"
        className="main-content-centered"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Info" element={<Info />} />
          <Route path="/Help" element={<Help />} />
          <Route path="/Notifications" element={<NotificationsList />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/students/add" element={<StudentsForm />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/students/edit/:studentId" element={<StudentsForm />} /> {/* For editing */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Typography>Page Not Found</Typography>} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;
