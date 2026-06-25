import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Users, Calendar, Check, X } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import AnimatedCard from '../components/AnimatedCard';
import '../styles/Statistics.css';

const Statistics = () => {
  const { batches, getBatchStats, getStudentStats } = useAttendance();
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.id || '');

  const batch = batches.find(b => b.id === selectedBatch);
  const stats = useMemo(() => getBatchStats(selectedBatch), [selectedBatch, getBatchStats]);

  const studentStats = useMemo(() => {
    if (!batch) return [];
    return batch.students.map(s => ({
      student: s,
      stats: getStudentStats(batch.id, s.id) || { total: 0, present: 0, absent: 0, percentage: 0 }
    })).sort((a, b) => b.stats.percentage - a.stats.percentage);
  }, [batch, getStudentStats, selectedBatch]);

  const batchComparisons = useMemo(() => {
    return batches.map(b => {
      const s = getBatchStats(b.id);
      return {
        batch: b,
        stats: s || { total: 0, present: 0, absent: 0, percentage: 0 }
      };
    });
  }, [batches, getBatchStats]);

  const getPercentageColor = (pct) => {
    if (pct >= 85) return 'var(--success)';
    if (pct >= 70) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getPercentageLabel = (pct) => {
    if (pct >= 85) return 'Excellent';
    if (pct >= 70) return 'Good';
    if (pct >= 50) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="page-header-icon">
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 className="page-title">Statistics & Analytics</h1>
          <p className="page-subtitle">Deep insights into attendance patterns</p>
        </div>
      </motion.div>

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

      {batch && stats && (
        <>
          <div className="stats-overview">
            <AnimatedCard delay={0.05}>
              <div className="overview-card gradient-1">
                <div className="overview-icon"><Calendar size={24} /></div>
                <div className="overview-value">{stats.total}</div>
                <div className="overview-label">Total Records</div>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.1}>
              <div className="overview-card gradient-2">
                <div className="overview-icon"><Check size={24} /></div>
                <div className="overview-value">{stats.present}</div>
                <div className="overview-label">Total Present</div>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.15}>
              <div className="overview-card gradient-3">
                <div className="overview-icon"><X size={24} /></div>
                <div className="overview-value">{stats.absent}</div>
                <div className="overview-label">Total Absent</div>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.2}>
              <div className="overview-card gradient-4">
                <div className="overview-icon"><TrendingUp size={24} /></div>
                <div className="overview-value">{stats.percentage}%</div>
                <div className="overview-label">Overall Rate</div>
              </div>
            </AnimatedCard>
          </div>

          <AnimatedCard>
            <div className="big-percentage-card">
              <div className="big-percentage-info">
                <h3>{batch.name} — Overall Attendance</h3>
                <p>Trainer: {batch.trainer} • {batch.students.length} students</p>
              </div>
              <div className="circular-progress">
                <svg viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke={getPercentageColor(stats.percentage)}
                    strokeWidth="10"
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    strokeDasharray={2 * Math.PI * 52}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - stats.percentage / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="circular-text">
                  <div className="circular-value">{stats.percentage}%</div>
                  <div className="circular-label">{getPercentageLabel(stats.percentage)}</div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard>
            <div className="section-block">
              <h3 className="block-title">
                <Award size={20} /> Student Performance Ranking
              </h3>
              <div className="ranking-list">
                {studentStats.map(({ student, stats: s }, i) => (
                  <motion.div
                    key={student.id}
                    className="ranking-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="rank-number">{i + 1}</div>
                    <div className="rank-info">
                      <div className="rank-name">{student.name}</div>
                      <div className="rank-stats">
                        {s.present} present / {s.total} sessions
                      </div>
                    </div>
                    <div className="rank-bar-wrapper">
                      <div className="rank-bar-bg">
                        <motion.div
                          className="rank-bar-fill"
                          style={{ background: getPercentageColor(s.percentage) }}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.percentage}%` }}
                          transition={{ duration: 1, delay: i * 0.05 }}
                        />
                      </div>
                      <div
                        className="rank-percentage"
                        style={{ color: getPercentageColor(s.percentage) }}
                      >
                        {s.percentage}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard>
            <div className="section-block">
              <h3 className="block-title">
                <BarChart3 size={20} /> Batch Comparison
              </h3>
              <div className="batch-comparison">
                {batchComparisons.map(({ batch: b, stats: s }, i) => (
                  <div key={b.id} className="batch-compare-item">
                    <div className="batch-compare-header">
                      <div className="batch-compare-name">{b.name}</div>
                      <div
                        className="batch-compare-percentage"
                        style={{ color: getPercentageColor(s.percentage) }}
                      >
                        {s.percentage}%
                      </div>
                    </div>
                    <div className="batch-compare-bar">
                      <motion.div
                        className="batch-compare-fill"
                        style={{ background: getPercentageColor(s.percentage) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </>
      )}
    </div>
  );
};

export default Statistics;
