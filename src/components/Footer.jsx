import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Mail, Heart } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  const socialLinks = [


    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/mohanraj-p-1465a6393/', color: '#0a66c2' },

    { icon: Github, label: 'GitHub', url: 'https://github.com/rajmoh142006-stack', color: '#ffffff' }
  ];

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,40 C240,100 480,0 720,40 C960,80 1200,20 1440,60 L1440,100 L0,100 Z"
            fill="url(#footerGradient)"
          />
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6c5ce7" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <GraduationCap size={28} />
              </div>
              <span className="footer-logo-text">Skill-Maxing</span>
            </div>
            <p className="footer-tagline">
              Empowering trainers with smart attendance tracking. Build skills, track progress, and grow together.
            </p>
            <div className="footer-contact">
              <Mail size={16} />
              <a href="mailto:hello@skillmaxing.com">hello@skillmaxing.com</a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-list">
              <li><a href="/">Home</a></li>
              <li><a href="/mark-attendance">Mark Attendance</a></li>
              <li><a href="/view-attendance">View Records</a></li>
              <li><a href="/statistics">Statistics</a></li>
              <li><a href="/batches">Batches</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-list">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#api">API Reference</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Connect With Us</h4>
            <p className="footer-social-text">Follow us for updates and learning tips</p>
            <div className="social-links">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="social-link"
                    style={{ '--accent': social.color }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={18} />
                    <span className="social-tooltip">{social.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} <strong>Skill-Maxing</strong>. All rights reserved.
          </p>
          <p className="footer-made">
            Made with <Heart size={14} className="heart-icon" /> by Skill-Maxing Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
