import React, { useState, useEffect } from "react";
import { db, ref, onValue, push, set  } from "./../../services/firebaseConfig";
import DeviceType from "./../deviceTypes";
import {MdClose} from  "react-icons/md"
import { HiPlus } from "react-icons/hi";


const DeviceForm = ({ onClose, onSubmit  }) => {
    const [nomAppareil, setNomAppareil] = useState("");
    const [typeAppareil, setTypeAppareil] = useState("");

    const [pinMicro, setPinMicro] = useState("");
    const [etablissements, setEtablissements] = useState([]);
    const [etabSelectionne, setEtabSelectionne] = useState("");
    const [etageSelectionne, setEtageSelectionne] = useState("");
    const [zoneSelectionnee, setZoneSelectionnee] = useState(null);


    const deviceTypes = DeviceType.getAllTypes();

    useEffect(() => {
        const unsubscribe = onValue(ref(db, "etablissements"), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const etablissementsArray = Object.keys(data).map((key) => data[key]);
                setEtablissements(etablissementsArray);
            } else {
                setEtablissements([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const getEtages = () => {
        if (!etabSelectionne) return [];
        const etab = etablissements.find((e) => e.id === etabSelectionne);
        if (!etab || !etab.etages) return [];
        return Object.values(etab.etages).map(etage => ({
            id: etage.id || "default-id",
            nom: etage.nom
        }));
    };

    const getZones = () => {
        if (!etabSelectionne || !etageSelectionne) return [];
        const etab = etablissements.find((e) => e.id === etabSelectionne);
        if (!etab || !etab.etages || !etab.etages[etageSelectionne]?.zones) return [];
        return Object.entries(etab.etages[etageSelectionne].zones).map(([id, zone]) => ({
            id: id || "default-zone-id",
            nom: zone.nom || `Zone ${id}`
        }));
    };






    const handleSubmit = async (e) => {
        e.preventDefault();
        const isPorte = deviceTypes.find(t => t.id.toString() === typeAppareil)?.name === "Porte";
        if (!zoneSelectionnee && !isPorte) {
            alert("Veuillez sélectionner une zone valide");
            return;
        }
        const getEtablissementNom = () => {
            if (!etabSelectionne) return "";
            const etab = etablissements.find((e) => e.id === etabSelectionne);
            return etab ? etab.nom : "";
        };

        const getEtageNom = () => {
            if (!etageSelectionne) return "";
            const etages = getEtages();
            const etage = etages.find(e => e.id === etageSelectionne);
            return etage ? etage.nom : "";
        };

        const capteurs = DeviceType.getDefaultSensorsByType(
            deviceTypes.find(t => t.id.toString() === typeAppareil)?.name
        );
        const newDevice = {
            nomAppareil,
            typeAppareil: deviceTypes.find(t => t.id.toString() === typeAppareil)?.name || typeAppareil,
            pinMicro,
            etablissementNom: getEtablissementNom(),
            etageNom: getEtageNom(),
            zoneNom: zoneSelectionnee?.nom || (isPorte ? "" : ""),
            zoneId: zoneSelectionnee?.id || (isPorte ? null : null),
            etablissementId: etabSelectionne,
            etageId: etageSelectionne ,
            capteurs: Object.fromEntries(capteurs.map(c => [c.type, c])
            ),

        };

        try{
            let deviceRef;

            if (isPorte && !zoneSelectionnee) {
                deviceRef = ref(
                    db,
                    `etablissements/${etabSelectionne}/etages/${etageSelectionne}/devices`
                );
            } else {
                deviceRef = ref(
                    db,
                    `etablissements/${etabSelectionne}/etages/${etageSelectionne}/zones/${zoneSelectionnee.id}/devices`
                );
            }
            const newDeviceRef = push(deviceRef);
            const DeviceId= newDeviceRef.key;
            await set(newDeviceRef, { 
                id: newDeviceRef.key,
                ...newDevice,
                nom: nomAppareil,
                updatedAt: new Date().toISOString()
            
            });
            if (onSubmit) {
                onSubmit({ id: newDeviceRef.key, ...newDevice });
                }
            onClose();
        }catch(err){
            console.error(err);
        }
        setNomAppareil("");
        setTypeAppareil("");
        setPinMicro("");
        setEtabSelectionne("");
        setEtageSelectionne("");
        setZoneSelectionnee(null); 
        
    };

    return (
        <div className="relative">
            <button
            className="w-18 h-18 border-none flex  ml-[400px] items-center 
                        justify-center absolute -top-3 -right-3 bg-white justify-self-end"
            onClick={onClose}
            >
                <MdClose className="text-xl text-slate-400" size={23} />
            </button>
            
        
                <div className="p-6 ">
                    <h2 className="font-sans text-2xl font-bold text-gray-800 mb-6">Ajouter un Appareil</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'appareil</label>
                            <input
                                type="text"
                                value={nomAppareil}
                                onChange={(e) => setNomAppareil(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded 
                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type de l'appareil</label>
                            <select
                                value={typeAppareil}
                                onChange={(e) => setTypeAppareil(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded
                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">-- Sélectionner --</option>
                                {deviceTypes.map((type, index) => (
                                    <option key={`device-type-${type.id}-${index}`} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pin microcontrôleur</label>
                            <input
                                type="text"
                                value={pinMicro}
                                onChange={(e) => setPinMicro(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded
                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
                            <select
                                value={etabSelectionne}
                                onChange={(e) => {
                                    setEtabSelectionne(e.target.value);
                                    setEtageSelectionne("");
                                    setZoneSelectionnee("");
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded
                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">-- Sélectionner un établissement --</option>
                                {etablissements.map((etab) => (
                                    <option key={`etab-${etab.id}`} value={etab.id}>
                                        {etab.nom} - {etab.emplacement}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Étage</label>
                            <select
                                value={etageSelectionne}
                                onChange={(e) => {
                                    setEtageSelectionne(e.target.value);
                                    setZoneSelectionnee("");
                                }}
                                disabled={!etabSelectionne}
                                className={`w-full px-3 py-2 border rounded 
                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    !etabSelectionne ? 'bg-gray-100 border-gray-200 text-gray-500' : 'border-gray-300'
                                }`}
                                required
                            >
                                <option value="">-- Sélectionner un étage --</option>
                                {getEtages().map((etage) => (
                                    <option key={`etage-${etage.id}`} value={etage.id}>
                                        {etage.nom}
                                    </option>
                                ))}
                                {getEtages().length === 0 && (
                                    <option disabled>Aucun étage disponible</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                            <select
                                value={zoneSelectionnee?.id || ""}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selectedZone = getZones().find(z => z.id === selectedId);
                                    setZoneSelectionnee(selectedZone || null);
                                }}
                                disabled={!etageSelectionne}
                                required={deviceTypes.find(t => t.id.toString() === typeAppareil)?.name !== "Porte"}
                                className={`w-full px-3 py-2 border rounded
                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    !etageSelectionne ? 'bg-gray-100 border-gray-200 text-gray-500' : 'border-gray-300'
                                }`}
                                
                            >
                                <option value="">-- Sélectionner une zone --</option>
                                {getZones().map((zone, index) => (
                                    <option key={`zone-${zone.id}-${index}`} value={zone.id}>
                                        {zone.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                    
                        <div className="flex justify-end space-x-3 pt-4">
                            
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 
                                        to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg py-3 text-lg 
                                        shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                                            
                            >
                                <><HiPlus />Ajouter</>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

    );
};

export default DeviceForm;