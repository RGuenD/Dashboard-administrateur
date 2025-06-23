const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
    },
});


const generatePassword = () => {
    return Math.random().toString(36).slice(-10);
};

app.post("/api/addUser", async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ message: "Email ou rôle manquant." });
    }

    const password = generatePassword();

    try {

        await admin.auth().createUser({
            email,
            password,
        });

        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { role });

        const subject = role === "admin"
            ? "Votre mot de passe pour le Dashboard Admin"
            : "Votre mot de passe pour l'application Smartcape";

        const message = `
            <p>Bonjour,</p>
            <p>Votre mot de passe pour accéder  <strong>${role === "admin" ? "au Dashboard Admin" : " à l'application Smartcape"}</strong>.</p>
            <p>est : <strong>${password}</strong></p>
            <p>Utilisez-le pour vous connecter.</p>
        `;

        await transporter.sendMail({
            from: "smartcape2025@gmail.com",
            to: email,
            subject: subject,
            html: message,
        });

        res.status(200).json({ message: "Utilisateur créé et email envoyé." });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error.message);
        console.error("Stack :", error.stack);
        console.error("Full error :", error);
        res.status(500).json({ message: "Erreur lors de la création.", error: error.message });
    }
});
app.get("/api/getUsers", async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users.map(userRecord => ({
            uid: userRecord.uid,
            email: userRecord.email,
            role: userRecord.customClaims?.role || "non défini",
        }));

        res.status(200).json({ users });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
    }
});

app.delete("/api/deleteUser/:uid", async (req, res) => {
    try {
        await admin.auth().deleteUser(req.params.uid);
        res.status(200).json({ message: "Utilisateur supprimé" });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
