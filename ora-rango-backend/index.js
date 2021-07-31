require('dotenv').config({ path: '../.env.producao' });

const https = require('https');
const fs = require('fs');
const app = require('./app');
const { createWebhook } = require('./lib/pix')
//const app1 = require('../credenciais.json');

const options = {

    //tls
    key: fs.readFileSync('/etc/letsencrypt/live/api-orarango.amsdev.com.br/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api-orarango.amsdev.com.br/fullchain.pem'),




    //mtls
    ca: fs.readFileSync('./ca-gerencianet.crt'),
    miniVersion: 'TLSv1.2',
    requesCert: true,
    rejectUnauthorized: false

}

const server = https.createServer(options, app);


server.listen(443, () => {
    console.log('server running...')
    console.log('creating webhook fot pix')
    createWebhook().then(() => {
        console.log('wewbhook created')
    })
})



