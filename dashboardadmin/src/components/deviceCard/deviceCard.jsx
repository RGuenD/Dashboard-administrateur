import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";
import DeviceType from "../deviceTypes";


const DeviceCard = ({
    nomAppareil,
    typeAppareil,
    
    pinMicro,
    etablissement,
    etageNom,
    zoneNom,
    createdAt,
    
    onDelete,
}) => {
    const deviceTypeInfo = DeviceType.getAllTypes().find(t => 
        t.id.toString() === typeAppareil?.toString() || 
        t.name === typeAppareil
    );

    if (!deviceTypeInfo) return null;

    const formatEmplacement = () => {
    const normalize = (val) =>
        val && val.trim() !== "" && val.trim().toLowerCase() !== "non spécifié"
            ? val
            : null;

    const parts = [
        normalize(etablissement),
        normalize(etageNom),
        normalize(zoneNom),
    ];

    const filteredParts = parts.filter(Boolean);
    return filteredParts.length > 0 ? filteredParts.join(" / ") : "Non spécifié";
};

    return (
        <div 
            className="relative bg-white rounded-xl shadow-md border-l-8 mb-4 flex flex-col 
                        transition hover:shadow-lg"
            style={{ borderLeftColor: deviceTypeInfo.color, borderLeftWidth: "0.3rem" }}
        >
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span 
                            className="w-9 h-9  flex items-center justify-center rounded-full shadow-md"
                            style={{ backgroundColor: deviceTypeInfo.color, color: 'white'  }}
                        >
                            {deviceTypeInfo.icon}
                        </span>
                        <div>
                            <h6 className="text-lg font-semibold text-gray-800 mb-0">{nomAppareil}</h6>
                            <small className="text-gray-400 block">Ajouté : {moment(createdAt).format('Do MMM YYYY')}</small>
                        </div>
                    </div>
                    <button 
                        className="text-red-500 hover:text-red-700 p-2 rounded transition"
                        onClick={onDelete}
                        title="Supprimer"
                    >
                        <MdDelete size={22} />
                    </button>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                    <div className="flex"><span className="w-28 font-medium text-gray-500">Type :</span>
                        <span className="text-gray-800">{deviceTypeInfo.name}</span>
                    </div>
                    
                    <div className="flex">
                        <span className="w-28 font-medium text-gray-500">Pin :</span>
                        <span className="text-gray-800">{pinMicro || "Non spécifié"}</span>
                        </div>
                    <div className="flex">
                        <span className="w-28 font-medium text-gray-500">Emplacement :</span>
                        <span className="text-gray-800">{formatEmplacement()}</span></div>
                </div>
            </div>
        </div>
    );
};

export default DeviceCard;