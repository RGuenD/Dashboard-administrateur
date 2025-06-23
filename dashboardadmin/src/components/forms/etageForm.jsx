import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { db, ref, push, set } from "../../services/firebaseConfig";

const EtageForm = ({ etablissements, showToast }) => {
    const [nomEtage, setNomEtage] = useState("");
    const [etabSelectionne, setEtabSelectionne] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validerFormulaire = () => {
        let erreurs = {};
        if (!nomEtage.trim()) erreurs.nomEtage = "Le nom de l'étage est requis.";
        if (!etabSelectionne) erreurs.etabSelectionne = "Veuillez sélectionner un établissement.";
        setErrors(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    const ajouterEtage = async () => {
        if (!validerFormulaire()) return;

        setIsSubmitting(true);
        try {
            const etagesRef = ref(db, `etablissements/${etabSelectionne}/etages`);
            const newEtageRef = push(etagesRef);
            await set(newEtageRef, {
                id: newEtageRef.key,
                nom: nomEtage,
                zones:{}
            });

            showToast("Étage ajouté avec succès.", "success");
            setNomEtage("");
            setEtabSelectionne("");
            setErrors({});
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            showToast("Erreur lors de l'ajout de l'étage.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100">
            <form onSubmit={ajouterEtage} className="flex flex-col gap-6 h-full" action="#">
                <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center tracking-tight">Ajouter un Étage</h2>
                <div className="flex flex-col gap-4 flex-grow">
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Établissement associé à cet étage</label>
                        <select
                            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 text-base bg-white 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 
                                transition ${errors.etabSelectionne ? 'border-red-400' : 'border-blue-200'}`}
                            value={etabSelectionne}
                            onChange={(e) => setEtabSelectionne(e.target.value)}
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
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Nom de l'étage</label>
                        <input
                            type="text"
                            placeholder="Nom de l'étage"
                            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 text-base bg-white focus:outline-none 
                                focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition 
                                placeholder-gray-400 ${errors.nomEtage ? 'border-red-400' : 'border-blue-200'}`}
                            value={nomEtage}
                            onChange={(e) => setNomEtage(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {errors.nomEtage && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nomEtage}</p>}
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

export default EtageForm;