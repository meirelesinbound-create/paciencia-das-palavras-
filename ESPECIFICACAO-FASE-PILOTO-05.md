# Especificação — fase-piloto 05

## Objetivo
Validar a mecânica central de uma paciência de associação antes de alterar as 40 fases existentes. A fase 5 usa as cinco categorias e as quinze respostas já presentes no conteúdo do jogo, apresentadas nesta ordem:

1. Fenômenos ópticos — Refração, Difração, Dispersão.
2. Grandes camisas 10 — Pelé, Zico, Maradona.
3. Ídolos do Corinthians — Sócrates, Rivellino, Marcelinho Carioca.
4. Filmes de animação da Pixar — Ratatouille, WALL-E, Viva.
5. Filmes de Martin Scorsese — Taxi Driver, Os Bons Companheiros, Os Infiltrados.

## Modelo de mesa
- Cinco espaços de objetivo no topo; começam vazios.
- Cinco colunas de tableau.
- A categoria Fenômenos ópticos começa visível como uma carta no tableau.
- Grandes camisas 10 e Ídolos do Corinthians começam ocultas sob respostas de Fenômenos ópticos, permitindo que sejam descobertas em paralelo.
- Pixar fica oculta sob respostas de Grandes camisas 10 e Corinthians.
- Scorsese fica oculta sob respostas de Corinthians e Pixar.
- Oito respostas restantes começam no baralho; a ordem do baralho é embaralhada em cada nova tentativa.

## Regras de movimento
1. Só a carta superior e virada para cima de cada coluna pode ser selecionada.
2. Categoria revelada só pode ser movida para um espaço de objetivo vazio.
3. Resposta só pode ser movida para a categoria correspondente já descoberta, até o limite de três cartas.
4. Respostas podem ser organizadas em coluna vazia ou sobre outra resposta da mesma categoria. Não é permitido mover uma categoria para uma coluna.
5. Ao retirar uma carta, a próxima carta da coluna é revelada automaticamente.
6. O baralho revela uma carta por vez; apenas a carta superior do descarte pode ser usada. O descarte pode ser reciclado.
7. Uma categoria só é concluída com exatamente as três respostas corretas, sem duplicatas.
8. Desfazer restaura o estado anterior. Reiniciar restaura a mesa fixa e cria uma nova ordem para o baralho.

## Dependências de desbloqueio da mesa
- A é a categoria inicial.
- B e C são descobertas ao liberar respostas de A.
- D exige liberar respostas de B e C.
- E exige liberar respostas de C e D.

Essa estrutura oferece uma bifurcação inicial (B/C) e uma sequência de desbloqueios dependentes. Não é uma distribuição aleatória sem critério: existe uma ordem de solução conhecida. O baralho contém somente respostas de categorias presentes na mesa e todas podem ser acessadas por compra e reciclagem.

## Critérios de aceitação
- [ ] Não é possível mover uma carta virada para baixo.
- [ ] Não é possível movimentar cartas que não estejam no topo de uma coluna.
- [ ] Não é possível posicionar uma resposta em categoria errada ou ainda não descoberta.
- [ ] Não é possível completar categoria com uma ou duas respostas.
- [ ] Categoria oculta é revelada quando todos os bloqueadores são removidos.
- [ ] Toque/seleção e arrastar funcionam em desktop e mobile.
- [ ] Desfazer e reiniciar restauram corretamente o estado.
- [ ] A solução conhecida completa as cinco categorias e as quinze respostas.
- [ ] A interface não cria rolagem horizontal em telas de 360 px.

## Fora do escopo do piloto
- Alterar as fases 1–4 ou 6–40.
- Migrar a nova mecânica para o jogo principal.
- Definir gerador aleatório geral ou solver automático para todas as fases.
- Alterar economia de fichas, recompensas ou identidade visual global.

O piloto é uma experiência isolada para avaliação. A migração só deve acontecer após validação manual e testes de solvabilidade.
