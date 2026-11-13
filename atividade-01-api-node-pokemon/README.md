# Atividade 01 – API REST em Node.js com CRUD de Pokémon

API REST criada apenas com módulos nativos do Node.js (`http`, `fs` e `path`), sem npm e sem frameworks, junto com um front-end que consome a API usando `fetch`.

## Arquivos

| Arquivo | Função |
|---------|--------|
| `server.js` | Servidor HTTP, rotas do CRUD e persistência em arquivo |
| `pokemons.json` | "Banco de dados" em arquivo (criado automaticamente na primeira execução) |
| `index.html` | Interface da aplicação |
| `api.js` | Comunicação com a API via `fetch` |
| `style.css` | Estilos da página |

## Funcionalidades

- **Create** – cadastrar um Pokémon (`nome` e `tipo` são obrigatórios)
- **Read** – listar todos os Pokémon ou buscar um pelo ID
- **Update** – editar um Pokémon existente (botão **Editar**)
- **Delete** – remover um Pokémon
- **Persistência** – os dados são gravados em `pokemons.json`, então continuam salvos depois de reiniciar o servidor
- **CORS** configurado manualmente, incluindo a resposta ao preflight (`OPTIONS`)
- **Tratamento de erros** com status HTTP adequados (400, 404 e 500)

## Como executar

1. Tenha o [Node.js](https://nodejs.org) instalado.
2. No terminal, dentro desta pasta, rode:

```bash
node server.js
```

3. O servidor sobe em `http://localhost:3000`.
4. Abra o arquivo `index.html` no navegador.

Na primeira execução, o `pokemons.json` é criado com três Pokémon iniciais (Pikachu, Charmander e Bulbasaur).

## Rotas da API

| Método | Rota | Descrição | Status de sucesso |
|--------|------|-----------|-------------------|
| GET | `/api/pokemons` | Lista todos os Pokémon | 200 |
| GET | `/api/pokemons/:id` | Busca um Pokémon pelo ID | 200 |
| POST | `/api/pokemons` | Cadastra um novo Pokémon | 201 |
| PUT | `/api/pokemons/:id` | Atualiza um Pokémon | 200 |
| DELETE | `/api/pokemons/:id` | Remove um Pokémon | 200 |

### Exemplo de corpo (POST e PUT)

```json
{
  "nome": "Squirtle",
  "tipo": "Água"
}
```

### Possíveis erros

| Status | Quando acontece |
|--------|-----------------|
| 400 | `nome` ou `tipo` não foram enviados no POST |
| 404 | Pokémon ou rota não encontrados |
| 500 | Erro interno inesperado no servidor |

## O que aprendi

- Criar um servidor HTTP e rotas com Node.js puro
- Ler e gravar arquivos JSON com o módulo `fs`
- Extrair o ID da URL com expressão regular
- Receber e interpretar o corpo (`body`) de uma requisição
- Configurar CORS manualmente
- Consumir a API com `fetch` (GET, POST, PUT e DELETE)
