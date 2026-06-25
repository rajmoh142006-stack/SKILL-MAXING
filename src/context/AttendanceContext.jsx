import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AttendanceContext = createContext();

const STORAGE_KEY = 'skill_maxing_data_v2'; // ← Changed version to v2
const BATCHES_VERSION = '2.1'; // ← Bump this when you change batches/students

const initialBatches = [
 { id: 'b1', name: 'Full Stack Web Dev', trainer: 'Miss: Kavidharshini', students: [
    { id: 's1', name: 'Mohanraj P', email: 'Mohanraj@example.com' },
    { id: 's2', name: 'Nithish P', email: 'Nithish@example.com' },
    { id: 's3', name: 'Kishan', email: 'Kishan@example.com' },
    { id: 's4', name: 'Shailesh L', email: 'Shailesh@example.com' },
    { id: 's5', name: 'Shashikanth L', email: 'Shashikanth@example.com' }
  ]},
  { id: 'b2', name: 'Data Science Pro', trainer: 'MRS: Lakshmi', students: [
    { id: 's6', name: 'Jaithish S', email: 'Jaithish.com' },
    { id: 's7', name: 'Raja S', email: 'Raja@example.com' },
    { id: 's8', name: 'Rohithrajan U', email: 'rohit@example.com' }
  ]},
  { id: 'b3', name: 'UI/UX Design Mastery', trainer: 'Miss: Tamilarasi', students: [
    { id: 's9', name: 'Meerajasmine', email: 'Meerajasmine@example.com' },
    { id: 's10', name: 'Megala', email: 'Megala@example.com' },
    { id: 's11', name: 'Ramya', email: 'Ramya@example.com' },
    { id: 's12', name: 'Ragavi', email: 'Ragavi@example.com' }
  ]},
  { id: 'b4', name: 'Cloud & DevOps', trainer: 'MR: Palani', students: [
    { id: 's13', name: 'Sham', email: 'Sham@example.com' },
    { id: 's14', name: 'Gunasekar', email: 'Gunasekar@example.com' }
  ]}
];

// ✅ NEW: Smart loader that handles version changes
const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      
      // ✅ If version mismatch, ignore stored batches and use new ones
      if (parsed.batchesVersion !== BATCHES_VERSION) {
        console.log('🔄 New version detected, refreshing student list...');
        return null;
      }
      
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load data', err);
  }
  return null;
};

export const AttendanceProvider = ({ children }) => {
  const stored = loadData();
  const [batches, setBatches] = useState(stored?.batches || initialBatches);
  const [attendance, setAttendance] = useState(stored?.attendance || {});

  // ✅ Save with version key
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        batchesVersion: BATCHES_VERSION,
        batches,
        attendance
      }));
    } catch (err) {
      console.error('Failed to save data', err);
    }
  }, [batches, attendance]);

  const sanitize = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>]/g, '').trim().slice(0, 100);
  };

  const markAttendance = (batchId, date, records) => {
    const key = `${batchId}_${date}`;
    const sanitizedRecords = records.map(r => ({
      studentId: sanitize(r.studentId),
      status: r.status === 'present' ? 'present' : 'absent'
    }));
    setAttendance(prev => ({ ...prev, [key]: sanitizedRecords }));
  };

  const getAttendance = (batchId, date) => {
    const key = `${batchId}_${date}`;
    return attendance[key] || [];
  };

  // ✅ Smart merge: Updates student info but keeps their attendance records
  const mergeStudentInfo = (oldBatches, newBatches) => {
    return newBatches.map(newBatch => {
      const oldBatch = oldBatches.find(ob => ob.id === newBatch.id);
      if (!oldBatch) return newBatch;
      
      return {
        ...newBatch,
        students: newBatch.students.map(newStudent => {
          const oldStudent = oldBatch.students.find(os => os.id === newStudent.id);
          return oldStudent 
            ? { ...newStudent, name: newStudent.name } 
            : newStudent;
        })
      };
    });
  };

  const getBatchStats = (batchId) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return null;

    const batchAttendance = Object.keys(attendance)
      .filter(k => k.startsWith(`${batchId}_`))
      .reduce((acc, k) => {
        acc.push(...attendance[k]);
        return acc;
      }, []);

    const total = batchAttendance.length;
    const present = batchAttendance.filter(r => r.status === 'present').length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { total, present, absent, percentage: parseFloat(percentage) };
  };

  const getStudentStats = (batchId, studentId) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return null;

    const records = Object.keys(attendance)
      .filter(k => k.startsWith(`${batchId}_`))
      .flatMap(k => attendance[k].map(r => ({ ...r, date: k.split('_')[1] })))
      .filter(r => r.studentId === studentId);

    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { total, present, absent: total - present, percentage: parseFloat(percentage) };
  };

  // ✅ Reset function to clear localStorage
  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBatches(initialBatches);
    setAttendance({});
    window.location.reload();
  };

  const value = useMemo(() => ({
    batches,
    attendance,
    markAttendance,
    getAttendance,
    getBatchStats,
    getStudentStats,
    resetData
  }), [batches, attendance]);

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};
