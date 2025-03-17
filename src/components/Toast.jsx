// Toast.js
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Toast = ({ message, onClose }) => {
    return (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white p-4 rounded-lg shadow-lg transition-transform duration-300 ease-in-out animate-fade-in">
            <div className="flex items-center">
                <p>{message}</p>
                <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Toast;
