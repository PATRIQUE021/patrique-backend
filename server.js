const express = require('express');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const cors = require('cors');
const app = express();

// Configurações do servidor
app.use(express.json());
app.use(cors());

// Configuração do Mercado Pago usando a variável do Render
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_TOKEN
});

const payment = new Payment(client);

// Rota para criar o pagamento PIX
app.post('/criar-pagamento', async (req, res) => {
    try {
        const { valor } = req.body;
        
        const payment_data = {
            transaction_amount: Number(valor),
            description: 'Compra Patrique Store',
            payment_method_id: 'pix',
            payer: {
                email: 'cliente@teste.com'
            }
        };

        const result = await payment.create({ body: payment_data });

        res.json({
            qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64,
            copiaECola: result.point_of_interaction.transaction_data.qr_code
        });

    } catch (error) {
        console.error('Erro ao gerar PIX:', error);
        res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
});

// Porta do servidor (o Render usa a 10000 por padrão)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor Patrique Store rodando na porta ${PORT}`);
});