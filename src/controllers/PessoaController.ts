import { connect } from "http2";
import { Bairro } from "./../models/bairro";
import { Request, Response } from "express";
import Pessoa from "./../models/pessoa";
import Conexao from "../Conexao";

class PessoaController {
    public criacaoPessoa = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            const { nome, sobrenome, idade, login, senha, status, enderecos } =
                req.body;

            const queryPessoa = `INSERT INTO tb_pessoa (codigo_pessoa,nome,sobrenome, idade, login, senha, status)
                 Values (SEQUENCE_PESSOA.nextval, :nome, :sobrenome, :idade, :login, :senha, :status) `;

            const result = await conexao.execute(queryPessoa, [
                nome,
                sobrenome,
                idade,
                login,
                senha,
                status,
            ]);

            if (result) {
                const codigoPessoa = await conexao.execute(
                    "select max(codigo_pessoa) as max from tb_pessoa"
                );
                //console.log(codigoPessoa.rows[0].MAX)
                const contador = enderecos.length;

                const queryEndereco = `INSERT INTO tb_endereco (codigo_endereco, codigo_pessoa, codigo_bairro, nome_rua, numero, complemento, cep) 
                        Values (SEQUENCE_ENDERECO.nextval, :codigoPessoa , :codigoBairro, :nomeRua, :numero, :complemento, :cep)
                    `;
                for (let i = 0; i < contador; i++) {
                    var resultEndereco = await conexao.execute(queryEndereco, [
                        codigoPessoa.rows[0].MAX,
                        enderecos[i].codigoBairro,
                        enderecos[i].nomeRua,
                        enderecos[i].numero,
                        enderecos[i].complemento,
                        enderecos[i].cep,
                    ]);
                }
            }
            //console.log('FORAM INSERIDOS Pessoa :' + result.rowsAffected + ' Endereço: ' +resultEndereco.rowsAffected);

            await Conexao.commit();
            await this.listarPessoa(req, res);
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                mensagem:
                    "Não foi possível cadastrar pessoa no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };

    public alterarPessoa = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            const {
                codigoPessoa,
                nome,
                sobrenome,
                idade,
                login,
                senha,
                status,
                enderecos,
            } = req.body;

            const query = `UPDATE tb_pessoa set nome = :nome, sobrenome= :sobrenome, idade = :idade, login = :login, senha= :senha, status= :status WHERE codigo_pessoa = :codigoPessoa `;
            const result = await conexao.execute(query, [
                nome,
                sobrenome,
                idade,
                login,
                senha,
                status,
                codigoPessoa,
            ]);
            const contador = enderecos.length;

            let EnderecoByPessoaID = await conexao.execute(
                `SELECT * FROM tb_endereco  where codigo_pessoa= :codigoPessoa`,
                [codigoPessoa]
            );

            const pessoaByid = {
                enderecos: EnderecoByPessoaID.rows.map((pessoa: Pessoa) => {
                    return {
                        codigoEndereco: pessoa.CODIGO_ENDERECO,
                        codigoPessoa: pessoa.CODIGO_PESSOA,
                        codigoBairro: pessoa.CODIGO_BAIRRO,
                        nomeRua: pessoa.NOME_RUA,
                        numero: pessoa.NUMERO,
                        complemento: pessoa.COMPLEMENTO,
                        cep: pessoa.CEP,
                    };
                }),
            };

            //console.log(verificaEnderecoByID.rows)

            const a = pessoaByid.enderecos;
            const b = enderecos;
            //const ehIgual = JSON.stringify(a) === JSON.stringify(b);

            function getDiferenca(array1: any, array2: any) {
                return array1.filter((object1: any) => {
                    return !array2.some((object2: any) => {
                        return (
                            object1.codigoEndereco === object2.codigoEndereco
                        );
                    });
                });
            }

            const diferenca = getDiferenca(a, b);
            // Deletando endereço que não foi passado na atualização
            if (diferenca.length > 0) {
                diferenca.map((u: any) => {
                    console.log(u.codigoEndereco);
                    conexao.execute(
                        ` delete from tb_endereco WHERE codigo_endereco = :codigoEndereco`,
                        [u.codigoEndereco]
                    );
                });
            }

            const adicionar = enderecos.filter((endereco: any) => {
                return endereco.codigoEndereco == null;
            });
            // Adicionando endereço que não foi passado o codigoEndereco na atualização
            if (adicionar.length > 0) {
                adicionar.map((u: any) => {
                    conexao.execute(
                        ` INSERT INTO tb_endereco (codigo_endereco, codigo_pessoa, codigo_bairro, nome_rua, numero, complemento, cep) 
                                Values (SEQUENCE_ENDERECO.nextval, :codigoPessoa , :codigoBairro, :nomeRua, :numero, :complemento, :cep)`,
                        [
                            u.codigoPessoa,
                            u.codigoBairro,
                            u.nomeRua,
                            u.numero,
                            u.complemento,
                            u.cep,
                        ]
                    );
                });
            }

            const queryEndereco = `UPDATE tb_endereco set codigo_pessoa = :codigoPessoa, codigo_bairro= :codigoBairro, nome_rua = :nomeRua, numero = :numero, complemento= :complemento, cep = :cep WHERE codigo_endereco = :codigoEndereco`;

            for (let i = 0; i < contador; i++) {
                await conexao.execute(queryEndereco, [
                    codigoPessoa,
                    enderecos[i].codigoBairro,
                    enderecos[i].nomeRua,
                    enderecos[i].numero,
                    enderecos[i].complemento,
                    enderecos[i].cep,
                    enderecos[i].codigoEndereco,
                ]);
            }
            await Conexao.commit();
            await this.listarPessoa(req, res);
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                mensagem: "Não foi possível alterar pessoa no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };

    public deletarPessoa = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            const { codigoPessoa } = req.params;

            let verificaPessoa = await conexao.execute(
                "select * from tb_pessoa where codigo_pessoa = :codigoPessoa",
                [codigoPessoa]
            );
            console.log(verificaPessoa.rows.length);
            if (verificaPessoa.rows.length > 0) {
                let queryEndereco =
                    "DELETE FROM TB_ENDERECO WHERE CODIGO_PESSOA = :codigoPessoa";
                let resultEndereco = await conexao.execute(queryEndereco, [
                    codigoPessoa,
                ]);
                console.log(
                    "FORAM DELETADOS" +
                        resultEndereco.rowsAffected +
                        " ENDEREÇOS NO BANCO DE DADOS"
                );
                if (resultEndereco.rowsAffected >= 1) {
                    let queryPessoa =
                        "DELETE FROM tb_pessoa WHERE CODIGO_PESSOA = :codigoPessoa";
                    await conexao.execute(queryPessoa, [codigoPessoa]);
                }

                await Conexao.commit();
                await this.listarPessoa(req, res);
            } else {
                return res.status(404).send({
                    status: 404,
                    mensagem:
                        "Não foi possível encontrar uma pessoa com o código informado.",
                });
            }
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                status: 404,
                mensagem:
                    "Não foi possível excluir uma Pessoa no banco de dados.",
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };

    public listarPessoa = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            // function ehNumero(valor: any) {
            //     return /^[0-9]+$/.test(valor);
            // }

            if (req.query.codigoPessoa) {
                let filtro = await conexao.execute(
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
                                    codigoMunicipio: pessoa.CODIGO_MUNICIPIO,
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
                let filtro = await conexao.execute(
                    `SELECT * FROM tb_pessoa WHERE login= :login or status = :statud  `,
                    [req.query.login, req.query.status]
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

            const result = await conexao.execute(
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
            await Conexao.fecharConexao();
        }
    };
}
export default PessoaController;
