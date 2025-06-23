import React, { useState } from 'react';
import { HiPlus } from "react-icons/hi";
import { db, ref, push, set } from "../../services/firebaseConfig";

const EtablissementForm = ({ 
    etablissements,
    showToast 
}) => {
    const [nomEtab, setNomEtab] = useState("");
    const [emplacement, setEmplacement] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;
        
        if (!nomEtab.trim()) {
            formErrors.nomEtab = "Le nom de l'établissement est requis.";
            isValid = false;
        }
        
        if (!emplacement.trim()) {
            formErrors.emplacement = "L'emplacement est requis.";
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
            const existe = etablissements.some(
                etab => etab.nom.toLowerCase() === nomEtab.toLowerCase()
            );
            
            if (existe) {
                showToast("Erreur: Cet établissement existe déjà.", "error");
                return;
            }
            const newEtabRef = push(ref(db, "etablissements"));
            await set(newEtabRef, {
                id: newEtabRef.key,
                nom: nomEtab,
                emplacement: emplacement,
                etages: {}
            });

            showToast("Établissement ajouté avec succès.", "success");
            setNomEtab("");
            setEmplacement("");
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
            showToast("Erreur lors de l'ajout de l'établissement.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white  to-white rounded-2xl shadow-lg border border-blue-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full" action="#">
                <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center tracking-tight">Ajouter un Établissement</h2>
                <div className="flex flex-col gap-4 flex-grow">
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Nom de l'établissement</label>
                        <input
                            type="text"
                            placeholder="Nom"
                            className={`w-full  px-4 py-3 border-2 rounded-lg text-gray-700 text-base bg-white focus:outline-none focus:ring-2 
                                    focus:ring-blue-400 focus:border-blue-500 transition placeholder-gray-400 ${errors.nomEtab ? 'border-red-400' : 'border-blue-200'}`}
                            value={nomEtab}
                            onChange={(e) => setNomEtab(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {errors.nomEtab && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nomEtab}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Emplacement de l'établissement</label>
                        <input
                            type="text"
                            placeholder="Emplacement"
                            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 text-base bg-white focus:outline-none 
                                    focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition placeholder-gray-400 ${errors.emplacement ? 'border-red-400' : 'border-blue-200'}`}
                            value={emplacement}
                            onChange={(e) => setEmplacement(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {errors.emplacement && <p className="text-red-500 text-xs mt-1 font-medium">{errors.emplacement}</p>}
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

export default EtablissementForm;
