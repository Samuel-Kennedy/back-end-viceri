const controller = require('../src/controllers/usuarioController');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../src/database/connection'); // ajuste o caminho conforme seu projeto

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../src/database/connection');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('cadastrar', () => {
  it('cadastra usuário com sucesso', async () => {
    // Mocka o knex para não encontrar email (retorna undefined)
    knex.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(undefined),
      insert: jest.fn().mockResolvedValue([1])
    }));

    bcrypt.hash.mockResolvedValue('hashFake');

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        nome: 'Samuel',
        email: 'samuel@example.com',
        senha: '123456'
      }
    });
    const res = httpMocks.createResponse();

    await controller.cadastrar(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().mensagem).toBe('Usuário criado com sucesso e tarefa inicial adicionada');
    expect(res._getJSONData().id).toBe(1);
  });

  it('retorna erro se email já existe', async () => {
    // Mocka o knex para encontrar email já cadastrado
    knex.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({
        id: 1,
        nome: 'Usuário Existente',
        email: 'existente@example.com',
        senha: 'hashSenha'
      })
    }));

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        nome: 'Novo Usuário',
        email: 'existente@example.com',
        senha: '123456'
      }
    });
    const res = httpMocks.createResponse();

    await controller.cadastrar(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().erro).toBe('Email já cadastrado');
  });
});

describe('login', () => {
  it('loga usuário com sucesso', async () => {
    // Mocka o knex para encontrar usuário
    knex.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({
        id: 1,
        nome: 'Samuel',
        email: 'samuel@example.com',
        senha: 'senhaHashFake'
      })
    }));

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('tokenFake');

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'samuel@example.com',
        senha: '123456'
      }
    });
    const res = httpMocks.createResponse();

    await controller.login(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().token).toBe('tokenFake');
  });

  it('retorna erro se usuário não encontrado', async () => {
    knex.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(undefined)
    }));

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'naoexiste@example.com',
        senha: 'qualquer'
      }
    });
    const res = httpMocks.createResponse();

    await controller.login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().erro).toBe('Usuário não encontrado');
  });

  it('retorna erro se senha inválida', async () => {
    knex.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({
        id: 1,
        nome: 'Samuel',
        email: 'samuel@example.com',
        senha: 'senhaHashFake'
      })
    }));

    bcrypt.compare.mockResolvedValue(false);

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'samuel@example.com',
        senha: 'errada'
      }
    });
    const res = httpMocks.createResponse();

    await controller.login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().erro).toBe('Senha inválida');
  });
});
