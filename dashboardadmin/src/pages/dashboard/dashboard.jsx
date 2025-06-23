import React, { useState, useEffect } from "react";
import { db, ref, onValue, remove } from "./../../services/firebaseConfig";
import Toast from "./../../components/ToastMessage/Toast";
import ConfirmModal from "./../../components/confirmModal/confirmModal";
import { FaBuilding, FaLayerGroup, FaMapMarkerAlt } from "react-icons/fa";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import Sidebar from "../../components/Sidebar/sidebar";
import ZoneForm from "../../components/forms/zoneForm";
import EtablissementForm from "../../components/forms/etabForm";
import EtageForm from "../../components/forms/etageForm";
import SearchBar from "../../components/SearchBar/SearchBar";

const Dashboard = () => {
    const [etablissements, setEtablissements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ isShown: false, message: "", type: "success" });
    const [openEtages, setOpenEtages] = useState({});
    const [openZones, setOpenZones] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const etablissementsRef = ref(db, "etablissements");
        const unsubscribe = onValue(etablissementsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const etablissementsTab = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                    etages: data[key].etages || {}
                }));
                setEtablissements(etablissementsTab);
            } else {
                setEtablissements([]);
            }
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, []);

    const showToast = (message, type) => {
        setToast({ isShown: true, message, type });
        setTimeout(() => setToast({ isShown: false, message: "", type: "success" }), 3000);
    };

    const toggleEtages = (etabId) => {
        setOpenEtages(prev => ({
            ...prev,
            [etabId]: !prev[etabId]
        }));
    };

    const toggleZones = (etageId) => {
        setOpenZones(prev => ({
            ...prev,
            [etageId]: !prev[etageId]
        }));
    };

    const handleDeleteClick = (type, id, parentId = null, name = "") => {
        setItemToDelete({ type, id, parentId, name });
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        
        try {
            switch (itemToDelete.type) {
                case 'etablissement':
                    await remove(ref(db, `etablissements/${itemToDelete.id}`));
                    showToast("Établissement supprimé avec succès.", "success");
                    break;
                case 'etage':
                    await remove(ref(db, 
                        `etablissements/${itemToDelete.parentId}/etages/${itemToDelete.id}`));
                    showToast("Étage supprimé avec succès.", "success");
                    break;
                case 'zone':
                    await remove(ref(db,
                            `etablissements/${itemToDelete.parentId.etabId}/etages/${itemToDelete.parentId.etageId}/zones/${itemToDelete.id}`));
                    showToast("Zone supprimée avec succès.", "success");
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            showToast("Erreur lors de la suppression.", "error");
        } finally {
            setShowConfirmModal(false);
            setItemToDelete(null);
        }
    };

    const getDeleteMessage = () => {
        if (!itemToDelete) return "";
        
        switch (itemToDelete.type) {
            case 'etablissement':
                return `Êtes-vous sûr de vouloir supprimer l'établissement "${itemToDelete.name}" et tous ses étages/zones ?`;
            case 'etage':
                return `Êtes-vous sûr de vouloir supprimer l'étage "${itemToDelete.name}" et toutes ses zones ?`;
            case 'zone':
                return `Êtes-vous sûr de vouloir supprimer la zone "${itemToDelete.name}" ?`;
            default:
                return "Êtes-vous sûr de vouloir supprimer cet élément ?";
        }
    };

    const rechercheFnc = (etablissements) => {
        if (!searchQuery) return etablissements;

        const query = searchQuery.toLowerCase();
        return etablissements.filter(etab => {
            if (etab.nom.toLowerCase().includes(query) || 
                etab.emplacement.toLowerCase().includes(query)) {
                return true;
            }

            const rechEtages = Object.entries(etab.etages).filter(([, etageData]) => {
                if (etageData.nom.toLowerCase().includes(query)) {
                    return true;
                }

                if (etageData.zones) {
                    return Object.values(etageData.zones).some(zone => 
                        zone.nom.toLowerCase().includes(query)
                    );
                }
                return false;
            });

            return rechEtages.length > 0;
        });
    };

    return (
        <>
        <div className="flex">
            <Sidebar />
            <div className="w-full lg:w-[calc(100%-290px)] lg:ml-[290px] transition-all duration-300">
                <div className="p-4 ">
                    <h1 className="dashboard-title  text-3xl font-semibold mb-6">
                        Gestion des Établissements</h1>
                    
                    <SearchBar 
                        placeholder="Rechercher un établissement, étage ou zone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    <Toast 
                        isShown={toast.isShown} 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast({ isShown: false, message: "", type: "success" })} 
                    />
                    
                    <div className="flex flex-row gap-4">
                        <EtablissementForm 
                            etablissements={etablissements}
                            showToast={showToast}
                        />
                        <EtageForm
                            etablissements={etablissements}
                            showToast={showToast}
                        />
                        <ZoneForm
                            etablissements={etablissements}
                            showToast={showToast}
                        />
                    </div>
                </div>
                    

                <div className="p-4  mt-4">
                    {loading ? (
                        <div className="loading-message">Chargement en cours...</div>
                            ) :rechercheFnc (etablissements).length === 0 ? (
                                    <div className="no-data-message">
                                        {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucun établissement trouvé"}
                                    </div>
                            ) : (
                                rechercheFnc(etablissements).map((etab) => (
                                    <div key={etab.id} className="bg-white rounded shadow-md mb-4">
                                        <div 
                                            className="p-3  flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => toggleEtages(etab.id)}
                                        >
                                            <div className="flex  items-center gap-2">
                                            <FaBuilding className="text-blue-500 mr-3" 
                                            />
                                            <h3 className="text-[21px] font-medium">{etab.nom} - {etab.emplacement}</h3>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500">
                                                    {openEtages[etab.id] ? <FaChevronUp /> : <FaChevronDown />}
                                                </span>
                                                <FaTrash
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    color="red"
                                                    onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick('etablissement', etab.id, null, etab.nom);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                            {openEtages[etab.id] && (
                                                <div className="border-t border-gray-100">
                                                    {Object.keys(etab.etages).length === 0 ? (
                                                        <p className="p-4 text-gray-500">Aucun étage disponible</p>
                                                    ) : (
                                                        Object.entries(etab.etages).map(([etageId, etageData]) => {
                                                            const uniqueEtageId = `${etab.id}-${etageId}`;
                                                            return (
                                                    <div key={etageId} className="bg-gray-50">
                                                            <div 
                                                                className="p-4 flex justify-between items-center cursor-pointer 
                                                                hover:bg-gray-100 transition-colors"
                                                                onClick={() => toggleZones(uniqueEtageId)}
                                                            >
                                                                <div className="flex items-center">
                                                                    <FaLayerGroup className="text-green-500 mr-3" />
                                                                    <h4 className="font-medium text-[21px]">{etageData.nom}</h4>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-gray-500">
                                                                        {openZones[uniqueEtageId] ? <FaChevronUp /> : <FaChevronDown />}
                                                                    </span>
                                                                    <FaTrash
                                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                                        color="red"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteClick('etage', etageId, etab.id, etageData.nom);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                        {openZones[uniqueEtageId] && (
                                                            <div className="bg-white p-2">
                                                                {etageData.zones ? (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                        {Object.entries(etageData.zones).map(([zoneId, zone]) => (
                                                                        <div key={zoneId} className="bg-gray-50 p-3 rounded-md flex 
                                                                                                justify-between items-center">
                                                                            <div className="flex items-center">
                                                                                                            
                                                                                <span className="text-[18px] ">{zone.nom}</span>
                                                                            </div>
                                                                            <FaTrash
                                                                                    className="text-red-500 hover:text-red-700 cursor-pointer 
                                                                                    transition-colors"
                                                                                    onClick={() => handleDeleteClick(
                                                                                        'zone',
                                                                                        zoneId,
                                                                                        { etabId: etab.id, etageId },
                                                                                        zone.nom
                                                                                        )}
                                                                                        color="red"
                                                                                        />
                                                                        </div>
                                                                        ))}
                                                                    </div>
                                                                    ) : (
                                                                        <p className="text-gray-500">Aucune zone disponible</p>
                                                                    )}
                                                            </div>
                                                            )}
                                                    </div>
                                                    );
                                                        
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    
                    <ConfirmModal
                        open={showConfirmModal}
                        onClose={() => setShowConfirmModal(false)}
                        onConfirm={confirmDelete}
                        title="Confirmer la suppression"
                        message={getDeleteMessage()}
                        confirmText="Supprimer"
                        cancelText="Annuler"
                        confirmColor="#ff4444"
                    />
                </div>
            </div>
        
    </>
    );
};

export default Dashboard;