// Função responsável por transformar o caminho da rota (ex: '/products/:id')
// em uma Expressão Regular (RegExp) capaz de capturar parâmetros dinâmicos (:id) e query params (?page=1)
export function parseRoutePath(path) {
    // Regex que procura qualquer parâmetro dinâmico que comece com ':' seguido de letras (ex: ':id', ':category')
    // O 'g' (global) faz procurar todas as ocorrências no caminho, e os parênteses '([a-zA-Z]+)' capturam só o nome sem os dois-pontos
    const routeParameterRegex = /:([a-zA-Z]+)/g

    // Substitui cada ':parametro' por um grupo de captura nomeado na Regex: (?<nomeDoParametro>[a-z0-9-_]+)
    // O '$1' pega o nome capturado pela regex acima (ex: 'id') e coloca como nome do grupo '(?<id>...)'
    // '[a-z0-9-_]+' aceita letras minúsculas, números, hífen e underline como valor do parâmetro
    const withParams = path.replaceAll(routeParameterRegex, "(?<$1>[a-z0-9-_]+)")
    
    // Cria a Expressão Regular final da rota:
    // - '^' exige que a URL comece exatamente ali
    // - '${withParams}' insere o caminho já com os grupos de parâmetros
    // - '(?<query>\\?(.*))?' cria um grupo opcional (por causa do '?' no final) chamado 'query'
    //   que captura tudo a partir do ponto de interrogação '\\?' da URL (ex: '?category=computador&price=1000')
    // - '$' exige que a URL termine exatamente ali
    const pathRegex = new RegExp(`^${withParams}(?<query>\\?(.*))?$`)

    return pathRegex
}
