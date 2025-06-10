const jwt = require('jsonwebtoken');
const autenticarToken = require('../src/middlewares/authMiddleware');

describe('Middleware autenticarToken', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve retornar 401 se token não for fornecido', () => {
    req.headers['authorization'] = undefined;

    autenticarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se token for inválido', () => {
    req.headers['authorization'] = 'Bearer tokenInvalido';
    
    jwt.verify = jest.fn((token, secret, callback) => callback(new Error('Token inválido'), null));

    autenticarToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('tokenInvalido', process.env.JWT_SECRET, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next e anexar usuario se token for válido', () => {
    const usuarioMock = { id: 123, nome: 'Teste' };
    req.headers['authorization'] = 'Bearer tokenValido';

    jwt.verify = jest.fn((token, secret, callback) => callback(null, usuarioMock));

    autenticarToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('tokenValido', process.env.JWT_SECRET, expect.any(Function));
    expect(req.usuario).toEqual(usuarioMock);
    expect(next).toHaveBeenCalled();
  });
});
