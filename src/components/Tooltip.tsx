import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 border-t-4 border-l-transparent border-l-4 border-r-transparent border-r-4',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800 border-b-4 border-l-transparent border-l-4 border-r-transparent border-r-4',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800 border-l-4 border-t-transparent border-t-4 border-b-transparent border-b-4',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800 border-r-4 border-t-transparent border-t-4 border-b-transparent border-b-4'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs">
              {content}
              <div className={`absolute ${arrowClasses[position]}`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;