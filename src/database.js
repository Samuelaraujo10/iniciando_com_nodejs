// Importa o módulo nativo 'fs/promises' (File System com suporte a Promises: .then/.catch ou async/await)
// para ler e escrever arquivos no disco
import fs from 'node:fs/promises'

// Cria o caminho absoluto para o arquivo 'db.json' baseado na localização atual deste arquivo (import.meta.url).
// Isso garante que o arquivo 'db.json' sempre será salvo dentro da mesma pasta de 'database.js' (src/db.json),
// independentemente de qual pasta você esteja no terminal ao rodar o comando 'node'.
const DATABASE_PATH = new URL('db.json', import.meta.url)

// Classe que gerencia o banco de dados em memória e salva os dados em um arquivo JSON (persistência em disco)
export class Database {
    // O símbolo '#' torna a propriedade PRIVADA: ela só pode ser acessada dentro desta classe (Database).
    // Quem instancia 'new Database()' lá fora não consegue acessar ou bagunçar 'database.#database' diretamente,
    // sendo obrigado a usar os métodos públicos 'insert' e 'select' (Encapsulamento).
    #database = {};

    // O método constructor() é executado automaticamente assim que fazemos 'new Database()'
    constructor() {
        // Lê o arquivo 'db.json' no formato de texto 'utf-8'
        fs.readFile(DATABASE_PATH, 'utf-8')
        // Se o arquivo existir e a leitura der certo (.then):
        .then((data) => {
            // Converte o texto JSON do arquivo de volta para objeto JavaScript e carrega na memória (#database)
            this.#database = JSON.parse(data)
        })
        // Se o arquivo 'db.json' ainda não existir (.catch), chama #persist() para criar o arquivo inicial com '{}'
        .catch(() => this.#persist())
    }

    // Método privado ('#') responsável por salvar os dados da memória (#database) dentro do arquivo físico 'db.json'
    #persist() {
        // Converte o objeto '#database' para texto JSON e escreve no arquivo apontado por DATABASE_PATH
        fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database))
    }

    // Método público para inserir um novo registro (data) dentro de uma tabela (table)
    insert(table, data) {
        // Verifica se já existe um array criado para essa tabela dentro de 'this.#database'
        if (Array.isArray(this.#database[table])) {
            // Se a tabela já existe, apenas adiciona (push) o novo item no array existente
            this.#database[table].push(data)
        } else {
            // Se a tabela ainda não existe, cria a propriedade com um novo array contendo esse primeiro item
            this.#database[table] = [data]
        }

        // Salva as alterações no arquivo 'db.json' toda vez que um novo item é inserido
        this.#persist()
    }

    // Método público para buscar todos os registros de uma tabela (table)
    select(table) {
        // Operador de Coalescência Nula (??):
        // Retorna os dados da tabela 'this.#database[table]'; mas se essa tabela ainda não existir (for undefined ou null),
        // retorna um array vazio '[]' por padrão para evitar erros.
        return this.#database[table] ?? []
    }
}