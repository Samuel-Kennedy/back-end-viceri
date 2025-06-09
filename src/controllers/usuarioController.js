const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuarios = []; // vai guardar usuários na memória por enquanto

exports.cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  const hashSenha = await bcrypt.hash(senha, 10);

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha: hashSenha
  };

  usuarios.push(novoUsuario);

  res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
};

exports.login = async (req, res) => {
  console.log('JWT_SECRET no login:', process.env.JWT_SECRET); // <--- aqui

  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return res.status(400).json({ erro: 'Usuário não encontrado' });

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) return res.status(400).json({ erro: 'Senha inválida' });

  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};

exports.usuarios = usuarios;
