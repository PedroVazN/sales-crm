module.exports = (req, res) => {
  res.json({
    message: 'API de teste funcionando!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
};
