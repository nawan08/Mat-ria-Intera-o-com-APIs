/* API com Persistência em Arquivo JSON - Dev: Vagner Lima */
const http = require('http'); // Módulo nativo para criar o servidor e lidar com requisições HTTP
const fs = require('fs');     // Módulo nativo para manipular arquivos
const path = require('path'); // Módulo nativo para lidar com caminhos de pastas

// Define o caminho exato onde o arquivo será salvo (mesma pasta do server.js)
const ARQUIVO_DADOS = path.join(__dirname, 'pokemons.json');

// Dados iniciais padrão (usados apenas na primeira vez, caso o arquivo ainda não exista)
const bdPokemons = [
    { id: 1, nome: "Pikachu", tipo: "Elétrico" },
    { id: 2, nome: "Charmander", tipo: "Fogo" },
    { id: 3, nome: "Bulbasaur", tipo: "Planta" }
];

// --- FUNÇÕES DE PERSISTÊNCIA (BANCO DE DADOS EM ARQUIVO) ---

// Lê os dados salvos no disco ao iniciar o servidor
const carregarDados = () => {
    // Se o arquivo ainda não existe, cria o arquivo com os dados iniciais
    if (!fs.existsSync(ARQUIVO_DADOS)) {
        fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(bdPokemons, null, 2));
        return bdPokemons;
    }
    // Se já existe, lê o conteúdo de texto e converte de volta para Array JavaScript
    const conteudo = fs.readFileSync(ARQUIVO_DADOS, 'utf-8');
    return JSON.parse(conteudo);
};

// Grava o array atualizado no arquivo pokemons.json
const salvarDados = (listaPokemons) => {
    // O 'null, 2' formata o JSON com indentação para facilitar a leitura do arquivo
    fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(listaPokemons, null, 2));
};

// Carrega a lista do arquivo para a memória assim que o servidor liga
let pokemons = carregarDados();

// --- FUNÇÕES AUXILIARES ---
const enviarJSON = (res, statusCode, dados) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dados));
};

const receberBody = (req) => {
    return new Promise((resolve, reject) => {
        let corpo = '';
        req.on('data', chunk => { corpo += chunk.toString(); });
        req.on('end', () => {
            try {
                resolve(corpo ? JSON.parse(corpo) : {});
            } catch (err) {
                reject(err);
            }
        });
    });
};

// --- CRIAÇÃO DO SERVIDOR ---
const server = http.createServer(async (req, res) => {

    // --- MIDDLEWARE MANUAL: Configuração de CORS ---
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight: o navegador envia um OPTIONS antes de POST/PUT/DELETE
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // --- ROTAS DO CRUD ---

    // Regex para verificar se a URL tem o formato '/api/pokemons/NUMERO'
    const idMatch = req.url.match(/\/api\/pokemons\/(\d+)/);
    // Se bateu com a Regex, converte o número para inteiro. Senão, id vira null.
    const id = idMatch ? parseInt(idMatch[1]) : null;

    try {

        // 1. READ (GET) - Listar todos os Pokémons
        if (req.url === '/api/pokemons' && req.method === 'GET') {
            return enviarJSON(res, 200, pokemons);
        }

        // 2. READ (GET por ID) - Buscar um Pokémon específico
        if (idMatch && req.method === 'GET') {
            const pokemon = pokemons.find(p => p.id === id);
            if (!pokemon) return enviarJSON(res, 404, { mensagem: "Pokémon não encontrado!" });
            return enviarJSON(res, 200, pokemon);
        }

        // 3. CREATE (POST) - Adicionar um novo Pokémon e SALVAR no arquivo
        if (req.url === '/api/pokemons' && req.method === 'POST') {
            const { nome, tipo } = await receberBody(req);

            // Validação: nome e tipo são obrigatórios
            if (!nome || !tipo) {
                return enviarJSON(res, 400, { mensagem: "Nome e Tipo são obrigatórios!" });
            }

            const novoPokemon = {
                // ID único: pega o ID do último elemento e soma 1 (se vazio, começa em 1)
                id: pokemons.length > 0 ? pokemons[pokemons.length - 1].id + 1 : 1,
                nome,
                tipo
            };

            pokemons.push(novoPokemon);
            salvarDados(pokemons); // 👈 PERSISTE NO DISCO!
            return enviarJSON(res, 201, novoPokemon);
        }

        // 4. UPDATE (PUT) - Atualizar um Pokémon existente e SALVAR no arquivo
        if (idMatch && req.method === 'PUT') {
            const { nome, tipo } = await receberBody(req);
            const index = pokemons.findIndex(p => p.id === id);

            if (index === -1) return enviarJSON(res, 404, { mensagem: "Pokémon não encontrado!" });

            pokemons[index] = { id, nome, tipo };
            salvarDados(pokemons); // 👈 PERSISTE NO DISCO!
            return enviarJSON(res, 200, { mensagem: "Pokémon atualizado com sucesso!", pokemon: pokemons[index] });
        }

        // 5. DELETE (DELETE) - Remove e SALVA no arquivo
        if (idMatch && req.method === 'DELETE') {
            const index = pokemons.findIndex(p => p.id === id);

            if (index === -1) return enviarJSON(res, 404, { mensagem: "Pokémon não encontrado!" });

            const pokemonRemovido = pokemons.splice(index, 1);
            salvarDados(pokemons); // 👈 PERSISTE NO DISCO!
            return enviarJSON(res, 200, { mensagem: "Pokémon deletado com sucesso!", pokemon: pokemonRemovido[0] });
        }

        // --- FALLBACK (Rota Padrão) ---
        enviarJSON(res, 404, { mensagem: "Rota não encontrada" });

    } catch (erro) {
        // Qualquer erro inesperado devolve status 500 sem derrubar o servidor
        enviarJSON(res, 500, { mensagem: "Erro interno no servidor" });
    }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
server.listen(3000, () => {
    console.log("🚀 Servidor Nativo rodando em: http://localhost:3000");
});
