const tarefas = []; // array em memória para armazenar tarefas
let tarefaIdCounter = 1; // contador para ID único

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
    id: tarefaIdCounter++,
    descricao,
    prioridade,
    usuarioId,
    status: 'pendente',
  };

  tarefas.push(novaTarefa);

  res.status(201).json({ mensagem: 'Tarefa criada com sucesso', tarefa: novaTarefa });
};

exports.listarTarefasPendentes = (req, res) => {
  const usuarioId = req.usuario.id;
  const { prioridade, status } = req.query; // parâmetros opcionais na URL

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

  // Ordena por ID decrescente (mais recente primeiro)
  resultado.sort((a, b) => b.id - a.id);

  res.json(resultado);
};

