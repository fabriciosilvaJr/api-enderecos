import { Bairro } from "./../models/bairro";
import { Request, Response } from "express";
import Pessoa from "./../models/pessoa";
import db from "./../database";
import { error } from "console";

const dbConexao = new db();

class PessoaController {
    public criacaoPessoa = async (req: Request, res: Response) => {
        await dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                const {
                    nome,
                    sobrenome,
                    idade,
                    login,
                    senha,
                    status,
                    enderecos,
                } = req.body;

                const queryPessoa = `INSERT INTO tb_pessoa (codigo_pessoa,nome,sobrenome, idade, login, senha, status)
                 Values (SEQUENCE_PESSOA.nextval, :nome, :sobrenome, :idade, :login, :senha, :status) `;

                const result = await connection.execute(
                    queryPessoa,
                    [nome, sobrenome, idade, login, senha, status],
                    { autoCommit: true }
                );

                if (result.rowsAffected == 1) {
                    const codigoPessoa = await connection.execute(
                        "select max(codigo_pessoa) as max from tb_pessoa"
                    );
                    //console.log(codigoPessoa.rows[0].MAX)
                    const contador = enderecos.length;

                    const queryEndereco = `INSERT INTO tb_endereco (codigo_endereco, codigo_pessoa, codigo_bairro, nome_rua, numero, complemento, cep) 
                        Values (SEQUENCE_ENDERECO.nextval, :codigoPessoa , :codigoBairro, :nomeRua, :numero, :complemento, :cep)
                    `;
                    for (let i = 0; i < contador; i++) {
                        await connection.execute(
                            queryEndereco,
                            [
                                codigoPessoa.rows[0].MAX,
                                enderecos[i].codigoBairro,
                                enderecos[i].nomeRua,
                                enderecos[i].numero,
                                enderecos[i].complemento,
                                enderecos[i].cep,
                            ],
                            { autoCommit: true }
                        );
                    }
                }

                const results = await connection.execute(
                    "SELECT * FROM tb_pessoa order by codigo_pessoa DESC"
                );

                const response = {
                    pessoas: results.rows.map((pessoa: Pessoa) => {
                        return {
                            codigoPessoa: pessoa.CODIGO_PESSOA,
                            nome: pessoa.NOME,
                            sobrenome: pessoa.SOBRENOME,
                            idade: pessoa.IDADE,
                            login: pessoa.LOGIN,
                            senha: pessoa.SENHA,
                            status: pessoa.STATUS,
                            enderecos: [],
                        };
                    }),
                };

                return res.status(200).send(response.pessoas);
            } catch (error) {
                console.log(error);

                return res.status(404).send({
                    mensagem:
                        "Não foi possível cadastrar pessoa no banco de dados.",
                    status: 404,
                });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };

    public listarPessoa = async (req: Request, res: Response) => {
        dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                // function ehNumero(valor: any) {
                //     return /^[0-9]+$/.test(valor);
                // }

                if (req.query.codigoPessoa) {
                    let filtro = await connection.execute(
                        `SELECT p.codigo_pessoa,
                        p.nome,
                        p.sobrenome,
                        p.idade,
                        p.login,
                        p.senha,
                        p.status,
                        e.codigo_endereco,
                        e.codigo_bairro,
                        e.nome_rua,
                        e.numero,
                        e.complemento,
                        e.cep,
                        b.codigo_municipio,
                        b.nome AS nome_bairro,
                        b.status AS status_bairro,
                        m.codigo_uf,
                        m.nome AS nome_municipio,
                        m.status AS status_municipio,
                        uf.sigla,
                        uf.nome AS nome_uf,
                        uf.status AS status_uf
                 FROM tb_pessoa p
                 INNER JOIN tb_endereco e ON e.codigo_pessoa = p.codigo_pessoa
                 INNER JOIN tb_bairro b ON b.codigo_bairro = e.codigo_bairro
                 INNER JOIN tb_municipio m ON m.codigo_municipio = b.codigo_municipio
                 INNER JOIN tb_uf uf ON uf.codigo_uf = m.codigo_uf
                 WHERE p.codigo_pessoa= :codigoPessoa
                        
                         `,
                        [req.query.codigoPessoa]
                    );

                    if (filtro.rows.length > 0) {
                        const response = {
                            codigoPessoa: filtro.rows[0].CODIGO_PESSOA,
                            nome: filtro.rows[0].NOME,
                            sobrenome: filtro.rows[0].SOBRENOME,
                            idade: filtro.rows[0].IDADE,
                            login: filtro.rows[0].LOGIN,
                            senha: filtro.rows[0].SENHA,
                            status: filtro.rows[0].STATUS,
                            enderecos: filtro.rows.map((pessoa: Pessoa) => {
                                return {
                                    codigoEndereco: pessoa.CODIGO_ENDERECO,
                                    codigoPessoa: pessoa.CODIGO_PESSOA,
                                    codigoBairro: pessoa.CODIGO_BAIRRO,
                                    nomeRua: pessoa.NOME_RUA,
                                    numero: pessoa.NUMERO,
                                    complemento: pessoa.COMPLEMENTO,
                                    cep: pessoa.CEP,
                                    bairro: {
                                        codigoBairro: pessoa.CODIGO_BAIRRO,
                                        codigoMunicipio:
                                            pessoa.CODIGO_MUNICIPIO,
                                        nome: pessoa.NOME_BAIRRO,
                                        status: pessoa.STATUS_BAIRRO,
                                        municipio: {
                                            codigoMunicipio:
                                                pessoa.CODIGO_MUNICIPIO,
                                            codigoUF: pessoa.CODIGO_UF,
                                            nome: pessoa.NOME_MUNICIPIO,
                                            status: pessoa.STATUS_MUNICIPIO,
                                            uf: {
                                                codigoUF: pessoa.CODIGO_UF,
                                                sigla: pessoa.SIGLA,
                                                nome: pessoa.NOME_UF,
                                                status: pessoa.STATUS_UF,
                                            },
                                        },
                                    },
                                };
                            }),
                        };

                        return res.status(200).send(response);
                    } else {
                        return res.status(200).send([]);
                    }
                }
                if (req.query.login || req.query.status) {
                    let filtro = await connection.execute(
                        `SELECT * FROM tb_pessoa WHERE login= :login or status = :statud  `,
                        [
                            req.query.login,
                            req.query.status,
                        ]
                    );
                    const response = {
                        pessoas: filtro.rows.map((pessoa: Pessoa) => {
                            return {
                                codigoPessoa: pessoa.CODIGO_PESSOA,
                                nome: pessoa.NOME,
                                sobrenome: pessoa.SOBRENOME,
                                idade: pessoa.IDADE,
                                login: pessoa.LOGIN,
                                senha: pessoa.SENHA,
                                status: pessoa.STATUS,
                                enderecos: [],
                            };
                        }),
                    };
                    return res.status(200).send(response.pessoas);


                }

                const result = await connection.execute(
                    "SELECT * FROM tb_pessoa order by codigo_pessoa DESC"
                );
                const response = {
                    pessoas: result.rows.map((pessoa: Pessoa) => {
                        return {
                            codigoPessoa: pessoa.CODIGO_PESSOA,
                            nome: pessoa.NOME,
                            sobrenome: pessoa.SOBRENOME,
                            idade: pessoa.IDADE,
                            login: pessoa.LOGIN,
                            senha: pessoa.SENHA,
                            status: pessoa.STATUS,
                            enderecos: [],
                        };
                    }),
                };

                return res.status(200).send(response.pessoas);
            } catch (error) {
                console.log(error);
                return res.status(404).send({
                    mensagem:
                        "Não foi possível consultar pesssoa no banco de dados.",
                    status: 404,
                });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };
}
export default PessoaController;
