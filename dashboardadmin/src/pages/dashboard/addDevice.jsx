import React, { useState, useEffect } from "react";
import { db, ref, onValue, remove } from "../../services/firebaseConfig";
import { HiPlus } from "react-icons/hi";
import Sidebar from "../../components/Sidebar/sidebar";
import DeviceForm from "../../components/deviceForm/deviceForm";
import DeviceCard from "../../components/deviceCard/deviceCard";
import ConfirmModal from "../../components/confirmModal/confirmModal";
import Toast from "../../components/ToastMessage/Toast";
import SearchBar from "../../components/SearchBar/SearchBar";
import Modal from "react-modal";

Modal.setAppElement('#root');

const AddDevice = () => {
    const [openDeviceModal, setOpenDeviceModal] = useState({
        isShown: false,
        type: "add",
        data: null
    });

    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [toast, setToast] = useState({ isShown: false, message: "", type: "success" });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
    const etablissementsRef = ref(db, 'etablissements');
    
    const unsubscribe = onValue(etablissementsRef, (snapshot) => {
        const data = snapshot.val();
        const allDevices = [];

        if (data) {
            Object.entries(data).forEach(([etabId, etab]) => {
                const etablissementNom = etab.nom;

                if (etab.etages) {
                    Object.entries(etab.etages).forEach(([etageId, etage]) => {
                        const etageNom = etage.nom;

                        if (etage.zones) {
                            Object.entries(etage.zones).forEach(([zoneId, zone]) => {
                                const zoneNom = zone.nom;

                                if (zone.devices) {
                                    Object.entries(zone.devices).forEach(([deviceId, device]) => {
                                        allDevices.push({
                                            ...device,
                                            id: deviceId,
                                            etablissementId: etabId,
                                            etablissementNom,
                                            etageId,
                                            etageNom,
                                            zoneId,
                                            zoneNom,
                                            createdAt: device.createdAt || Date.now()
                                        });
                                    });
                                }
                                if (etage.devices) {
                                    Object.entries(etage.devices).forEach(([deviceId, device]) => {
                                        allDevices.push({
                                        ...device,
                                        id: deviceId,
                                        etablissementId: etabId,
                                        etablissementNom,
                                        etageId,
                                        etageNom,
                                        zoneId: null,
                                        zoneNom: null,
                                        createdAt: device.createdAt || Date.now()
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        const uniqueDevices = Array.from(new Map(
            allDevices.map(d => [d.id, d])
        ).values());
        console.log("Devices chargés:", allDevices.map(d => d.nomAppareil + ' - ' + d.id));
        setDevices(uniqueDevices);
        setLoading(false);
    });

    return () => unsubscribe();
}, [])

    /*const handleAddDevice = async (deviceData) => {
        try {
            const devicesRef = ref(db, 'devices');
            const newDeviceRef = push(devicesRef);

            await set(newDeviceRef, {
                ...deviceData,
                createdAt: { ".sv": "timestamp" },
                
            });
            setToast({ isShown: true, message: "Appareil ajouté avec succès", type: "success" });
            setOpenDeviceModal({ ...openDeviceModal, isShown: false });
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
            setToast({ isShown: true, message: "Erreur lors de l'ajout de l'appareil", type: "delete" });
        }
    };*/

    const handleDeleteClick = (device) => {
        const isUnderZone = !!device.zoneId;

        const path = isUnderZone
            ? `etablissements/${device.etablissementId}/etages/${device.etageId}/zones/${device.zoneId}/devices/${device.id}`
            : `etablissements/${device.etablissementId}/etages/${device.etageId}/devices/${device.id}`;
        setDeviceToDelete({ 
            id: device.id,
            name: device.nomAppareil,
            path: path
        });
    };

    const confirmDeleteDevice = async () => {
        if (!deviceToDelete?.id || !deviceToDelete?.path) return;

        try {
            const deviceRef = ref(db, deviceToDelete.path);
            await remove(deviceRef);
            setToast({ 
                isShown: true, 
                message: `Appareil "${deviceToDelete.name}" supprimé avec succès`, 
                type: "success" 
            });
        } catch (error) {
            console.error("Erreur de suppression:", error);
            setToast({ 
                isShown: true, 
                message: `Erreur lors de la suppression de "${deviceToDelete.name}"`, 
                type: "error" 
            });
        } finally {
            setDeviceToDelete(null);
        }
    };
    const filteredDevices = devices.filter(device =>
        device.nomAppareil.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-row">
            <Sidebar />
            <div className="w-full lg:w-[calc(100%-290px)] lg:ml-[290px] transition-all duration-300 p-4">
                <header className="page-header mb-6">
                    <h1 className="dashboard-title text-3xl font-semibold mb-6">Gestion des appareils</h1>

                    <SearchBar 
                        placeholder="Rechercher un appareil par nom"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button
                        className="w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 
                                    to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg py-3 text-lg 
                                    shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => setOpenDeviceModal({ isShown: true, type: "add", data: null })}
                        aria-label="Ajouter un appareil"
                    >
                        <><HiPlus className="text-xl" /> Ajouter appareil</>
                    </button>
                </header>

                <Modal
                    isOpen={openDeviceModal.isShown}
                    onRequestClose={() => setOpenDeviceModal({ ...openDeviceModal, isShown: false })}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            zIndex: 1000,
                        },
                        content: {
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '2rem',
                            borderRadius: '8px',
                            maxWidth: '500px',
                            width: '90%',
                        }
                    }}
                >
                    <DeviceForm
                        onClose={() => setOpenDeviceModal({ ...openDeviceModal, isShown: false })}
                        onSubmit={() => {
                            setToast({
                                isShown: true,
                                message: "Appareil ajouté avec succès",
                                type: "success",
                            });
                        }}
                    />
                </Modal>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1200px] mx-auto">
                    {loading ? (
                        <div>Chargement des appareils...</div>
                    ) : filteredDevices.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-8">
                            {searchQuery ? "Aucun appareil trouvé pour votre recherche" : "Aucun appareil dans la liste"}
                        </div>
                    ) : (
                        filteredDevices.map(device => (
                            <DeviceCard
                                key={device.id}
                                nomAppareil={device.nomAppareil}
                                typeAppareil={device.typeAppareil}
                                ipMicro={device.ipMicro}
                                pinMicro={device.pinMicro}
                                etablissement={device.etablissementNom}
                                etageNom={device.etageNom}
                                zoneNom={device.zoneNom}
                                createdAt={device.createdAt}
                                onDelete={() => handleDeleteClick(device)}
                            />
                        ))
                    )}
                </section>

                <Toast
                    isShown={toast.isShown}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ isShown: false, message: "", type: "success" })}
                />

                <ConfirmModal
                    open={!!deviceToDelete}
                    onClose={() => setDeviceToDelete(null)}
                    onConfirm={confirmDeleteDevice}
                    title="Confirmer la suppression"
                    message={`Êtes-vous sûr de vouloir supprimer "${deviceToDelete?.name}" ?`}
                    confirmText="Supprimer"
                    cancelText="Annuler"
                />
            </div>
        </div>
    );
};

export default AddDevice;
