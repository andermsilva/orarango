require('dotenv').config({ path: '../.env.producao' });

const https = require('https');
const fs = require('fs');
const app = require('./app');
//const app1 = require('../credenciais.json');

const options = {

    //tls
    key: fs.readFileSync('/etc/letsencrypt/live/api-orarango.amsdev.com.br/privkey.pem '),
    cert: fs.readFileSync('/etc/letsencrypt/live/api-orarango.amsdev.com.br/fullchain.pem'),

    //mtls
    ca: fs.readFileSync('.ca-gerencinet.crt'),
    miniVersion: 'TLSv1.2',
    rejectUnauthorized: false

}

const server = https.createServer(options, app);
server.listenerCount(443)

