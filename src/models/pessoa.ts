export interface Pessoa {
    CODIGO_PESSOA?: number;
    NOME?: string;
    SOBRENOME?: string;
    IDADE?: number;
    LOGIN?: string;
    SENHA?: string;
    STATUS?: number;
    CODIGO_ENDERECO?: number;
    CODIGO_BAIRRO?: number;
    NOME_RUA?: string;
    NUMERO?: string;
    COMPLEMENTO?: string;
    CEP?: string;
}

export default Pessoa;
