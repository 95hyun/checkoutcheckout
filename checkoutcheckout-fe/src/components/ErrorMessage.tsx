import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose, className = '' }) => {
  return (
    <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`} role="alert">
      <div className="flex items-center">
        <span className="block sm:inline">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto pl-3"
            aria-label="close"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;