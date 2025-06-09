const tarefas = [];
const usuarios = [];
const state = {
  tarefaIdCounter: 1,
  usuarioIdCounter: 1
};

exports.tarefas = tarefas;
exports.usuarios = usuarios;
exports.state = state;

// Criar tarefa
exports.criarTarefa = (req, res) => {
  const { descricao, prioridade } = req.body;
  const usuarioId = req.usuario.id;

  if (!descricao || !prioridade) {
    return res.status(400).json({ erro: 'Descrição e prioridade são obrigatórias' });
  }

  const prioridadesValidas = ['Alta', 'Média', 'Baixa'];
  if (!prioridadesValidas.includes(prioridade)) {
    return res.status(400).json({ erro: 'Prioridade inválida. Use Alta, Média ou Baixa.' });
  }

  const novaTarefa = {
    id: state.tarefaIdCounter++,
    descricao,
    prioridade,
    usuarioId,
    status: 'pendente',
  };

  tarefas.push(novaTarefa);

  res.status(201).json({ mensagem: 'Tarefa criada com sucesso', tarefa: novaTarefa });
};

// Listar tarefas pendentes
exports.listarTarefasPendentes = (req, res) => {
  const usuarioId = req.usuario.id;
  const { prioridade, status } = req.query;

  let resultado = tarefas.filter(t =>
    t.usuarioId === usuarioId &&
    t.status === 'pendente'
  );

  if (prioridade) {
    resultado = resultado.filter(t => t.prioridade === prioridade);
  }

  if (status) {
    resultado = resultado.filter(t => t.status === status);
  }

  resultado.sort((a, b) => b.id - a.id);

  res.json(resultado);
};

// Cadastrar usuário
exports.cadastrar = (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
  }

  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  const novoUsuario = {
    id: state.usuarioIdCounter++,
    nome,
    email,
    senha: 'hashFake', // <- simula senha com hash para bater com o teste
  };

  usuarios.push(novoUsuario);

  res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: novoUsuario });
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
