module.exports = (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        name: 'Usuário Admin',
        email: 'admin@sellone.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Vendedor Teste',
        email: 'vendedor@sellone.com',
        role: 'vendedor',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ],
    message: 'Usuários carregados com sucesso'
  });
};
