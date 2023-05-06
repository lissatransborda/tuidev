# tuidev

Tuidev é um projeto criado para treinar as minhas habilidades e conhecimentos de NodeJS, desenvolvimento backend e boas práticas.

O objetivo do projeto é ser um portifólio de como eu arquiteto e planejo soluções de software focadas em APIs e testes.

## Funcionalidade

O projeto é uma API de criação de usuários e artigos, usando autenticação e autorização com JWT, validação de dados, e testes automatizados e divisão de responsabilidades.

## Tecnologias

- NodeJS 18.15.0
- NPM 8.19.2
- Typescript 4.9.5
- Express 4.18.2
- Express Validator 7.0.1
- Prisma 4.13.0
- JWT 9.0.0

## Arquitetura

O projeto é estruturado como um MVC, tendo duas entidades principais, `User` e `Article`, e algumas auxiliares para retornos de requisições.

## Instalação

Para instalar todas as dependências do projeto, execute:

```sh
npm install
```

## Configuração

Para criar as tabelas do banco de dados, use:

```sh
npx prisma db push
```

> O banco de dados padrão é SQLite, mas essa configuração pode ser facilmente alterada no arquivo `prisma/schema.prisma`

## Variáveis de ambiente

- ``DATABASE_URL`` URL do banco de dados, podendo ser externa ou local com `file:./dev.db`
- ``JWT_PRIVATE_KEY``chave privada do JWT, como `tuidev.com`

## Inicialização

Para iniciar o projeto em modo de desenvolvimento, use:

```sh
npm run dev
```

## Testes

Para rodar os testes automatizados do projeto, use:

```sh
npm run test
```

# Docker

Para criar a imagem Docker do projeto, use:

```sh
docker build -t [nome da imagem] --build-arg [DATABASE_URL]=[URL do banco de dados] . .
```

E para iniciar: 

```sh
docker run -i --env JWT_PRIVATE_KEY=[chave privada] -p 8000:8000 lissatransborda/tuidev
```

## Rotas

### User

- `POST /user`

Retorna a pessoa usuária criada

Corpo:

```json
{
    "name": "Ana",
    "username": "analemos1",
    "password": "senha"
}
```

Resposta:

```json
{
    "id": "1c91d31d-514e-45e3-857f-165f3ad960d8",
    "name": "Ana",
    "username": "analemos1",
    "password": "senha"
}
```

- `GET /user`

Retorna todas as pessoas usuárias criadas

```json
[
    {
        "id": "1c91d31d-514e-45e3-857f-165f3ad960d8",
        "name": "Ana",
        "username": "analemos1"
    },
    {
        "id": "8ea884af-b080-423b-849b-3eacab7b6a7b",
        "name": "Paulo",
        "username": "paulomatias"
    }
]
```

- `GET /user?username=username`

Retorna os dados de uma pessoa específica pelo username dela

```json
{
    "articles": [
        {
            "authorId": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
            "body": "...",
            "id": "ac5bb236-1f44-489b-9602-65e66ffe5d69",
            "title": "Meu primeiro artigo",
            "url": "analemos1/meu-primeiro-artigo"
        }
    ],
    "id": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
    "name": "Ana",
    "username": "analemos1"
}
```

- `PUT /user/:id`

Altera dados de uma pessoa usuária específica

Headers: 

- `authorization`: JWT associada à pessoa usuária

Corpo:

```json
{
    "nome": "novo nome",
    "username": "novousername"
}
```

Reposta:

```json
{
    "nome": "novo nome",
    "username": "novousername",
    "id": "[id usado]",
}
```

- `PUT /user/:id/password`

Altera senha de uma pessoa usuária específica

Headers: 

- `authorization`: JWT associada à pessoa usuária

Corpo:

```json
{
    "password": "novasenha",
}
```

Resposta:

```json
true
```

### Login

- `POST /login`

Retorna uma JWT caso os dados estejam corretos

Corpo:

```json
{
    "username": "analemos1",
    "password": "senha"
}
```

Resposta:

```json
{
    "data": "[J.W.T]"
}
```

### Articles

- `POST /article`

Retorna o artigo criado

Headers: 

- `authorization`: JWT associada à pessoa usuária

Corpo:

```json
{
    "authorId": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
    "body": "...",
    "title": "Titulo do artigo",
}
```

Resposta:

```json
{
    "authorId": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
    "body": "...",
    "title": "Titulo do artigo",
    "url": "analemos1/titulo-do-artigo",
    "id": "3d7f3586-662a-4d81-9def-f5dd685d2cea",

    "author": {
        "id": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
        "name": "Ana",
        "username": "analemos1"
    }
}
```

- `GET /articles`

Retorna todas os artigos criados

```json
[
    {
        "authorId": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
        "body": "...",
        "id": "3d7f3586-662a-4d81-9def-f5dd685d2cea",
        "title": "Titulo do artigo",
        "url": "analemos1/titulo-do-artigo",

        "author": {
            "id": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
            "name": "Ana",
            "username": "analemos1"
        }
    }
]
```

- `GET /article/:id`

Retorna os dados de um artigo específico pelo id

```json
    {
        "authorId": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
        "body": "...",
        "id": "3d7f3586-662a-4d81-9def-f5dd685d2cea",
        "title": "Titulo do artigo",
        "url": "analemos1/titulo-do-artigo",

        "author": {
            "id": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
            "name": "Ana",
            "username": "analemos1"
        }
    }
```

- `PUT /article/:id`

Altera dados de um artigo específico

Headers: 

- `authorization`: JWT associada à pessoa usuária

Corpo:

```json
{
    "authorId": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
    "body": "...",
    "title": "Novo titulo do artigo",
}
```

Reposta:

```json
{
    "authorId": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
    "body": "...",
    "title": "Novo titulo do artigo",
    "url": "analemos1/novo-titulo-do-artigo",
    "id": "3d7f3586-662a-4d81-9def-f5dd685d2cea",

    "author": {
        "id": "9adc0f4d-f7c0-43bf-a238-7f6f0b494762",
        "name": "Ana",
        "username": "analemos1"
    }
}
```

## Considerações finais

Foi um processo muito interessante criar esse projeto, coloquei diversos conhecimentos meus em conjunto, alguns que eu tinha prática maior em outras linguagens, e outros que já tinha maior prática em NodeJS e Typescript, sempre pensando em segurança e testes em primeiro lugar.