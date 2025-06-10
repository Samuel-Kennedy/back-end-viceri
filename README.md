# 📝 Desafio Backend - Viceri (To-Do App)

Este projeto é uma API RESTful desenvolvida em **Node.js** com **Express**, que simula um sistema de gerenciamento de tarefas (To-Do List).

---

## 🚀 Tecnologias Utilizadas

- Node.js  
- Express  
- SQLite3 (banco local e leve)  
- Knex.js (Query Builder)  
- JWT (autenticação segura)  
- bcrypt (hash de senha)  
- Jest (testes unitários)  
- Swagger (documentação da API)  
- Helmet (segurança HTTP)  
- dotenv (variáveis de ambiente)  

---

## 📦 Como rodar o projeto localmente

-node src/index.js

### ✅ Pré-requisitos

- Node.js (v14 ou superior)  
- npm  

### 🧰 Etapas

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Samuel-Kennedy/back-end-viceri.git
   cd seu-repo

2. **Instale as dependências:**

- npm install

3. **Configure as variáveis de ambiente:**

- JWT_SECRET=suaChaveJWTseguraAqui

4. **Execute as migrations para criar as tabelas no banco SQLite:**

- npx knex --knexfile src/database/knexfile.js migrate:latest

5. **Inicie a aplicação:**

- npm start

6. **🛠️ Testes unitários**

Para rodar os testes unitários, utilize o comando:

- npm test

7. **📄 Documentação da API**

A documentação interativa da API está disponível via Swagger, acessível em:

- http://localhost:3000/api-docs


8. **🔐 Segurança**

- Utiliza JWT para autenticação segura dos usuários.

- Senhas armazenadas com hash via bcrypt.

- Implementação do Helmet para configurar cabeçalhos HTTP e aumentar a segurança.

- Recomenda-se implementar rate limiting para proteção contra ataques de força bruta (não incluso por padrão).

9. **⚙️ Detalhes importantes**

- Banco de dados SQLite local armazenado no arquivo definido no projeto.

- Configurações do Knex.js estão em src/database/knexfile.js.

- As variáveis sensíveis, como JWT_SECRET, devem estar sempre em .env e nunca expostas no código.

10. **📦 Build e Deploy**

Para produção, siga estes passos:

Defina a variável de ambiente JWT_SECRET no ambiente de produção.

Instale as dependências:

- npm install

- npx knex migrate:latest --knexfile src/database/knexfile.js

- npm start


11. **🤝 Contato**

Em caso de dúvidas, sugestões ou problemas, abra uma issue no repositório do GitHub ou envie um e-mail para: samuel.gomes@aol.com

12. **📜 Licença**

Este projeto está licenciado sob a licença MIT.

13. **E se você precisar disponibilizar essa aplicação na AWS? Descreva brevemente como o faria.** 

Para disponibilizar essa aplicação na AWS, como o projeto é composto por dois lados — o backend em Node.js/Express e o frontend em Angular — a ideia é subir ambos para a AWS, garantindo que eles continuem se comunicando normalmente.

Backend (Node.js/Express)
Eu usaria o AWS Elastic Beanstalk para hospedar o backend. Ele facilita bastante o deploy de aplicações Node.js. Subo a API por lá e configuro as variáveis de ambiente (como a chave JWT e o banco de dados).
Se estiver usando SQLite para testes, trocaria por PostgreSQL ou MySQL em produção, usando o Amazon RDS.

Frontend (Angular)
O Angular gera arquivos estáticos com o comando ng build. Esses arquivos eu colocaria num bucket do Amazon S3 com hospedagem estática ativada. Dá pra apontar um domínio personalizado, ativar HTTPS com o AWS Certificate Manager e, se quiser performance e segurança extra, usar o Amazon CloudFront como CDN.

Integração entre os dois
No código do Angular, o frontend faz requisições para a API do backend. Então, depois que o backend estiver publicado, eu só ajustaria a URL base da API no frontend (geralmente no environment.prod.ts) para apontar para o endereço do Elastic Beanstalk.

Com isso, os dois continuam se comunicando normalmente, só que agora em produção. Essa estrutura funciona bem, é escalável e fácil de manter.
