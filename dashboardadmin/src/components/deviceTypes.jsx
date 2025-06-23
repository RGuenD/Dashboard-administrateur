import { LuAirVent } from "react-icons/lu";
import { BsDoorOpenFill } from "react-icons/bs";
import { VscLightbulbSparkle } from "react-icons/vsc";
import { FaFaucetDrip, FaHouseFire } from "react-icons/fa6";

class DeviceType {
    constructor(id, name, icon, color) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.color = color;
    }
    
    static getAllTypes() {
        return [
            new DeviceType(1, "Climatiseur", <LuAirVent />, "#3b82f6"),
            new DeviceType(2, "Lampe", <VscLightbulbSparkle />, "#fbbf24"),
            new DeviceType(3, "Porte", <BsDoorOpenFill />, "#64C04F"),
            new DeviceType(4, "Détecteur de fumée", <FaHouseFire />, "#ef4444"),
            new DeviceType(5, "Détecteur de fuite d'eau", <FaFaucetDrip />, "#60a5fa"),
        ];
    }
    static getDefaultSensorsByType(typeName) {
    const sensorsMap = {
        "Climatiseur": [
            { type: "température", unité: "°C", valeur: 0 },

            { type: "état", unité: "", valeur: "off" },
        ],
        "Lampe": [
            { type: "état", unité: "", valeur: "off" }, 
            {type: "luminosité", unité: "lx", valeur: 0},
        ],
        "Porte": [
            { type: "état", unité: "", valeur: "fermée" }, 
        ],
        "Détecteur de fumée": [
            { type: "fumée", unité: "ppm", valeur: 0 },
            { type: "flamme", unité: "", valeur: "non détectée" },
        ],
        "Détecteur de fuite d'eau": [
            { type: "débitEau", unité: "L/min", valeur: 0 },
            { type: "présence", unité: "", valeur: "absent" },
            { type: "mouvement", unité: "", valeur: "non détecté" },
        ]
    };

    return sensorsMap[typeName] || [];
}

    static getTypeById(id) {
        return this.getAllTypes().find(type => type.id === id);
    }

    static getTypeByName(name) {
        return this.getAllTypes().find(type => type.name === name);
    }
}

export default DeviceType;