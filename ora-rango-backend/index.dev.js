require('dotenv').config({ path: '../.env.homologacao' });



const app = require('./app')
app.listen(3001, (err) => {
    if (err) {
        console.log('Servidor não iniciado');
        console.log(err);
    } else {
        console.log('servidor Ora-do-rango rodando na porta: 3001')
    }
})