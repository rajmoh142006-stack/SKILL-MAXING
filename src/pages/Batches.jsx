import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Mail, BookOpen, UserCheck } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import AnimatedCard from '../components/AnimatedCard';
import '../styles/Batches.css';

const Batches = () => {
  const { batches, getBatchStats } = useAttendance();

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="page-header-icon">
          <Users size={28} />
        </div>
        <div>
          <h1 className="page-title">All Batches</h1>
          <p className="page-subtitle">Manage and view all training batches</p>
        </div>
      </motion.div>

      <div className="batches-grid">
        {batches.map((batch, i) => {
          const stats = getBatchStats(batch.id) || { percentage: 0, present: 0, absent: 0, total: 0 };
          return (
            <AnimatedCard key={batch.id} delay={i * 0.08}>
              <div className="batch-card">
                <div className="batch-card-header">
                  <div className="batch-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="batch-info">
                    <h3 className="batch-name">{batch.name}</h3>
                    <p className="batch-trainer">
                      <GraduationCap size={14} /> {batch.trainer}
                    </p>
                  </div>
                </div>

                <div className="batch-stats-row">
                  <div className="batch-stat">
                    <Users size={16} />
                    <span><strong>{batch.students.length}</strong> students</span>
                  </div>
                  <div className="batch-stat">
                    <UserCheck size={16} />
                    <span><strong>{stats.percentage}%</strong> avg</span>
                  </div>
                </div>

                <div className="students-grid">
                  {batch.students.map((student, idx) => (
                    <motion.div
                      key={student.id}
                      className="student-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 + idx * 0.03 }}
                    >
                      <div className="chip-avatar">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="chip-info">
                        <div className="chip-name">{student.name}</div>
                        <div className="chip-email">
                          <Mail size={10} /> {student.email}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          );
        })}
      </div>
    </div>
  );
};

export default Batches;
