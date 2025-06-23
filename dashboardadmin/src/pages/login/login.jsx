import PasswordInput from '../../components/Input/PasswordInput';
import { useState } from 'react';
import { validateEmail } from '../../utils/helper';


import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../services/firebaseConfig';



const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate=useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Veuillez entrer une adresse email valide.");
            return;
        }
        if (!password) {
            setError("Veuillez entrer votre mot de passe.");
            return;
        }
    
    

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const tokenResult = await userCredential.user.getIdTokenResult();
        const role = tokenResult.claims.role;

        if (role == "admin") {
            navigate("/dashboard");
        } else {
            setError("Accès refusé vous n'êtes pas un administrateur.")
        }
    } catch (err) {
        console.error("Erreur de connexion :", err);
        setError("Échec de la connexion. Vérifiez vos identifiants.");
    }}

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="mb-4 text-center">
                        <span className="text-3xl font-bold text-blue-900 tracking-tight">Connexion</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full px-4 py-3 border-2 rounded-lg text-gray-700 text-base bg-white 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition 
                                placeholder-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 text-center font-medium">{error}</p>}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r 
                            from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white 
                            font-semibold rounded-lg py-3 text-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Login;
