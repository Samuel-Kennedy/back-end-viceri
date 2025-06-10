const controller = require('../src/controllers/tarefaController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

// Mock único e consistente do knex
jest.mock('../src/database/connection', () => {
  // Objeto que simula o query builder do knex
  const mockQueryBuilder = {
    insert: jest.fn(() => Promise.resolve([1])),
    where: jest.fn(() => mockQueryBuilder),
    andWhere: jest.fn(() => mockQueryBuilder),
    first: jest.fn(() => Promise.resolve({
      id: 1,
      descricao: 'Fazer teste',
      prioridade: 'Alta',
      usuario_id: 1,
      status: 'pendente'
    })),
    orderBy: jest.fn(() => Promise.resolve([
      { id: 1, descricao: 'tarefa1', prioridade: 'Alta', usuario_id: 1, status: 'pendente' },
      { id: 2, descricao: 'tarefa2', prioridade: 'Baixa', usuario_id: 1, status: 'pendente' }
    ]))
  };

  // Função knex mockada retorna o mockQueryBuilder
  const knex = jest.fn(() => mockQueryBuilder);

  // Para chamadas diretas como knex('tabela').where(...), ou knex.where(...)
  Object.assign(knex, mockQueryBuilder);

  return knex;
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('criarTarefa', () => {
  it('cria tarefa com dados válidos', async () => {
    const req = httpMocks.createRequest({
      body: { descricao: 'Fazer teste', prioridade: 'Alta' },
      usuario: { id: 1 }
    });
    const res = httpMocks.createResponse();

    await controller.criarTarefa(req, res);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data.mensagem).toBe('Tarefa criada com sucesso');
    expect(data.tarefa.descricao).toBe('Fazer teste');
    expect(data.tarefa.prioridade).toBe('Alta');
    expect(data.tarefa.usuario_id).toBe(1);
    expect(data.tarefa.status).toBe('pendente');
  });

  it('retorna erro 400 se faltar descrição ou prioridade', async () => {
    const req = httpMocks.createRequest({
      body: { descricao: '', prioridade: '' },
      usuario: { id: 1 }
    });
    const res = httpMocks.createResponse();

    await controller.criarTarefa(req, res);

    expect(res.statusCode).toBe(400);
  });

  it('retorna erro 400 se prioridade inválida', async () => {
    const req = httpMocks.createRequest({
      body: { descricao: 'Teste', prioridade: 'Urgente' },
      usuario: { id: 1 }
    });
    const res = httpMocks.createResponse();

    await controller.criarTarefa(req, res);

    expect(res.statusCode).toBe(400);
  });
});

describe('listarTarefasPendentes', () => {
  it('lista apenas tarefas pendentes do usuário', async () => {
    const req = httpMocks.createRequest({
      usuario: { id: 1 },
      query: {}
    });
    const res = httpMocks.createResponse();

    await controller.listarTarefasPendentes(req, res);

    const data = res._getJSONData();
    expect(data.length).toBe(2);
    expect(data.every(t => t.usuario_id === 1 && t.status === 'pendente')).toBe(true);
  });

  it('filtra por prioridade', async () => {
    // Ajusta o mock para retornar só prioridade 'Alta'
    const knex = require('../src/database/connection');
    knex.orderBy.mockImplementation(() => Promise.resolve([
      { id: 1, descricao: 'tarefa1', prioridade: 'Alta', usuario_id: 1, status: 'pendente' }
    ]));

    const req = httpMocks.createRequest({
      usuario: { id: 1 },
      query: { prioridade: 'Alta' }
    });
    const res = httpMocks.createResponse();

    await controller.listarTarefasPendentes(req, res);

    const data = res._getJSONData();
    expect(data.length).toBe(1);
    expect(data[0].prioridade).toBe('Alta');
  });
});

describe('cadastrar', () => {
  beforeEach(() => {
    controller.usuarios.length = 0;
    bcrypt.hash.mockClear();
  });

  it('cadastra usuário com sucesso', async () => {
    bcrypt.hash.mockResolvedValue('hashFake');

    const req = httpMocks.createRequest({
      body: { nome: 'Usuário', email: 'user@example.com', senha: '123456' }
    });
    const res = httpMocks.createResponse();

    await controller.cadastrar(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().mensagem).toBe('Usuário criado com sucesso');
    expect(controller.usuarios.length).toBe(1);
    expect(controller.usuarios[0].senha).toBe('hashFake');
  });

  it('retorna erro se email já existe', async () => {
    controller.usuarios.push({ email: 'user@example.com' });

    const req = httpMocks.createRequest({
      body: { nome: 'Usuário', email: 'user@example.com', senha: '123456' }
    });
    const res = httpMocks.createResponse();

    await controller.cadastrar(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().erro).toBe('Email já cadastrado');
  });
});

describe('login', () => {
  beforeEach(() => {
    controller.usuarios.length = 0;
    bcrypt.compare.mockClear();
    jwt.sign.mockClear();
  });

  it('realiza login com sucesso', async () => {
    controller.usuarios.push({
      id: 1,
      email: 'user@example.com',
      senha: 'hashFake'
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('tokenFake');

    const req = httpMocks.createRequest({
      body: { email: 'user@example.com', senha: '123456' }
    });
    const res = httpMocks.createResponse();

    await controller.login(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().token).toBe('tokenFake');
  });

  it('retorna erro se usuário não existe', async () => {
    const req = httpMocks.createRequest({
      body: { email: 'naoexiste@example.com', senha: '123456' }
    });
    const res = httpMocks.createResponse();

    await controller.login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().erro).toBe('Usuário não encontrado');
  });

  it('retorna erro se senha inválida', async () => {
    controller.usuarios.push({
      id: 1,
      email: 'user@example.com',
      senha: 'hashFake'
    });

    bcrypt.compare.mockResolvedValue(false);

    const req = httpMocks.createRequest({
      body: { email: 'user@example.com', senha: 'senhaerrada' }
    });
    const res = httpMocks.createResponse();

    await controller.login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().erro).toBe('Senha inválida');
  });
});
