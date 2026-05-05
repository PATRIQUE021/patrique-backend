const express = require('express');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Configuração atualizada do Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: 'TEST-1435725852798182-050404-8aea6ac5a0df64a6afdc4d6a4b5bfaad-378750823' 
});
const payment = new Payment(client);

app.post('/gerar-pix', async (req, res) => {
    try {
        const { valor } = req.body;
        const payment_data = {
            transaction_amount: Number(valor),
            description: 'Compra Patrique Store',
            payment_method_id: 'pix',
            payer: { email: 'cliente@teste.com' }
        };

        const response = await payment.create({ body: payment_data });
        
        res.json({
            copiaECola: response.point_of_interaction.transaction_data.qr_code,
            qrCodeBase64: response.point_of_interaction.transaction_data.qr_code_base64
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Patrique Store rodando na porta ${PORT}`));