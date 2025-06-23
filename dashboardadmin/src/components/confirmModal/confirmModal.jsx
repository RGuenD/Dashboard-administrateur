import React, { useEffect } from "react";


const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            const handleEscape = (e) => {
                if (e.key === "Escape") {
                    onClose();
                }
            };
            document.addEventListener("keydown", handleEscape);
            return () => {
                document.body.style.overflow = "auto";
                document.removeEventListener("keydown", handleEscape);
            };
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open, onClose]);

    if (!open) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
                <p className="text-gray-600 mb-6 text-center">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition"
                        onClick={onClose}
                        autoFocus
                    >
                        Annuler
                    </button>
                    <button
                        className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition"
                        onClick={onConfirm}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;