const admin = require('firebase-admin');
const serviceAccount = require('../../../Trabajos U/Programacion Web/Proyecto_Recetas/novamarketapp-firebase-adminsdk-rkgrg-5858c2433b.json'); // Cambia el nombre aquí

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'novamarketapp.appspot.com', // Cambia esto por el nombre de tu bucket
});

module.exports = admin;
