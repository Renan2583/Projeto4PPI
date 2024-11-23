import express, { response } from 'express';
import { link } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';//Importando A Seção Do Modulo Express


const app = express();
const port = 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Configurar uma sessão a fim de permitir que a aplicação seja capaz de lembrar com quem ela está se comunicando.
app.use(session({
    secret: 'MinhaChaveSecreta',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // 30 minutos em Ocioso ira excluir a sessão.
    }
}));

// Middleware para analisar os dados do formulário
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('./paginas/publica'));

// Lista para armazenar as empresas
let listaEmpresa = [];
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

function autenticarUsuario(req, res) {//Funcao para validar o usuario e senha
   const usuario= req.body.usuario;
   const senha = req.body.senha;

    if (usuario === 'renan' && senha === '123') {//Verificar se o Login é Válido
       req.session.usuarioLogado = true;
       res.redirect('/');
   } else {
       res.write(`
       <html>
       <head>
           <meta charset="UTF-8">
           <title>Autenticação do Sistema</title>
           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
       </head>
       <body>
           <h1 class="text-center">Autenticação do Sistema</h1>
           <div class="container w-25">
               <div class="alert alert-danger" role="alert">
                   Usuário ou senha inválidos!
               </div>
           </div>
           <div>
           
           script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
           </script>
       </body>
       </html>
       `);
       res.end();
       
   }
}

app.get('/login', (req, res) => {
    res.redirect('/login.html');
});

app.post('/login', autenticarUsuario);
app.get('/', verificarAutenticacao)
app.get('/forms', verificarAutenticacao);

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

function verificarAutenticacao(req, res, next) {
    if (req.session.usuarioLogado) {
        next();//Permite acessar os recursos solicitados
    } else {
        res.redirect('/login');//Redireciona para tentar logar novamente
    }
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});