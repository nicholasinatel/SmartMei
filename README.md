# Projeto Smart Mei Web App

Decidi executar o projeto com a seguinte Stack:

- Node
- GraphQL
- Apollo Server
- MongoDb & Mongoose

Faz tempo que gostaria de aprender essa tecnologia e me parece a oportunidade perfeita, este é o repositório final, eu criei outros 3 para testes e aprendizado mas que consistiam de partes da solução de forma desconexa.

<hr>

## Regras de negócio

|       Feature       |                        Detalhe                        | Validação |  Resolver  | Obs |
| :-----------------: | :---------------------------------------------------: | :-------: | :--------: | :-: |
|  Cadastrar Usuário  |                Email único no sistema                 |     X     | createUser |     |
|   Emprestar Livro   | Apenas um empréstimo por livro de um usuário por vez. |     X     |  lendBook  |     |
|   Devolver Livro    |          Livro só pode ser devolvido uma vez          |     X     | returnBook |     |
| Detalhes de usuário |    Não precisa guardar histórico de de empréstimos    |     X     | query user |     |

> Valor input loggedUserId representando id do usuário logado, por simplificação de case, para não ter que implementar autenticação e etc..., Ficou parametrizável.

<hr>

## Requisitos Técnicos Obrigatórios

|        Requisito        |                                             Observação                                              | Estado |
| :---------------------: | :-------------------------------------------------------------------------------------------------: | :----: |
|    Disponível em Git    |                                        Github \|\| Bitbucket                                        |   X    |
|       Tecnologia        |                                       Node, TypeScript ou Go                                        |   X    |
|         Testes          |                                           Focarei em TDD                                            |   X    |
|      Base de dados      |                 Local ou Remota, contanto que o acesso e setup estejam documentados                 |   X    |
|  Documentação Simples   |                               Execução do App e Testes, passo-a-passo                               |   X    |
| Utilizar Teste SmartMei | https://documenter.getpostman.com/view/7660896/SzzrZaU2 Provavelmente vou refazer isso pra GraphQl. |   X    |

<hr>

## Requisitos Técnicos Recomendados

|        Requisito         |                      Observação                       | Estado |
| :----------------------: | :---------------------------------------------------: | :----: |
| Mais de um tipo de teste |                     Unitário e ?                      |   X    |
|       Usar commits       |                                                       |   X    |
|   Documentar o código    |           Para ajudar na revisão da empresa           |   X    |
|        Validação         |       Validar de forma mais rigorosa os inputs        |   X    |
|          CI/CD           | Pipeline de CI/CD configurado, provavelmente CircleCI |   X    |
