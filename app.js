const porta = 3000;
const express = require('./config/express');
const app = express();
app.listen(porta, () => console.log(`API Contatos @ porta ${porta}`));

module.exports = app;