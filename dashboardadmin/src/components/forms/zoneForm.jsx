import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";

import { db, ref, push, set } from "../../services/firebaseConfig";

const ZoneForm = ({
    etablissements,
    showToast
}) => {
    const [nomZone, setNomZone] = useState("");
    const [etabSelectionne, setEtabSelectionne] = useState("");
    const [etageSelectionne, setEtageSelectionne] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const formErrors = {};
        let isValid = true;

        if (!etabSelectionne) {
            formErrors.etabSelectionne = "Veuillez sélectionner un établissement.";
            isValid = false;
        }
        if (!etageSelectionne) {
            formErrors.etageSelectionne = "Veuillez sélectionner un étage.";
            isValid = false;
        }
        if (!nomZone.trim()) {
            formErrors.nomZone = "Le nom de la zone est requis.";
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            
            const etab = etablissements.find(e => e.id === etabSelectionne);
            const zones = etab?.etages?.[etageSelectionne]?.zones || {};
            const zoneExists = Object.values(zones).some(
                zone => zone.nom.toLowerCase() === nomZone.toLowerCase()
            );

            if (zoneExists) {
                showToast("Erreur: Cette zone existe déjà pour cet étage.", "error");
                return;
            }


            const zonesRef = ref(db, `etablissements/${etabSelectionne}/etages/${etageSelectionne}/zones`);
            const nouvelleZoneRef = push(zonesRef);
            const zoneId = nouvelleZoneRef.key; 
            await set(nouvelleZoneRef, {
                id: zoneId,
                nom: nomZone.trim(),
                createdAt: new Date().toISOString()
            });

            showToast("Zone ajoutée avec succès.", "success");
            setNomZone("");
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
            showToast("Erreur lors de l'ajout de la zone.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEtabChange = (e) => {
        setEtabSelectionne(e.target.value);
        setEtageSelectionne(""); 
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full" action="#">
                <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center tracking-tight">Ajouter une Zone</h2>
                <div className="flex flex-col gap-4 flex-grow">
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Établissement associé à cette zone</label>
                        <select
                            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 
                                text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 
                                focus:border-blue-500 transition ${errors.etabSelectionne ? 'border-red-400' : 'border-blue-200'}`}
                            value={etabSelectionne}
                            onChange={handleEtabChange}
                            disabled={isSubmitting}
                        >
                            <option value="">Sélectionner un établissement</option>
                            {etablissements.map((etab) => (
                                <option key={etab.id} value={etab.id}>
                                    {etab.nom} - {etab.emplacement}
                                </option>
                            ))}
                        </select>
                        {errors.etabSelectionne && <p className="text-red-500 text-xs mt-1 font-medium">{errors.etabSelectionne}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Choisir un étage</label>
                        <select
                            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 text-base bg-white 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 
                                transition ${errors.etageSelectionne ? 'border-red-400' : 'border-blue-200'}`}
                            value={etageSelectionne}
                            onChange={(e) => setEtageSelectionne(e.target.value)}
                            disabled={!etabSelectionne || isSubmitting}
                        >
                            <option value="">Sélectionner un étage</option>
                            {etabSelectionne && 
                                etablissements.find(e => e.id === etabSelectionne)?.etages &&
                                Object.entries(
                                    etablissements.find(e => e.id === etabSelectionne).etages
                                ).map(([idEtage, etage]) => (
                                    <option key={idEtage} value={idEtage}>
                                        {etage.nom}
                                    </option>
                                ))
                            }
                        </select>
                        {errors.etageSelectionne && <p className="text-red-500 text-xs mt-1 font-medium">{errors.etageSelectionne}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Nom de la zone</label>
                        <input
                            type="text"
                            placeholder="Zone"
                            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 text-base bg-white 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition 
                                placeholder-gray-400 ${errors.nomZone ? 'border-red-400' : 'border-blue-200'}`}
                            value={nomZone}
                            onChange={(e) => setNomZone(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {errors.nomZone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nomZone}</p>}
                    </div>
                </div>
                <div className="pt-2">
                    <button 
                        type="submit"
                        className="w-[200px] flex items-center justify-center justify-self-center gap-2 bg-gradient-to-r from-blue-700 
                                    to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg py-3 text-lg 
                                    shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        ) : (
                            <><HiPlus className="text-xl" /> Ajouter</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ZoneForm;