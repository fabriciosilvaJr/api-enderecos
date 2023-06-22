import { Request, Response } from "express";
import Bairro from "./../models/bairro";
import db from "./../database";

const dbConexao = new db();

class BairroController {
    public criacaoBairro = async (req: Request, res: Response) => {
        await dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                //validações
                if (req.body.codigoMunicipio == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir bairro no banco, pois o campo codigoMunicipio é obrigatório",
                        status: 404,
                        nomeDoCampo: "codigoMunicipio",
                    });
                }
                if (req.body.nome == null || req.body.nome == "") {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir bairro no banco, pois o campo nome é obrigatório",
                        status: 404,
                        nomeDoCampo: "nome",
                    });
                }
                if (req.body.status == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir bairro no banco, pois o campo status é obrigatório",
                        status: 404,
                        nomeDoCampo: "status",
                    });
                }

                const resultMunicipio = await connection.execute(
                    `select * from tb_municipio WHERE codigo_municipio = :codigoMunicipio`,
                    [req.body.codigoMunicipio]
                );

                if (resultMunicipio.rows.length == 0) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir bairro no banco, pois ainda não existe um municipio cadastrado com esse código",
                        status: 404,
                    });
                }

                const resultNome = await connection.execute(
                    `select * from tb_bairro WHERE NOME= :NOME`,
                    [req.body.nome]
                );

                if (resultNome.rows.length > 0) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir bairro no banco, pois já existe um bairro com esse mesmo nome cadastrado",
                        status: 404,
                    });
                }

                const query = `INSERT INTO tb_bairro (codigo_bairro,codigo_municipio, nome, status) Values (SEQUENCE_BAIRRO.nextval, :codigoMunicipio, :nome, :status)`;
                await connection.execute(
                    query,
                    [req.body.codigoMunicipio, req.body.nome, req.body.status],
                    { autoCommit: true }
                );

                const result = await connection.execute(
                    "SELECT * FROM tb_bairro order by codigo_bairro DESC"
                );
                const response = {
                    bairros: result.rows.map((bairro: Bairro) => {
                        return {
                            codigoBairro: bairro.CODIGO_BAIRRO,
                            codigoMunicipio: bairro.CODIGO_MUNICIPIO,
                            nome: bairro.NOME,
                            status: bairro.STATUS,
                        };
                    }),
                };

                return res.status(200).send(response.bairros);
            } catch (error) {
                console.log(error);
                return res.status(404).send({
                    mensagem:
                        "Não foi possível cadastrar bairro no banco de dados.",
                    status: 404,
                });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };
    
    public alterarBairro = async (req: Request, res: Response) => {
        await dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                //validações

                if (req.body.codigoBairro == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar bairro no banco, pois o campo codigoBairro é obrigatório",
                        status: 404,
                        nomeDoCampo: "codigoBairro",
                    });
                }
                if (req.body.codigoMunicipio == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar bairro no banco, pois o campo codigoMunicipio é obrigatório",
                        status: 404,
                        nomeDoCampo: "codigoMunicipio",
                    });
                }
                if ((req.body.nome == null) || (req.body.nome == "")) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar bairro no banco, pois o campo nome é obrigatório",
                        status: 404,
                        nomeDoCampo: "nome",
                    });
                }
             
                if (req.body.status == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar bairro no banco, pois o campo status é obrigatório",
                        status: 404,
                        nomeDoCampo: "status",
                    });
                }
                const resultMunicipio = await connection.execute(
                    `select * from tb_municipio WHERE codigo_municipio = :codigoMunicipio`,
                    [req.body.codigoMunicipio]
                );

                if (resultMunicipio.rows.length == 0) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar bairro no banco, pois ainda não existe um municipio cadastrado com esse código",
                        status: 404,
                    });
                }
               

                const query = `UPDATE tb_bairro set codigo_municipio = :codigoMunicipio, nome= :nome, status= :status WHERE codigo_bairro = :codigoBairro `;
                const result = await connection.execute(
                    query,
                    [
                        req.body.codigoMunicipio,
                        req.body.nome,
                        req.body.status,
                        req.body.codigoBairro,
                    ],
                    { autoCommit: true }
                );

                const results = await connection.execute(
                    "SELECT * FROM tb_bairro order by codigo_bairro DESC"
                );
                const response = {
                    bairros: results.rows.map((bairro: Bairro) => {
                        return {
                            codigoBairro: bairro.CODIGO_BAIRRO,
                            codigoMunicipio: bairro.CODIGO_MUNICIPIO,
                            nome: bairro.NOME,
                            status: bairro.STATUS,
                        };
                    }),
                };

                return res.status(200).send(response.bairros);
            } catch (error) {
                return res.status(404).send({
                    mensagem: "Não foi possível alterar bairro no banco de dados.",
                    status: 404,
                });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };


    public listarBairro = async (req: Request, res: Response) => {
        dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                function ehNumero(valor: any) {
                    return /^[0-9]+$/.test(valor);
                }

                //validação
                if (
                    req.query.codigoBairro &&
                    !ehNumero(req.query.codigoBairro)
                ) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível consultar Bairro no banco de dados, pois o valor do campo codigoBairro precisa ser um número",
                        status: 404,
                    });
                }

                if (
                    req.query.codigoMunicipio &&
                    !ehNumero(req.query.codigoMunicipio)
                ) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível consultar Bairro no banco de dados, pois o valor do campo codigoMunicipio precisa ser um número",
                        status: 404,
                    });
                }


                if (
                    req.query.codigoMunicipio ||
                    req.query.codigoBairro ||
                    req.query.nome ||
                    req.query.status
                ) {
                    let filtro = await connection.execute(
                        `SELECT * FROM tb_bairro WHERE codigo_bairro= :codigoBairro or codigo_municipio = :codigoMunicipio  or nome LIKE :nome collate binary_ci or status LIKE :status `,
                        [
                            req.query.codigoBairro,
                            req.query.codigoMunicipio,
                            "%"+req.query.nome+"%",
                            req.query.status,
                        ]
                    );
                    const response = {
                        bairros: filtro.rows.map((bairro: Bairro) => {
                            return {
                                codigoBairro: bairro.CODIGO_BAIRRO,
                                codigoMunicipio: bairro.CODIGO_MUNICIPIO,
                                nome: bairro.NOME,
                                status: bairro.STATUS,
                            };
                        }),
                    };

                    return res.status(200).send(response.bairros);
                }

                const result = await connection.execute(
                    "SELECT * FROM tb_bairro order by codigo_bairro DESC"
                );
                const response = {
                    bairros: result.rows.map((bairro: Bairro) => {
                        return {
                            codigoBairro: bairro.CODIGO_BAIRRO,
                            codigoMunicipio: bairro.CODIGO_MUNICIPIO,
                            nome: bairro.NOME,
                            status: bairro.STATUS,
                        };
                    }),
                };

                return res.status(200).send(response.bairros);
            } catch (error) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível consultar bairro no banco de dados.",
                    status: 404,
                });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };
}

export default BairroController;
