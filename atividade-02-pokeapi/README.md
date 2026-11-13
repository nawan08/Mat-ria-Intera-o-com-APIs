# Atividade 02 – Consumindo a PokeAPI

Página que consome a [PokeAPI](https://pokeapi.co) usando apenas requisições **GET** e mostra 12 Pokémon em cards, com imagem, número, nome e tipos.

## Arquivos

| Arquivo | Função |
|---------|--------|
| `index.html` | Estrutura da página (contém o `#pokemonContainer`) |
| `style.css` | Estilos dos cards e dos badges de tipo |
| `api2.js` | Requisições à PokeAPI e criação dos cards |

## Como funciona

1. A função `renderizarPokemons()` faz um `GET` na lista de Pokémon com `limit=12` e `offset=30`.
2. Para cada item da lista, faz um novo `GET` na URL individual para obter os detalhes (imagem e tipos).
3. Monta um card para cada Pokémon com:
   - imagem (`sprites.front_default`)
   - número (`#id`)
   - nome
   - tipos, exibidos como badges
4. Se alguma requisição falhar, a página mostra uma mensagem de erro no lugar dos cards.

As consultas iniciais à API foram testadas no **Postman** antes de serem implementadas no código.

## Como executar

Não precisa instalar nada. Basta abrir o `index.html` no navegador (é necessário ter conexão com a internet).

## API utilizada

- Documentação: https://pokeapi.co/docs/v2
- Lista: `https://pokeapi.co/api/v2/pokemon?limit=12&offset=30`
- Detalhes: `https://pokeapi.co/api/v2/pokemon/{id ou nome}`

## O que aprendi

- Ler a documentação de uma API pública
- Testar endpoints no Postman
- Usar `fetch` com `async/await` e tratar erros com `try/catch`
- Fazer requisições encadeadas (lista e depois detalhes)
- Criar elementos na tela dinamicamente com JavaScript
