// Importa o módulo nativo 'http' do Node.js (o prefixo 'node:' indica que é um módulo interno do próprio Node)
import http from 'node:http'
// Importa o middleware que lê os chunks da requisição, converte o body para JSON e define o cabeçalho Content-Type
import { jsonBodyHandler } from './middlewares/jsonBodyHandler.js'
// Importa o middleware que identifica a rota chamada, extrai params/query e executa o controller correspondente
import { routeHandler } from './middlewares/routeHandler.js'

// Cria o servidor HTTP.
// A função passada como parâmetro é executada toda vez que o servidor recebe uma requisição.
// Usamos 'async' porque o middleware jsonBodyHandler lê os dados da requisição (streams) de forma assíncrona.
// - req (request): contém os dados de quem fez a requisição (método, URL, cabeçalhos, body, params, query).
// - res (response): objeto usado para devolver uma resposta ao cliente.
const server = http.createServer(async (req, res) => {
    // 1º Middleware: aguarda a leitura completa do corpo (body) da requisição e preenche o 'req.body'
    await jsonBodyHandler(req, res)
    // 2º Middleware: procura a rota correspondente à URL e ao método HTTP, extrai 'req.params' e 'req.query', e chama o controller
    routeHandler(req, res)
})

// Faz o servidor ficar "escutando" (aguardando conexões) na porta 3333 -> http://localhost:3333
server.listen(3333)