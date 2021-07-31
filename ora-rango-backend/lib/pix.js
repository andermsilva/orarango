"use strict";
require('dotenv').config({ path: '../../.env.producao' });

//const crendenciais = require('../../')
const https = require('https');
const axios = require('axios');
const fs = require('fs');
const { config } = require('process');


const apiProducao = 'https://api-pix.gerencianet.com.br';
const apiStaging = 'https://api-pix-h.gerencianet.com.br';

const baseurl = process.env.GN_ENV === "producao" ? apiProducao : apiStaging;

const getToken = async () => {
    console.log(process.env.GN_ENV);

    const certificado = fs.readFileSync(`../../${process.env.GN_CERTIFICADO}`);

    const credenciais = {
        client_id: process.env.GN_CLIENT_ID,
        client_secret: process.env.GN_CLIENT_SECRET
    };
    const data = JSON.stringify({ grant_type: "client_credentials" });
    const dataCredenciais = credenciais.client_id + ":" + credenciais.client_secret;

    const auth = Buffer.from(dataCredenciais).toString("base64");

    const agent = new https.Agent({
        pfx: certificado,
        passphrase: "",
    });


    const config = {
        method: "POST",
        url: `${baseurl}/oauth/token`,
        headers: {
            Authorization: "Basic " + auth,
            "Content-Type": "application/json",
        },
        httpsAgent: agent,
        data: data,

    }
    const result = await axios(config);
    // console.log(result)
    return result.data;

}

const createCharge = async (accessToken, chargeData) => {
    const certificado = fs.readFileSync(`../${process.env.GN_CERTIFICADO}`);

    const data = JSON.stringify(chargeData);

    const agent = new https.Agent({
        pfx: certificado,
        passphrase: "",
    });


    const config = {
        method: "POST",

        url: `${baseurl}/v2/cob`,
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
        },
        httpsAgent: agent,
        data: data,

    }
    const result = await axios(config);

    // console.log(config, '/n', data)

    return result.data;
}


const getLoc = async (accessToken, locId) => {
    const certificado = fs.readFileSync(`../${process.env.GN_CERTIFICADO}`);

    const agent = new https.Agent({
        pfx: certificado,
        passphrase: "",
    });

    const config = {
        method: "GET",

        url: `${baseurl}/v2/loc/${locId}/qrcode`,
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
        },
        httpsAgent: agent,
    }
    // console.log(config.url)
    const result = await axios(config);
    return result.data;


}

const createPixCharge = async () => {
    const chave = process.env.CHAVE_pix;
    const token = await getToken();
    const accessToken = token.access_token;

    const cob = {

        calendario: {
            expiracao: 3600
        },
        devedor: {
            cpf: "12345678909",
            nome: "Anderson Marques",
        },
        valor: {
            original: "2.00",

        },
        chave: chave, //minha chave pix
        solicitacaoPagador: "Cobrança de serviços"

    }
    const cobranca = await createCharge(accessToken, cob);
    //console.log(cobranca)
    const qrcode = await getLoc(accessToken, cobranca.loc.id);

    return { qrcode, cobranca }

}


const createWebhook = async () => {
    const chave = process.env.CHAVE_pix;
    const token = await getToken();
    const accessToken = token.access_token;
    require('../../')

    const certificado = fs.readFileSync(`../${process.env.GN_CERTIFICADO}`);

    const data = JSON.stringify({
        webhookUrl: 'https://api-orarango.amsdev.com.br/webhook/pix',
    });

    const agent = new https.Agent({
        pfx: certificado,
        passphrase: "",
    });


    const config = {
        method: "PUT",

        url: `${baseurl}/v2/webhook/${chave}`,
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
        },
        httpsAgent: agent,
        data: data,

    }
    const result = await axios(config);

    // console.log(config, '/n', data)

    return result.data;

}

module.exports = {
    createPixCharge,
    createWebhook,
}




