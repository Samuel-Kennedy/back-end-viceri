const controller = require('../src/controllers/usuarioController');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

beforeEach(() => {
  // Limpa usuários e mocks antes de cada teste
  controller.usuarios = [];
  jest.clearAllMocks();
});

describe('cadastrar', () => {
  it('cadastra usuário com sucesso', async () => {
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
    expect(res._getJSONData().mensagem).toBe('Usuário criado com sucesso');
    expect(controller.usuarios.length).toBe(1);
    expect(controller.usuarios[0].senha).toBe('hashFake');
  });

  it('retorna erro se email já existe', async () => {
    controller.usuarios.push({
      id: 1,
      nome: 'Usuário existente',
      email: 'existente@example.com',
      senha: 'qualquercoisa'
    });

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
    controller.usuarios.push({
      id: 1,
      nome: 'Samuel',
      email: 'samuel@example.com',
      senha: 'senhaHashFake'
    });

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
    controller.usuarios.push({
      id: 1,
      nome: 'Samuel',
      email: 'samuel@example.com',
      senha: 'senhaHashFake'
    });

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
