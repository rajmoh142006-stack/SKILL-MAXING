import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      className={`animated-card ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
