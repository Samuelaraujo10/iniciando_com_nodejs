// Função que transforma a string de query params da URL (ex: '?category=computador&page=2')
// em um objeto JavaScript fácil de usar (ex: { category: 'computador', page: '2' })
export function extractQueryParams(query) {
    // 1. query.slice(1): remove o primeiro caractere (o '?' inicial), sobrando 'category=computador&page=2'
    // 2. .split("&"): separa cada parâmetro pelo '&', gerando uma lista: ['category=computador', 'page=2']
    // 3. .reduce(..., {}): percorre essa lista acumulando cada chave e valor dentro de um objeto inicialmente vazio {}
    return query.slice(1).split("&").reduce((queryParams, param) => {
        // Divide 'category=computador' pelo '=' e desestrutura em key ('category') e value ('computador')
        const [key, value] = param.split("=")
        
        // Cria a propriedade dentro do objeto acumulador: queryParams['category'] = 'computador'
        queryParams[key] = value;
        
        // Retorna o objeto atualizado para a próxima volta do reduce
        return queryParams
    }, {})
}