# Gerenciamento de Mercadorias

## Descrição do Projeto

Este projeto é uma aplicação para gerenciar mercadorias, com funcionalidades de cadastro, atualização, e controle de entradas e saídas de produtos. A aplicação inclui uma interface de pesquisa e permite selecionar mercadorias para atualização ou movimentação. A interface de usuário foi desenvolvida em React e o backend foi construído em Flask, utilizando MySQL para persistência de dados.

## Funcionalidades

- **Cadastro de Mercadorias**: Formulário para adicionar uma nova mercadoria, incluindo informações como Nome, Número de Registro, Fabricante, Tipo, e Descrição.
- **Atualização de Mercadorias**: Permite pesquisar uma mercadoria e atualizar suas informações com um formulário preenchido automaticamente com os dados atuais da mercadoria.
- **Registro de Entradas e Saídas**: Registra a entrada e saída de mercadorias, com detalhes de quantidade, data/hora e local.
- **Pesquisa Dinâmica**: Campo de pesquisa com sugestões automáticas que exibem mercadorias correspondentes ao que está sendo digitado.

## Tecnologias Utilizadas

- **Frontend**: React.js
- **Backend**: Flask
- **Banco de Dados**: MySQL
- **Estilização**: CSS personalizado
- **Gráficos**: Utilizados para visualização de movimentação de produtos

## Estrutura do Projeto

```
/project-root
├── backend
│   ├── app.py                  # Arquivo principal do Flask
│   ├── models.py               # Modelos de banco de dados
│   └── requirements.txt        # Dependências do backend
│
└── frontend
    ├── public
    │   └── index.html          # Arquivo HTML principal
    ├── src
    │   ├── components
    │   │   ├── MercadoriaForm.js       # Formulário de cadastro de mercadorias
    │   │   ├── TransactionForm.js      # Formulário de movimentação e atualização de mercadorias
    │   │   └── TransactionsChart.js    # Gráfico de movimentação de mercadorias 
    │   ├── services
    │   │   └── api.js                  # Funções de chamada de API
    │   ├── App.js                      # Componente principal
    │   └── index.js                    # Ponto de entrada do React
    └── package.json                    # Dependências do frontend
```

## Instalação

### Requisitos

- Node.js e npm
- Python 3.x e pip
- MySQL

### Passo a Passo

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/gerenciamento-mercadorias.git
    cd gerenciamento-mercadorias
    ```

2. **Configuração do Backend (Flask)**:
    - Navegue até a pasta `backend`:
      ```bash
      cd backend
      ```
    - Instale as dependências do Python:
      ```bash
      pip install -r requirements.txt
      ```
    - Configure o banco de dados MySQL:
      - Crie um banco de dados chamado `gerenciamento_mercadorias` no MySQL.
      - Atualize as configurações de banco de dados no arquivo `app.py` ou `models.py` (dependendo da implementação).
    - Execute o backend:
      ```bash
      python app.py
      ```

3. **Configuração do Frontend (React)**:
    - Em um novo terminal, navegue para a pasta `frontend`:
      ```bash
      cd frontend
      ```
    - Instale as dependências do Node.js:
      ```bash
      npm install
      ```
    - Execute o frontend:
      ```bash
      npm start
      ```
    - A aplicação estará disponível em `http://localhost:3000`.

## Endpoints da API

### Mercadorias

- **GET `/mercadorias`**: Retorna uma lista de todas as mercadorias.
- **POST `/mercadorias`**: Cria uma nova mercadoria.
- **PUT `/mercadorias/<id>`**: Atualiza os dados de uma mercadoria pelo ID.
- **DELETE `/mercadorias/<id>`**: Exclui uma mercadoria pelo ID.

### Entradas e Saídas

- **POST `/entradas`**: Registra uma entrada de mercadoria.
- **POST `/saidas`**: Registra uma saída de mercadoria.

## Como Usar

1. **Cadastrar Mercadoria**:
   - Acesse a aba "Cadastrar Mercadoria".
   - Preencha os campos e clique em "Cadastrar".

2. **Atualizar Mercadoria**:
   - Clique na aba "Atualizar Mercadoria".
   - Utilize a caixa de pesquisa para encontrar uma mercadoria.
   - Clique na mercadoria para preencher o formulário e, em seguida, edite os dados e clique em "Atualizar Mercadoria".

3. **Registrar Entradas e Saídas**:
   - Selecione "Registrar Entrada" ou "Registrar Saída".
   - Escolha uma mercadoria na caixa de pesquisa e preencha os campos de quantidade, data/hora e local.
   - Clique no botão de registrar para salvar a entrada ou saída.

## Possíveis Melhorias

- Implementação de gráficos para visualização das movimentações de entrada e saída.
- Exportação de relatórios em PDF.
- Integração com autenticação de usuário.

## Contribuição

Contribuições são bem-vindas! Para contribuir, siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`).
4. Faça um push para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

---

## Licença

Este projeto está sob a licença MIT.
