// Importa a função que converte o texto do caminho da rota (ex: '/products/:id') em uma Expressão Regular (RegExp)
import { parseRoutePath } from "./utils/parseRoutePath.js";


// Lista de rotas da aplicação. Cada rota é um objeto com:
// - method: método HTTP (GET, POST, DELETE, PUT, PATCH)
// - path: endereço da rota (pode conter parâmetros dinâmicos com ':nome')
// - controller: função executada quando a rota é chamada
export const routes = [
    {
        // Rota para listar produtos (pode receber filtros via query params, ex: /products?category=teclado)
        method: 'GET',
        path: '/products',
        // Desestrutura { req, res, database } do objeto enviado pelo routeHandler
        controller: ({ req, res, database }) => {
            // Busca todos os registros da tabela 'products' no banco de dados
            const products = database.select('products')
            // Converte a lista de produtos em texto JSON e envia na resposta ao cliente
            return res.end(JSON.stringify(products));
        },
    },

    {
        // Rota para cadastrar um novo produto
        method: 'POST',
        path: '/products',
        controller: ({ req, res, database }) => {
            // Desestrutura as propriedades 'name' e 'price' enviadas pelo cliente no corpo (body) da requisição
            const { name, price } = req.body;

            // Insere o novo produto na tabela 'products' do banco de dados (e salva no arquivo db.json)
            database.insert('products', { name, price });

            // Retorna status HTTP 201 (Created) e finaliza a resposta
            return res.writeHead(201).end()
        }
    },

    {
        // Rota para remover um produto específico pelo seu ':id' na URL (ex: DELETE /products/42)
        method: 'DELETE',
        path: '/products/:id',
        // Como esta rota ainda não usa 'database', desestruturamos apenas { req, res }
        controller: ({ req, res }) => {
            // Acessa o parâmetro ':id' capturado na URL através de req.params.id
            return res.end("Produto com o id: " + req.params.id + " foi removido.")
        }
    },
// O .map() percorre cada rota declarada acima e transforma a propriedade 'path' (string)
// na Expressão Regular gerada por parseRoutePath(route.path), mantendo as demais propriedades com '...route' (Spread Operator)
].map((route) => ({
    ...route,
    path: parseRoutePath(route.path)
}));