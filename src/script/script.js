// Selecionando o botão
const btnClick = document.getElementById("btnClick");

// Função para executar quando o botão for clicado
btnClick.addEventListener("click", () => {
  alert("Você clicou no botão!");
});

const express = require("express");
const axios = require("axios");
const app = express();

const CLIENT_ID = "SEU_CLIENT_ID";
const CLIENT_SECRET = "SEU_CLIENT_SECRET";
const BASE_URL = "https://api-pix.gerencianet.com.br";

app.use(express.json());

// Gera token de autenticação
async function gerarToken() {
  const response = await axios.post(
    `${BASE_URL}/oauth/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}

// Rota para criar um QR Code Pix dinâmico
app.post("/criar-qrcode", async (req, res) => {
  const token = await gerarToken();
  const payload = {
    calendario: { expiracao: 3600 },
    valor: { original: "45.00" },
    chave: "SEU_EMAIL@EXEMPLO.COM",
    infoAdicionais: [{ nome: "Descrição", valor: "Compra de Livro Exemplo" }],
  };

  try {
    const response = await axios.post(`${BASE_URL}/v2/cob`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.response.data);
    res.status(500).send("Erro ao criar QR Code.");
  }
});

// Inicialização do servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000.");
});
