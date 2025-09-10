import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiBookOpen } from 'react-icons/fi';

const SplashScreen = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setLoading(false);
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-yellow-400 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FiBookOpen className="w-24 h-24 text-white opacity-20" />
            </motion.div>
            <FiBook className="w-20 h-20 text-white mx-auto relative z-10" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold text-white mb-2"
        >
           Ease Library 
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-blue-100 text-lg mb-8"
        >
          Your digital library companion
        </motion.p>

        <div className="w-64 mx-auto">
          <div className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-white text-sm mt-2">
            {Math.round(progress)}% Loading...
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <p className="text-white text-sm animate-pulse">
            Welcome to your library experience
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;