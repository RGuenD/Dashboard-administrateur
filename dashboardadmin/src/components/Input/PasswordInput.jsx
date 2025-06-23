import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import PropTypes from 'prop-types';
import "./../../index.css";


function PasswordInput({ value, onChange, placeholder }) {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setIsShowPassword(prevState => !prevState);
    };

    return (
        <div className="relative w-full">
            <input 
                value={value}
                onChange={onChange}
                type={isShowPassword ? "text" : "password"}
                placeholder={placeholder || "Mot de passe"}
                className="w-full px-4 py-3 border-2 rounded-lg text-gray-700 
                text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 
                focus:border-blue-500 transition placeholder-gray-400 pr-12"
            />
            <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                onClick={toggleShowPassword}
                aria-label={isShowPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
                {isShowPassword ? (
                    <FaRegEye size={22} />
                ) : (
                    <FaRegEyeSlash size={22} />
                )}
            </button>
        </div>
    );
}

PasswordInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

export default PasswordInput;
