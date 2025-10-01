import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideIn = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const MotionWrapper = ({ children, animation = fadeIn, className = "" }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animation}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;