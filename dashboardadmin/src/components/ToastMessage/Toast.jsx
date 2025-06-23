import { LuCheck } from "react-icons/lu";
import PropTypes from "prop-types";
import { MdDeleteOutline } from "react-icons/md";
import { MdError } from "react-icons/md";
import { useEffect } from "react";


const Toast = ({ isShown, message, type, onClose }) => {
    useEffect(() => {
        if (!isShown) return;
        const timeoutId = setTimeout(() => {
            onClose();
        }, 3000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [isShown, onClose]);

    if (!isShown) return null;

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col items-end space-y-2 animate-fade-in">
            <div
                className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg border text-base font-medium transition-all duration-300
                    ${type === "delete"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-green-50 border-green-200 text-green-700"}
                `}
            >
                <span className={`flex items-center justify-center rounded-full p-2 text-xl
                    ${type === "delete" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
                `}>
                    {type === "delete" ? <MdError /> : <LuCheck />}
                </span>
                <span>{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Fermer la notification"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

Toast.propTypes = {
    isShown: PropTypes.bool,
    message: PropTypes.string,
    type: PropTypes.oneOf(["delete", "success"]),
    onClose: PropTypes.func,
};

export default Toast;