import express from 'express';
import { link } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para analisar os dados do formulário
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Lista para armazenar as empresas
let listaEmpresa = [];
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});


// Rota para o formulário
app.get('/formulario', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forms.html'));
});

// Rota para processar o cadastro
app.post('/formulario', (req, res) => {
    const { razao, cnpj, rua, fantasia, cidade, estado, cep, email, telefone } = req.body;
    const empresa = { razao, cnpj, rua, fantasia, cidade, estado, cep, email, telefone };

    // Adiciona a empresa à lista
    listaEmpresa.push(empresa);

    // Monta a resposta HTML
    res.write(`
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Lista de Empresas</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
        </head>
        <body>
            <h1 class="text-center">Lista de Empresas Cadastradas</h1>
            <div class="container">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Razão Social</th>
                            <th>CNPJ</th>
                            <th>Endereço</th>
                            <th>Nome Fantasia</th>
                            <th>Cidade</th>
                            <th>UF</th>
                            <th>CEP</th>
                            <th>Telefone</th>
                        </tr>
                    </thead>
                    <tbody>
    `);

    // Adiciona cada empresa à tabela
    listaEmpresa.forEach(empresa => {
        res.write(`
            <tr>
                <td>${empresa.razao}</td>
                <td>${empresa.cnpj}</td>
                <td>${empresa.rua}</td>
                <td>${empresa.fantasia}</td>
                <td>${empresa.cidade}</td>
                <td>${empresa.estado}</td>
                <td>${empresa.cep}</td>
                <td>${empresa.telefone}</td>
            </tr>
        `);
    });

    res.write(`
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    `);
    res.end();
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});