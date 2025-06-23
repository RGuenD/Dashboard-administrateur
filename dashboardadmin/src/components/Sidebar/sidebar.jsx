import "./../Logout";
import {
    Card,
    Typography,
    List,
    ListItem,
} from "@material-tailwind/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./../Logout";
import { TbUsersPlus } from "react-icons/tb";
import { MdDevices } from "react-icons/md";
import { FaBuilding, FaBars, FaTimes } from "react-icons/fa";
import logo from "./../../assets/logo.png";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>


            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>


            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                />
            )}

            <Card className={`h-screen fixed top-0 left-0 border overflow-y-hidden 
                place-items-start max-w-[20rem] p-4 shadow-xl 
                shadow-blue-gray-900/5 flex flex-col w-[290px] z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="mb-2 p-4">
                    <div className="flex justify-center items-center mb-2">
                        <img src={logo} alt="Logo" className="w-[4rem] h-auto"></img>
                    </div>
                    <Typography variant="h5" color="blue-gray">
                        Smartcape dashboard
                    </Typography>
                </div>
                <List>
                    <ListItem>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `flex items-center gap-3 w-full no-underline px-2 py-1 rounded-lg transition-all duration-200
                                ${isActive 
                                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                                    : 'text-black hover:bg-gray-50'
                                }`
                            }
                        >
                            <FaBuilding className="text-xl" />
                            <span>Espaces</span>
                        </NavLink>
                    </ListItem>

                    <ListItem>
                        <NavLink
                            to="/Employees"
                            className={({ isActive }) =>
                                `flex items-center gap-3 w-full no-underline px-2 py-1 rounded-lg transition-all duration-200
                                ${isActive 
                                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                                    : 'text-black hover:bg-gray-50'
                                }`
                            }
                        >
                            <TbUsersPlus className="text-xl" />
                            <span>Employées</span>
                        </NavLink>
                    </ListItem>

                    <ListItem>
                        <NavLink
                            to="/AddDevice"
                            className={({ isActive }) =>
                                `flex items-center gap-3 w-full no-underline px-2 py-1 rounded-lg transition-all duration-200
                                ${isActive 
                                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                                    : 'text-black hover:bg-gray-50'
                                }`
                            }
                        >
                            <MdDevices className="text-xl" />
                            <span>Appareils</span>
                        </NavLink>
                    </ListItem>

                    <ListItem className="mb-[240px] ml-[26px]">
                    </ListItem>
                </List>
                <div className="mt-auto p-4"><Logout /></div>
            </Card>
        </>
    );
}

export default Sidebar;