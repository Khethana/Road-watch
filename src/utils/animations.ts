export const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: 'easeOut' 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 } 
  }
};

export const cardVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, 
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
};

export const sidebarVariants = {
  open: { x: 0 },
  closed: { x: -280 },
  transition: { 
    type: 'spring',
    stiffness: 300, 
    damping: 30 
  }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.2 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 } 
  }
};
