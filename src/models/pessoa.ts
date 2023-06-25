export interface Pessoa  {
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
    CODIGO_MUNICIPIO?: number;
    NOME_BAIRRO?: string;
    STATUS_BAIRRO: string;
    CODIGO_UF: number;
    NOME_MUNICIPIO: string;
    STATUS_MUNICIPIO: string;
    SIGLA: string
    NOME_UF: string;
    STATUS_UF: string;
  
}

export default Pessoa;
