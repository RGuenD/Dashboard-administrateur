import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const DeviceCard = ({ device, onDelete, onEdit }) => {
    const formatEmplacement = () => {
        const parts = [];
        if (device.etablissement && device.etablissement !== "Non spécifié") {
            parts.push(device.etablissement);
        }
        if (device.etageNom && device.etageNom !== "Non spécifié") {
            parts.push(device.etageNom);
        }
        if (device.zoneNom && device.zoneNom !== "Non spécifié") {
            parts.push(device.zoneNom);
        }
        return parts.length > 0 ? parts.join(" / ") : "Non spécifié";
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{device.nomAppareil}</h3>
                    <p className="text-sm text-gray-600">{device.typeAppareil}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(device)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => onDelete(device.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">IP:</span>
                    <span>{device.ipMicro || "Non spécifié"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">PIN:</span>
                    <span>{device.pinMicro || "Non spécifié"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Emplacement:</span>
                    <span>{formatEmplacement()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Créé le:</span>
                    <span>{new Date(device.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default DeviceCard; 