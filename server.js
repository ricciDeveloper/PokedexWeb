const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servindo arquivos estáticos da pasta 'assets'
app.use(express.static(path.join(__dirname)));

// Rota para servir o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
