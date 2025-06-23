import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar/sidebar";
import Toast from "../../components/ToastMessage/Toast";
import ConfirmModal from "./../../components/confirmModal/confirmModal"
import SearchBar from "../../components/SearchBar/SearchBar";
import axios from 'axios';
import { TbUsersPlus } from "react-icons/tb";
import { FaUsers, FaTrash } from "react-icons/fa";
import { PiTrashSimpleLight } from "react-icons/pi";
import { HiPlus } from "react-icons/hi";

const Employees = () => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [isToastShown, setIsToastShown] = useState(false);
    const [users, setUsers] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const showToast = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setIsToastShown(true);
    };

    const handleAddUser = async () => {
        if (!email || !role) {
            showToast("Veuillez remplir tous les champs.", "delete");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/addUser", {
                email,
                role,
            });

            showToast(res.data.message, "success");
            setEmail("");
            setRole("");
            fetchUsers();
        } catch (error) {
            console.error("Erreur :", error);
            showToast("Erreur lors de la création de l'utilisateur.", "delete");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/getUsers");
            setUsers(res.data.users);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs :", error);
        }
    };

    const handleDeleteClick = (uid, email) => {
        setUserToDelete({ uid, email });
        setShowConfirmModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/deleteUser/${userToDelete.uid}`);
            showToast("Utilisateur supprimé avec succès", "success");
            setUsers(users.filter(user => user.uid !== userToDelete.uid));
        } catch (error) {
            console.error("Erreur:", error);
            showToast("Erreur lors de la suppression de l'utilisateur", "error");
        } finally {
            setShowConfirmModal(false);
            setUserToDelete(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
        <div className="flex">
            <Sidebar />
            <main className="w-full lg:w-[calc(100%-290px)] lg:ml-[290px] transition-all duration-300 p-4">
                <h1 className="dashboard-title text-3xl font-semibold mb-6">
                    Gestion des utilisateurs
                </h1>

                <SearchBar 
                    placeholder="Rechercher un utilisateur par email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className='w-full  '>
                    <card className="bg-white rounded shadow  mb-[32px] border 
                        border-gray-100 grid grid-cols-4   md:flex-col items-center justify-center gap-8">
                        <input
                            type="text"
                            placeholder="Email de l'employé"
                            className="border border-gray-300 ml-[32px] mt-[32px] mb-[32px] 
                                    rounded-full col-span-2  px-5 py-2 text-base flex-1 
                                    focus:outline-none focus:ring-2 focus:ring-[#334BC4] transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <select
                            className="border border-gray-300 rounded-full px-5
                                        py-2 text-base focus:outline-none focus:ring-2 
                                        focus:ring-[#334BC4] transition"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Rôle</option>
                            <option value="admin">Admin</option>
                            <option value="employé">Employé</option>
                        </select>
                        <button
                            className=" w-[170px] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 
                                        to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg py-3  text-lg 
                                        shadow transition disabled:opacity-60 disabled:cursor-not-allowed "
                            onClick={handleAddUser}
                            type="button"
                        >
                            <><HiPlus className="text-xl" /> Ajouter </>
                        </button>
                    </card>
                </div>

                <div className="bg-white rounded shadow pl-16 pt-8 border border-gray-100 flex-1 flex flex-col">
                    <div className='flex  flex-row'>
                        <FaUsers size={32} color='#1e2dbb' /> 
                        <h3 className='ml-4 text-2xl font-bold 
                                    text-blue-900  text-center tracking-tight'>
                                        Liste des utilisateurs
                        </h3>
                    </div> 
                    
                    <div className="overflow-x-auto flex-1 px-[32px] pl-24">
                        <table className="min-w-full ">
                            <thead>
                                <tr>
                                    <th className="text-left font-poppins text-base font-semibold text-gray-600 px-[32px] pt-6 pb-6">Email</th>
                                    <th className="text-left font-poppins text-base font-semibold text-gray-600 px-[32px] pt-6 pb-6">Rôle</th>
                                    <th className="text-left font-poppins text-base font-semibold text-gray-600 pt-6 pb-6 ">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-gray-500">
                                            {searchQuery ? "Aucun utilisateur trouvé" : "Aucun utilisateur dans la liste"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.uid} className="mb-4">
                                            <td className="py-3">
                                                <span className="block bg-[#F7F8FA] rounded-xl px-4 py-2 text-gray-800 text-sm font-medium">{user.email}</span>
                                            </td>
                                            <td className="py-3">
                                                <span className="block bg-[#F7F8FA] rounded-xl px-4 py-2 text-gray-800 text-sm font-medium">{user.role === 'admin' ? 'Admin' : 'employé'}</span>
                                            </td>
                                            <td className="py-3 ">
                                                <button
                                                    className=" text-white px-6 py-2 bg-[#E33629] p-2 border-none rounded 
                                                        font-medium text-sm transition-colors flex items-center gap-2"
                                                    onClick={() => handleDeleteClick(user.uid, user.email)}
                                                    
                                                >
                                                    <PiTrashSimpleLight className="w-4 h-4" color='white' />
                                                    supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            

            <Toast 
                isShown={isToastShown} 
                message={toastMessage} 
                type={toastType} 
                onClose={() => setIsToastShown(false)} 
            />

            <ConfirmModal
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmDeleteUser}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.email} ?`}
                confirmText="Supprimer"
                cancelText="Annuler"
                confirmColor="#ff4444"
            />
            </main>
        </div>
        </>
    );
};

export default Employees;