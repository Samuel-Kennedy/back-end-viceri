const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../database/connection');

exports.cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioExistente = await knex('usuarios').where({ email }).first();
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const [id] = await knex('usuarios').insert({
      nome,
      email,
      senha: hashSenha
    });

    await knex('tarefas').insert({
      descricao: 'Tarefa inicial automática',
      prioridade: 'Média',
      usuario_id: id,
      status: 'pendente'
    });

    return res.status(201).json({ mensagem: 'Usuário criado com sucesso e tarefa inicial adicionada', id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário ou criar tarefa' });
  }
};



exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await knex('usuarios').where({ email }).first();
    if (!usuario) {
      return res.status(400).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: 'Senha inválida' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro no login' });
  }
};
