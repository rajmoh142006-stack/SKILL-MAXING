import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="loader-container">
      <motion.div
        className="loader-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </motion.div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
