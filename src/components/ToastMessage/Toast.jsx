import React, { useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Toast = ({ isShown, message, type, onClose }) => {
    useEffect(() => {
        if (isShown) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isShown, onClose]);

    if (!isShown) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
            isShown ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
            <div className={`flex items-center p-4 rounded-lg shadow-lg ${
                type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                <div className="flex-shrink-0">
                    {type === 'success' ? (
                        <FaCheck className="h-5 w-5" />
                    ) : (
                        <FaTimes className="h-5 w-5" />
                    )}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                    <FaTimes className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast; 