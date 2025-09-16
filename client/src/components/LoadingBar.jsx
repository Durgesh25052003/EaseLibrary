import React from 'react';
import { motion } from 'framer-motion';

const LoadingBar = ({ 
  type = 'default', 
  progress = 0, 
  isLoading = true,
  size = 'medium',
  text = 'Loading...' 
}) => {
  if (!isLoading) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-8 h-8';
      case 'large': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const renderLoadingContent = () => {
    switch (type) {
      case 'progress':
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">{text}</p>
          </div>
        );

      case 'spinner':
        return (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className={`border-4 border-gray-200 border-t-blue-500 rounded-full ${getSizeClasses()}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm text-gray-600 mt-2">{text}</p>
          </div>
        );

      case 'dots':
        return (
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">{text}</span>
          </div>
        );

      case 'pulse':
        return (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className={`bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full ${getSizeClasses()}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <p className="text-sm text-gray-600 mt-2">{text}</p>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className={`animate-spin rounded-full border-4 border-blue-500 border-t-transparent ${getSizeClasses()}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm text-gray-600 mt-2">{text}</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center"
    >
      {renderLoadingContent()}
    </motion.div>
  );
};

// Full-screen loading overlay
export const FullScreenLoading = ({ isLoading, type = 'default', text = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <LoadingBar type={type} text={text} />
      </div>
    </motion.div>
  );
};

export default LoadingBar;