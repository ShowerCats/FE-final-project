// src/Grades.jsx
import React from 'react'; // Keep React import
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles'; // For custom styling

// Mock data for grades (replace with actual data fetching later)
const mockGrades = [
  { id: 1, course: 'Introduction to Programming', assignment: 'Midterm Exam', grade: 'A-', date: '2024-05-10', feedback: 'Good work, minor errors in section 3.' },
  { id: 2, course: 'Calculus I', assignment: 'Homework 5', grade: 'B+', date: '2024-05-12', feedback: 'Solid understanding of derivatives.' },
  { id: 3, course: 'Introduction to Programming', assignment: 'Assignment 3', grade: 'A', date: '2024-05-01', feedback: 'Excellent implementation.' },
  { id: 4, course: 'Linear Algebra', assignment: 'Quiz 2', grade: 'C', date: '2024-04-28', feedback: 'Review matrix multiplication rules.' },
  { id: 5, course: 'Data Structures', assignment: 'Project 1', grade: 'Pending', date: 'N/A', feedback: '' },
];

// Optional: Styled TableRow for alternating background colors
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // Hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Changed function name to match the filename export
export default function Grades() {
  // In a real app, you would fetch grades using useEffect, possibly based on the logged-in user's ID
  // For now, we'll use the mock data
  const grades = mockGrades;

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Your Grades
      </Typography>

      {grades.length === 0 ? (
        <Paper elevation={2} sx={{ padding: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No grades have been posted yet. Check back later!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 700 }} aria-label="grades table">
            <TableHead sx={{ backgroundColor: 'primary.dark' }}> {/* Darker header */}
              <TableRow>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Course</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Assignment</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Grade</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="right">Date Posted</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <StyledTableRow key={grade.id}>
                  <TableCell component="th" scope="row">
                    {grade.course}
                  </TableCell>
                  <TableCell>{grade.assignment}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: grade.grade === 'Pending' ? 'normal' : 'medium', color: grade.grade === 'Pending' ? 'text.secondary' : 'text.primary' }}>
                    {grade.grade}
                  </TableCell>
                  <TableCell align="right">{grade.date}</TableCell>
                  <TableCell sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    {grade.feedback || '-'} {/* Show dash if no feedback */}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
