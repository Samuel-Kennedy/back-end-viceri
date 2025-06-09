const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

const controller = require('../src/controllers/tarefaController');

describe('criarTarefa', () => {
  beforeEach(() => {
    controller.tarefas.length = 0;
    controller.tarefaIdCounter = 1;
  });

  it('cria tarefa com dados válidos', () => {
    const req = httpMocks.createRequest({
      body: { descricao: 'Fazer teste', prioridade: 'Alta' },
      usuario: { id: 1 }
    });
    const res = httpMocks.createResponse();

    controller.criarTarefa(req, res);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data.mensagem).toBe('Tarefa criada com sucesso');
    expect(data.tarefa.descricao).toBe('Fazer teste');
    expect(data.tarefa.prioridade).toBe('Alta');
    expect(data.tarefa.usuarioId).toBe(1);
    expect(data.tarefa.status).toBe('pendente');
  });

  it('retorna erro 400 se faltar descrição ou prioridade', () => {
    const req = httpMocks.createRequest({
      body: { descricao: '', prioridade: '' },
      usuario: { id: 1 }
    });
    const res = httpMocks.createResponse();

    controller.criarTarefa(req, res);

    expect(res.statusCode).toBe(400);
  });

  it('retorna erro 400 se prioridade inválida', () => {
    const req = httpMocks.createRequest({
      body: { descricao: 'Teste', prioridade: 'Urgente' },
      usuario: { id: 1 }
    });
    const res = httpMocks.createResponse();

    controller.criarTarefa(req, res);

    expect(res.statusCode).toBe(400);
  });
});


describe('listarTarefasPendentes', () => {
  beforeEach(() => {
    

    controller.tarefas.length = 0;
    controller.tarefaIdCounter = 1;

    controller.tarefas.push(
      { id: 1, descricao: 'tarefa1', prioridade: 'Alta', usuarioId: 1, status: 'pendente' },
      { id: 2, descricao: 'tarefa2', prioridade: 'Baixa', usuarioId: 1, status: 'pendente' },
      { id: 3, descricao: 'tarefa3', prioridade: 'Média', usuarioId: 2, status: 'pendente' },
      { id: 4, descricao: 'tarefa4', prioridade: 'Alta', usuarioId: 1, status: 'concluida' }
    );
  });

  it('lista apenas tarefas pendentes do usuário', () => {
    const req = httpMocks.createRequest({
      usuario: { id: 1 },
      query: {}
    });
    const res = httpMocks.createResponse();

    controller.listarTarefasPendentes(req, res);

    const data = res._getJSONData();
    expect(data.length).toBe(2);
    expect(data.every(t => t.usuarioId === 1 && t.status === 'pendente')).toBe(true);
  });

  it('filtra por prioridade', () => {
    const req = httpMocks.createRequest({
      usuario: { id: 1 },
      query: { prioridade: 'Alta' }
    });
    const res = httpMocks.createResponse();

    controller.listarTarefasPendentes(req, res);

    const data = res._getJSONData();
    expect(data.length).toBe(1);
    expect(data[0].prioridade).toBe('Alta');
  });
});

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

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

  it('loga usuário com sucesso', async () => {
    const usuarioMock = {
      id: 1,
      email: 'user@example.com',
      senha: 'hashFake'
    };
    controller.usuarios.push(usuarioMock);

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

  it('retorna erro se usuário não encontrado', async () => {
    const req = httpMocks.createRequest({
      body: { email: 'naoexiste@example.com', senha: '123456' }
    });
    const res = httpMocks.createResponse();

    await controller.login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().erro).toBe('Usuário não encontrado');
  });

  it('retorna erro se senha inválida', async () => {
    const usuarioMock = {
      id: 1,
      email: 'user@example.com',
      senha: 'hashFake'
    };
    controller.usuarios.push(usuarioMock);

    bcrypt.compare.mockResolvedValue(false);

    const req = httpMocks.createRequest({
      body: { email: 'user@example.com', senha: 'errada' }
    });
    const res = httpMocks.createResponse();

    await controller.login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().erro).toBe('Senha inválida');
  });
});
