import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ClipboardCheck, BarChart3, Calendar, Sparkles, ArrowRight, TrendingUp, Award, Zap } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import AnimatedCard from '../components/AnimatedCard';
import '../styles/Home.css';

const Home = () => {
  const { batches, attendance } = useAttendance();

  const totalStudents = batches.reduce((acc, b) => acc + b.students.length, 0);
  const totalSessions = Object.keys(attendance).length;
  const overallAttendance = (() => {
    const allRecords = Object.values(attendance).flat();
    if (allRecords.length === 0) return 0;
    const present = allRecords.filter(r => r.status === 'present').length;
    return ((present / allRecords.length) * 100).toFixed(1);
  })();

  const features = [
    {
      icon: ClipboardCheck,
      title: 'Mark Attendance',
      description: 'Quick and easy attendance marking with present/absent toggles for every student.',
      link: '/mark-attendance',
      color: '#6c5ce7',
      gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)'
    },
    {
      icon: Calendar,
      title: 'View Batch Records',
      description: 'Filter and view attendance records batch-wise and date-wise with detailed insights.',
      link: '/view-attendance',
      color: '#00d4ff',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #54a0ff 100%)'
    },
    {
      icon: BarChart3,
      title: 'Smart Statistics',
      description: 'Beautiful charts and percentages to track student progress and engagement levels.',
      link: '/statistics',
      color: '#ff6b6b',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
    },
    {
      icon: Users,
      title: 'Manage Batches',
      description: 'View all batches, students, and trainers in a clean, organized interface.',
      link: '/batches',
      color: '#00b894',
      gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)'
    }
  ];

  const stats = [
    { value: batches.length, label: 'Active Batches', icon: Users, color: '#6c5ce7' },
    { value: totalStudents, label: 'Total Students', icon: Award, color: '#00d4ff' },
    { value: totalSessions, label: 'Sessions Logged', icon: Calendar, color: '#ff6b6b' },
    { value: `${overallAttendance}%`, label: 'Avg Attendance', icon: TrendingUp, color: '#00b894' }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            <Sparkles size={14} />
            <span>Trainer Session Attendance Dashboard</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Track Attendance.
            <br />
            <span className="gradient-text">Max Out Skills.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The smartest way for training managers to track daily student attendance
            across multiple batches. Powerful, simple, and beautiful.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/mark-attendance" className="btn btn-primary">
              <Zap size={18} />
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link to="/statistics" className="btn btn-secondary">
              <BarChart3 size={18} />
              View Stats
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <AnimatedCard key={stat.label} delay={i * 0.1}>
                <div className="stat-card" style={{ '--accent': stat.color }}>
                  <div className="stat-icon">
                    <Icon size={22} />
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </section>

      <section className="features-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">
            Powerful features to streamline your attendance management
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimatedCard key={feature.title} delay={i * 0.1}>
                <Link to={feature.link} className="feature-card">
                  <div className="feature-icon" style={{ background: feature.gradient }}>
                    <Icon size={28} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-arrow">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </AnimatedCard>
            );
          })}
        </div>
      </section>

      <section className="cta-section">
        <AnimatedCard>
          <div className="cta-card">
            <h2>Ready to boost your training sessions?</h2>
            <p>Start tracking attendance in seconds. No setup required.</p>
            <Link to="/mark-attendance" className="btn btn-primary">
              Start Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </AnimatedCard>
      </section>
    </div>
  );
};

export default Home;
