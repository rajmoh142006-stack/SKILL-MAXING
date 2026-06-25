import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Save, Calendar, Users, RotateCcw, Sparkles } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { getToday, formatDisplayDate, sanitizeInput } from '../utils/helpers';
import '../styles/Attendance.css';

const MarkAttendance = () => {
  const { batches, markAttendance, getAttendance } = useAttendance();
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [records, setRecords] = useState({});
  const [savedMessage, setSavedMessage] = useState('');

  const batch = useMemo(
    () => batches.find(b => b.id === selectedBatch),
    [batches, selectedBatch]
  );

  React.useEffect(() => {
    if (batch) {
      const existing = getAttendance(batch.id, selectedDate);
      const initial = {};
      batch.students.forEach(s => {
        const found = existing.find(r => r.studentId === s.id);
        initial[s.id] = found ? found.status : 'present';
      });
      setRecords(initial);
    }
  }, [batch, selectedDate, getAttendance]);

  const handleToggle = (studentId, status) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    if (!batch) return;
    const updated = {};
    batch.students.forEach(s => { updated[s.id] = status; });
    setRecords(updated);
  };

  const handleSave = () => {
    if (!batch) return;
    const recordsArray = Object.entries(records).map(([studentId, status]) => ({
      studentId: sanitizeInput(studentId),
      status
    }));
    markAttendance(batch.id, selectedDate, recordsArray);
    setSavedMessage('Attendance saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const presentCount = Object.values(records).filter(s => s === 'present').length;
  const absentCount = Object.values(records).filter(s => s === 'absent').length;
  const total = batch?.students.length || 0;
  const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0;

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="page-header-icon">
          <Check size={28} />
        </div>
        <div>
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-subtitle">Record student presence for the session</p>
        </div>
      </motion.div>

      <div className="controls-grid">
        <div className="control-card">
          <label className="control-label">
            <Users size={16} /> Select Batch
          </label>
          <select
            className="control-input"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.trainer}
              </option>
            ))}
          </select>
        </div>

        <div className="control-card">
          <label className="control-label">
            <Calendar size={16} /> Select Date
          </label>
          <input
            type="date"
            className="control-input"
            value={selectedDate}
            max={getToday()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <div className="date-display">{formatDisplayDate(selectedDate)}</div>
        </div>
      </div>

      {batch && (
        <>
          <motion.div
            className="summary-cards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="summary-card present">
              <div className="summary-icon"><Check size={20} /></div>
              <div>
                <div className="summary-value">{presentCount}</div>
                <div className="summary-label">Present</div>
              </div>
            </div>
            <div className="summary-card absent">
              <div className="summary-icon"><X size={20} /></div>
              <div>
                <div className="summary-value">{absentCount}</div>
                <div className="summary-label">Absent</div>
              </div>
            </div>
            <div className="summary-card total">
              <div className="summary-icon"><Users size={20} /></div>
              <div>
                <div className="summary-value">{total}</div>
                <div className="summary-label">Total</div>
              </div>
            </div>
            <div className="summary-card percentage">
              <div className="summary-icon"><Sparkles size={20} /></div>
              <div>
                <div className="summary-value">{percentage}%</div>
                <div className="summary-label">Attendance</div>
              </div>
            </div>
          </motion.div>

          <div className="bulk-actions">
            <button
              className="btn-bulk present"
              onClick={() => handleMarkAll('present')}
            >
              <Check size={16} /> Mark All Present
            </button>
            <button
              className="btn-bulk absent"
              onClick={() => handleMarkAll('absent')}
            >
              <X size={16} /> Mark All Absent
            </button>
            <button
              className="btn-bulk reset"
              onClick={() => {
                const reset = {};
                batch.students.forEach(s => { reset[s.id] = 'present'; });
                setRecords(reset);
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <div className="students-list">
            <AnimatePresence>
              {batch.students.map((student, i) => {
                const status = records[student.id] || 'present';
                return (
                  <motion.div
                    key={student.id}
                    className={`student-row status-${status}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    layout
                  >
                    <div className="student-info">
                      <div className="student-avatar">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="student-details">
                        <div className="student-name">{student.name}</div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </div>
                    <div className="status-toggle">
                      <button
                        className={`status-btn present ${status === 'present' ? 'active' : ''}`}
                        onClick={() => handleToggle(student.id, 'present')}
                        aria-label="Mark present"
                      >
                        <Check size={16} /> Present
                      </button>
                      <button
                        className={`status-btn absent ${status === 'absent' ? 'active' : ''}`}
                        onClick={() => handleToggle(student.id, 'absent')}
                        aria-label="Mark absent"
                      >
                        <X size={16} /> Absent
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="save-section">
            <button className="btn btn-primary save-btn" onClick={handleSave}>
              <Save size={18} /> Save Attendance
            </button>
            <AnimatePresence>
              {savedMessage && (
                <motion.div
                  className="success-message"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Check size={16} /> {savedMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default MarkAttendance;
