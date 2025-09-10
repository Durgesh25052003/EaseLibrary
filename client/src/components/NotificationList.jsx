import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const notificationVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

function NotificationList({ notifications, onRemove }) {
  return (
    <div className="top-5 right-5 z-50 w-80 space-y-3">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
            transition={{ duration: 0.3 }}
            className={`${notif.type==="Return"?"bg-red-200":"bg-green-200"} border-l-4 border-primary shadow-lg rounded-md p-4 flex items-start gap-3`}
          >
            <div className="flex-1">
              <div className="font-semibold text-primary">{notif.title}</div>
              <div className="text-black text-sm">{notif.message}</div>
            </div>
            <button
              onClick={() => onRemove(notif.id)}
              className="ml-2 text-gray-400 hover:text-primary"
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NotificationList;