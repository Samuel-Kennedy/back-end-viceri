const knex = require('../database/connection'); // ajuste o caminho conforme necessário
const usuarios = [];
const state = { usuarioIdCounter: 1 }; // já é usado na função cadastrar
const bcrypt = require('bcrypt');

exports.usuarios = usuarios;
exports.state = state;

// Criar tarefa
exports.criarTarefa = async (req, res) => {
  const { descricao, prioridade } = req.body;
  const usuarioId = req.usuario.id;

  if (!descricao || !prioridade) {
    return res.status(400).json({ erro: 'Descrição e prioridade são obrigatórias' });
  }

  const prioridadesValidas = ['Alta', 'Média', 'Baixa'];
  if (!prioridadesValidas.includes(prioridade)) {
    return res.status(400).json({ erro: 'Prioridade inválida. Use Alta, Média ou Baixa.' });
  }

  try {
    const [id] = await knex('tarefas').insert({
      descricao,
      prioridade,
      usuario_id: usuarioId,
      status: 'pendente',
    });

    const novaTarefa = await knex('tarefas').where({ id }).first();

    return res.status(201).json({ mensagem: 'Tarefa criada com sucesso', tarefa: novaTarefa });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao criar tarefa' });
  }
};

// Listar tarefas pendentes
exports.listarTarefasPendentes = async (req, res) => {
  const usuarioId = req.usuario.id;
  const { prioridade, status = 'pendente' } = req.query;
  console.log('req.usuario:', req.usuario);

  try {
    let query = knex('tarefas').where({ usuario_id: usuarioId });

    if (status) {
      query = query.andWhere('status', status);
    }

    if (prioridade) {
      query = query.andWhere('prioridade', prioridade);
    }

    const tarefas = await query.orderBy('id', 'desc');

    return res.json(tarefas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao listar tarefas' });
  }
};


exports.cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
  }

  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = {
    id: state.usuarioIdCounter++,
    nome,
    email,
    senha: senhaHash
  };

  usuarios.push(novoUsuario);

  return res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
};


// Login
exports.login = (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(400).json({ erro: 'Usuário não encontrado' });
  }

  if (senha !== '123456') {
    return res.status(400).json({ erro: 'Senha inválida' });
  }

  res.status(200).json({ mensagem: 'Login realizado com sucesso', token: 'tokenFake', usuario });
};
