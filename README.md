# Paciência do Roteirista

Jogo casual gratuito de associação de palavras, inspirado em Solitaire Associations. HTML, CSS e JavaScript puros, sem anúncios, backend ou dependências de runtime.

## Arquivos
- `index.html`: estrutura das telas.
- `style.css`: identidade visual responsiva.
- `game.js`: regras, mesa, progresso, persistência, cenas e tutorial.
- `minigame.js`: Sala de Edição.
- `icons.js`: biblioteca própria de SVGs.
- `config.json`: custos e recompensas.
- `levels/level-NN.json`: uma cena por arquivo.

## Como jogar
Toque numa carta e depois no destino destacado. Categorias ocupam um dos cinco espaços; palavras correspondentes são empilhadas sobre a categoria. Colunas ajudam a organizar cartas e revelar cartas escondidas. Comprar, mover e reciclar gastam movimentos. Desfazer não tem limite prático dentro da tentativa. A dica custa fichas e aponta uma possibilidade, sem revelar a solução completa.

## Adicionar uma cena
Duplique um JSON em `levels/`, atualize o `id`, `pack`, `packName`, `moves` e as categorias. Cada categoria contém `name`, `icone` e de três a quatro `words`. O arquivo deve usar o padrão `level-41.json` se o carregador for ampliado para mais cenas. O jogo atual carrega 40 arquivos explicitamente.

## Ícones
Use os nomes existentes em `icons.js`: clapper, book, glove, eye, palette, ball, trophy, film, mic, star, target e globe. O fallback é clapper.

## Publicar no GitHub Pages
1. Envie os arquivos para a raiz do repositório, mantendo a pasta `levels`.
2. Em Settings → Pages, selecione Deploy from a branch, branch `main`, pasta `/(root)`.
3. Aguarde o deploy e abra a URL do Pages.
4. Como os arquivos JSON são carregados por `fetch`, teste usando GitHub Pages ou servidor HTTP local, não abrindo o HTML por file://.

## Verificação de fases
Abra o console do navegador e execute `validatePaciência()`. O validador verifica estrutura, quantidade de categorias, ícones, palavras repetidas e tamanho dos grupos. Ele é uma verificação estrutural; a validação matemática de solução ótima exige simular cada distribuição embaralhada.
