import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button"; // Assuming you have a Button component

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={onClose} // Close on overlay click
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {title}
            </h3>
            <div className="text-sm text-gray-600 mb-6">{children}</div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                {cancelText}
              </Button>
              {onConfirm && (
                <Button
                  variant={variant}
                  onClick={onConfirm}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {confirmText}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
