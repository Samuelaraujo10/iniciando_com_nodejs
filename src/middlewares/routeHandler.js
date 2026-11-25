// Importa a lista de rotas da aplicação (onde cada path já foi convertido em RegExp)
import { routes } from "../routes.js";
// Importa a função utilitária que converte a string de query params ('?a=1&b=2') em objeto ({ a: '1', b: '2' })
import { extractQueryParams } from "../utils/extract-query-params.js";
// Importa a classe Database para gerenciar a leitura e escrita no banco de dados (db.json)
import { Database } from "../database.js";

// Cria uma única instância do banco de dados quando o servidor inicia.
// Assim, todas as requisições compartilham a mesma instância carregada em memória.
const database = new Database();

// Middleware responsável por encontrar e executar a rota correspondente à requisição
export function routeHandler(req, res){
    // Percorre o array de rotas procurando a primeira que tenha:
    // 1. O mesmo método HTTP (GET, POST, DELETE...)
    // 2. A URL compatível com a Regex da rota (route.path.test(req.url) retorna true ou false)
    const route = routes.find(route => {
     return route.method === req.method && route.path.test(req.url);
    });

    // Se encontrou uma rota válida:
    if (route) {
      // Executa a Regex da rota sobre a URL da requisição para extrair os grupos nomeados (params e query)
      const routeParams = req.url.match(route.path)
      
      // Desestrutura o objeto 'groups' retornado pela Regex:
      // Separa a propriedade 'query' (ex: '?page=1') e agrupa todo o resto (ex: { id: '123' }) dentro de 'params' usando o Rest Operator (...params)
      const { query, ...params } = routeParams.groups
      
      // Anexa os parâmetros de rota (ex: req.params.id) ao objeto req para ficarem acessíveis no controller
      req.params = params
      // Operador ternário: se existir query na URL, converte em objeto com extractQueryParams(query); senão, define como objeto vazio {}
      req.query = query ? extractQueryParams(query) : {}

      // Executa a função controller da rota encontrada enviando um objeto (Named Parameters) com { req, res, database }.
      // Passar como objeto facilita desestruturar apenas o que cada rota precisa, sem depender da ordem dos parâmetros.
      return route.controller({ req, res, database });
    }

    // Caso nenhuma das rotas acima seja atendida, retorna status HTTP 404 (Not Found / Não encontrado).
    // Sempre tem que ter uma resposta do servidor, senão o cliente fica aguardando infinitamente.
    return res.writeHead(404).end('Rota não encontrada')
}