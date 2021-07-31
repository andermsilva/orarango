require('dotenv').config({ path: '../../.env.homologacao' });

const { v4 } = require('uuid');

const { GoogleSpreadsheet } = require('google-spreadsheet');

const credencials = require('../../credenciais.json')

const doc = new GoogleSpreadsheet(process.env.DOC_ID_SHEET);

const fromBase64 = value => {
    const buff = Buffer.from(value, 'base64');
    return buff.toString('ascii');
}

const saveOrder = async (order) => {


    await doc.useServiceAccountAuth({
        client_email: process.env.EMAIL_GOGLE_API,
        private_key: credencials.private_key
        //private_key: fromBase64(process.env.PRIVATE_KEY_GOOGLE)
    });




    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];

    const orderId = order.id;

    const total = order.items.reduce((prev, curr) => {
        return prev + curr.price * curr.quantity;

    }, 0);

    const rows = order.items.map(item => {
        const row = {
            'Pedido': orderId,
            'nome cliente': order.nome,
            'telefone cleinte': order.telefone,
            'CPF': order.cpf,
            'produto': item.name,
            'quantidade': item.quantity,
            'preço': item.price,
            'subtotal': item.price * item.quantity,
            'desc.%': 0,
            'total': total,
            'staus': 'aguardando pagamento'
        }
        return row;
    })

    await sheet.addRows(rows);


}

module.exports = {
    saveOrder,
}