import React from 'react';

const ConfirmModal = ({ open, onClose, onConfirm, title, message, confirmText = "Confirmer", cancelText = "Annuler" }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button 
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        onClick={onClose}
                        autoFocus
                    >
                        {cancelText}
                    </button>
                    <button 
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors duration-200"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal; 