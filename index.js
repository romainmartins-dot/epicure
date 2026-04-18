require("dotenv").config();
const express = require("express");
const cors = require("cors");
const adressesRouter = require("./routes/adresses");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Bienvenue sur projet-app-vins ! 🍷"));
app.use("/adresses", adressesRouter);

app.listen(3000, () => console.log("Serveur démarré sur http://localhost:3000"));
