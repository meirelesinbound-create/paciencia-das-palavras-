# Paciência das Palavras

Jogo web gratuito de associação de palavras, em português brasileiro. Sem backend, contas, APIs, frameworks ou dependências externas.

## Como jogar

1. Escolha uma fase no menu.
2. Toque em **Comprar** para revelar uma carta do monte ou toque na carta exposta no topo de uma coluna.
3. Coloque uma carta de **Categoria** em um dos quatro espaços de fundação.
4. Coloque sobre ela apenas palavras que pertençam àquela categoria.
5. Use as colunas para reorganizar cartas e revelar as que estão por baixo.
6. Quando todas as palavras da categoria estiverem reunidas, a pilha desaparece e libera o espaço.
7. Vença completando todas as categorias antes de zerar os movimentos.

Cada compra, movimentação ou reciclagem do monte consome um movimento. Não há cronômetro. Os botões **Desfazer**, **Dica** e **Reiniciar** ajudam durante a partida. O jogo também aceita arrastar e soltar em navegadores compatíveis; tocar na carta e depois no destino funciona como alternativa.

## Conteúdo

As 40 fases ficam em [fases.json](./fases.json), separadas do código para facilitar a edição. São 24 fases gerais (60%) e 16 temáticas (40%). A dificuldade progride de 2 categorias e 6 palavras para 3 categorias e 9 palavras, depois 4 categorias e 12–16 palavras e, nas fases finais, 5 categorias e 20 palavras.

### Fases temáticas para conferência

| Fase | Pacote | Conteúdo |
|---|---|---|
| 25 | 🎬 Cinema | Diretores brasileiros; filmes premiados |
| 26 | 🎬 Cinema | Diretores internacionais; gêneros de cinema |
| 27 | 🎬 Cinema | Filmes de Christopher Nolan; franquias |
| 28 | 🎬 Cinema | Atores e atrizes; filmes vencedores do Oscar |
| 29 | 📺 Séries | Breaking Bad; Game of Thrones |
| 30 | 📺 Séries | Stranger Things; Friends |
| 31 | 📺 Séries | La Casa de Papel; Round 6 |
| 32 | 📺 Séries | The Office; locais e organizações de séries |
| 33 | 📺 Séries | Personagens com nomes que se repetem; séries de suspense |
| 34 | ⚽ Futebol | Seleção brasileira; clubes brasileiros |
| 35 | ⚽ Futebol | Copas do Mundo; posições do futebol |
| 36 | ⚽ Futebol | Termos de futebol; estádios brasileiros (incluindo MorumBIS) |
| 37 | ⚽ Futebol | Craques brasileiros; competições |
| 38 | ⚫ Corinthians | Ídolos corintianos; outros ídolos do Corinthians |
| 39 | ⚫ Corinthians | Títulos; locais e torcida |
| 40 | ⚫ Corinthians | Clubes rivais paulistas; símbolos e momentos marcantes |

As fases temáticas usam termos que podem sugerir outra associação sem repetir a mesma palavra em categorias diferentes dentro da fase — por exemplo, nomes de cidades que também aparecem em obras ou personagens, nomes de clubes que também são lugares e termos com outros sentidos cotidianos. O jogo não usa escudos, logotipos, fotografias ou artes oficiais.

## Recursos

- Menu inicial e seleção de fases por pacote.
- Quatro espaços de categoria e tableau responsivo com 4 a 6 colunas.
- Monte de compra, descarte e reciclagem.
- Contador de movimentos restantes.
- Desfazer, dica de jogada válida e reiniciar.
- Vitória e derrota.
- Salvamento de fase desbloqueada, fases concluídas, partida em andamento e tema no `localStorage`.
- Modo claro e escuro.
- Interface mobile first, com toque, clique e arrastar/soltar.

## Executar e publicar

O projeto usa um arquivo `index.html` com CSS e JavaScript puros e o arquivo externo `fases.json`. Como o navegador bloqueia `fetch()` de arquivos locais em muitos contextos, para testar no computador use um servidor estático local. No GitHub Pages, os dois arquivos são servidos normalmente.

### GitHub Pages (gratuito)

1. Abra **Settings** no repositório.
2. Entre em **Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/(root)`.
5. Clique em **Save** e aguarde o endereço aparecer em Pages.

O repositório precisa ser público para usar GitHub Pages no plano gratuito. O endereço do site será semelhante a `https://meirelesinbound-create.github.io/paciencia-das-palavras-/` enquanto o nome do repositório terminar com hífen.

## Privacidade

O jogo não envia dados para servidores. O progresso e a preferência de tema ficam armazenados localmente no navegador por meio de `localStorage`. Limpar os dados do navegador remove esse progresso.

## Estrutura

- `index.html` — interface, estilos e lógica do jogo.
- `fases.json` — dados editáveis das 40 fases.
- `README.md` — documentação.
