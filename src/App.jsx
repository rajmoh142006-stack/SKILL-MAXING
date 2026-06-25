import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AttendanceProvider } from './context/AttendanceContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MarkAttendance from './pages/MarkAttendance';
import ViewAttendance from './pages/ViewAttendance';
import Statistics from './pages/Statistics';
import Batches from './pages/Batches';
import './styles/App.css';

function App() {
  return (
    <AttendanceProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mark-attendance" element={<MarkAttendance />} />
            <Route path="/view-attendance" element={<ViewAttendance />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AttendanceProvider>
  );
}

export default App;
