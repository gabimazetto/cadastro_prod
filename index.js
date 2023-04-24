require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


//Configurar app
const app = express();
app.use(express.json());

//Config
mongoose.connect(process.env.MONGODB_URL); //Conexão com a URL

//Rotas
const rotaProdutos = require("./routes/produtos");
app.use(rotaProdutos);

//Escuta de eventos
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/");
});