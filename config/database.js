const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://edvar:edvar123@cluster0.npuas1m.mongodb.net/sellone?retryWrites=true&w=majority';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
