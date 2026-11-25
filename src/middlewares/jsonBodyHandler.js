export async function jsonBodyHandler(req, res) {
     // Array para armazenar os pedacinhos (chunks) de dados que chegam no corpo (body) da requisição
        const buffers = []
        
        // No Node.js, a requisição (req) é uma Stream de leitura: os dados chegam aos poucos em pedaços (chunks).
        // O 'for await' aguarda cada pedaço (chunk) chegar pela rede até que o envio do body termine por completo.
        for await (const chunk of req) {
            buffers.push(chunk) // Guarda cada pedaço binário (Buffer) dentro do array
        }

        try {
            // concatena os chucks e converte para string. Em seguida, converte a string para JSON.
            req.body = JSON.parse(Buffer.concat(buffers).toString())
        } catch (error) {
            // Se der erro ao converter o body para JSON, define como null
            req.body = null
        }

        // Define o cabeçalho 'Content-type' como 'application/json'.
        // Isso informa ao navegador (ou ao cliente) que a resposta será em formato JSON,
        // o que permite que navegadores executem `res.json()` ou que clientes usem `JSON.parse()` automaticamente.
        res.setHeader("Content-type", "application/json")
}