import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Filter, Calendar, Users, Check, X, Search, Download, FileText } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { formatDisplayDate, getToday } from '../utils/helpers';
import '../styles/Attendance.css';

const ViewAttendance = () => {
  const { batches, attendance, getAttendance } = useAttendance();
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [searchTerm, setSearchTerm] = useState('');

  const records = useMemo(
    () => getAttendance(selectedBatch, selectedDate),
    [selectedBatch, selectedDate, attendance, getAttendance]
  );

  const batch = batches.find(b => b.id === selectedBatch);

  const filteredRecords = useMemo(() => {
    if (!batch) return [];
    return batch.students
      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(student => {
        const record = records.find(r => r.studentId === student.id);
        return { student, status: record ? record.status : 'unmarked' };
      });
  }, [batch, records, searchTerm]);

  const presentCount = filteredRecords.filter(r => r.status === 'present').length;
  const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
  const unmarkedCount = filteredRecords.filter(r => r.status === 'unmarked').length;
  const total = filteredRecords.length;
  const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0;

  const handleExport = () => {
    if (!batch) return;
    const csv = [
      ['Student Name', 'Email', 'Status', 'Date', 'Batch'],
      ...filteredRecords.map(({ student, status }) => [
        student.name, student.email, status, selectedDate, batch.name
      ])
    ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_${batch.name}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="page-header-icon">
          <Eye size={28} />
        </div>
        <div>
          <h1 className="page-title">View Attendance</h1>
          <p className="page-subtitle">Browse and filter attendance records</p>
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
              <option key={b.id} value={b.id}>{b.name}</option>
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

      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary export-btn" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="summary-cards">
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
          <div className="summary-icon"><Filter size={20} /></div>
          <div>
            <div className="summary-value">{unmarkedCount}</div>
            <div className="summary-label">Unmarked</div>
          </div>
        </div>
        <div className="summary-card percentage">
          <div className="summary-icon"><FileText size={20} /></div>
          <div>
            <div className="summary-value">{percentage}%</div>
            <div className="summary-label">Attendance</div>
          </div>
        </div>
      </div>

      <div className="students-list">
        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No records found</h3>
            <p>Try adjusting your filters or marking attendance first.</p>
          </div>
        ) : (
          filteredRecords.map(({ student, status }, i) => (
            <motion.div
              key={student.id}
              className={`student-row status-${status}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
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
              <div className="status-badge">
                {status === 'present' && (
                  <span className="badge present">
                    <Check size={14} /> Present
                  </span>
                )}
                {status === 'absent' && (
                  <span className="badge absent">
                    <X size={14} /> Absent
                  </span>
                )}
                {status === 'unmarked' && (
                  <span className="badge unmarked">
                    Not Marked
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;
