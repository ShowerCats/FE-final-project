import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useLoading } from './contexts/LoadingContext.jsx';

// Mock schedule data
const mockSchedule = [
  { time: '09:00 - 10:30', monday: 'Calculus I (Lecture)', tuesday: '', wednesday: 'Calculus I (Tutorial)', thursday: '', friday: 'Calculus I (Lab)' },
  { time: '10:30 - 12:00', monday: '', tuesday: 'Intro to Programming (Lecture)', wednesday: '', thursday: 'Intro to Programming (Lab)', friday: '' },
  { time: '12:00 - 13:00', monday: 'LUNCH BREAK', tuesday: 'LUNCH BREAK', wednesday: 'LUNCH BREAK', thursday: 'LUNCH BREAK', friday: 'LUNCH BREAK' },
  { time: '13:00 - 14:30', monday: 'Linear Algebra (Lecture)', tuesday: '', wednesday: 'Linear Algebra (Tutorial)', thursday: '', friday: '' },
  { time: '14:30 - 16:00', monday: '', tuesday: 'Data Structures (Lecture)', wednesday: '', thursday: 'Data Structures (Lab)', friday: 'Data Structures (Project Work)' },
];

const daysOfWeek = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function ScheduleCell({ content }) {
  return <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', minWidth: 120, height: 80, verticalAlign: 'top', p:1 }}>{content}</TableCell>;
}

export default function Schedule() {
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading();

  useEffect(() => {
    setIsLoadingGlobal(true);
    // Simulate data fetching or page setup
    const timer = setTimeout(() => {
      setIsLoadingGlobal(false);
    }, 100); // Brief loading display

    return () => clearTimeout(timer);
  }, [setIsLoadingGlobal]);

  if (isLoadingGlobal) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          My Schedule
        </Typography>
        <TableContainer>
          <Table sx={{ borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow>
                {daysOfWeek.map(day => (
                  <TableCell key={day} sx={{ fontWeight: 'bold', border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', backgroundColor: 'grey.200' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mockSchedule.map((row, index) => (
                <TableRow key={index}>
                  <ScheduleCell content={row.time} />
                  <ScheduleCell content={row.monday} />
                  <ScheduleCell content={row.tuesday} />
                  <ScheduleCell content={row.wednesday} />
                  <ScheduleCell content={row.thursday} />
                  <ScheduleCell content={row.friday} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}