import { Request, Response } from "express";
import Uf from "./../models/uf";
import db from "./../database";

const dbConexao = new db();

class UfController {
    public criacaoUF = async (req: Request, res: Response) => {
        await dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                //validações

                const resultSigla = await connection.execute(
                    `select * from tb_uf WHERE SIGLA= :SILGA`,
                    [req.body.sigla]
                );
                if (resultSigla.rows.length > 0) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir uf no banco, pois já existe uma uf com essa mesma sigla",
                        status: 404,
                    });
                }

                const resultNome = await connection.execute(
                    `select * from tb_uf WHERE NOME= :NOME`,
                    [req.body.nome]
                );

                if (resultNome.rows.length > 0) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir uf no banco, pois já existe uma uf com esse mesmo nome",
                        status: 404,
                    });
                }

                if (req.body.sigla == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir uf no banco, pois o campo sigla é obrigatório",
                        status: 404,
                        nomeDoCampo: "sigla",
                    });
                }
                if (req.body.nome == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir uf no banco, pois o campo nome é obrigatório",
                        status: 404,
                        nomeDoCampo: "nome",
                    });
                }
                if (req.body.status == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível incluir uf no banco, pois o campo status é obrigatório",
                        status: 404,
                        nomeDoCampo: "status",
                    });
                }
                if (req.body.sigla.length > 2) {
                    return res.status(404).send({
                        mensagem:
                            "Tamanho da sigla não pode ser maior do que 2 caracteres",
                        status: 404,
                        nomeDoCampo: "sigla",
                    });
                }

                const query = `INSERT INTO tb_uf (codigo_uf, sigla, nome, status) Values (SEQUENCE_UF.nextval, :sigla, :nome, :status)`;
                const result = await connection.execute(
                    query,
                    [req.body.sigla, req.body.nome, req.body.status],
                    { autoCommit: true }
                );

                const result2 = await connection.execute(
                    "SELECT * FROM tb_uf order by codigo_uf DESC"
                );
                const response = {
                    ufs: result2.rows.map((uf: Uf) => {
                        return {
                            codigoUF: uf.CODIGO_UF,
                            sigla: uf.SIGLA,
                            nome: uf.NOME,
                            status: uf.STATUS,
                        };
                    }),
                };

                return res.status(200).send(response.ufs);
            } catch (error) {
                return res.status(500).send({ error: error });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };
    public alterarUF = async (req: Request, res: Response) => {
        await dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                //validações

                const resultSigla = await connection.execute(
                    `select * from tb_uf WHERE SIGLA = :SIGLA`,
                    [req.body.sigla]
                );
                
                if ((resultSigla.rows.length > 0) && (resultSigla.rows[0].CODIGO_UF != req.body.codigoUF)) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar uf no banco, pois já existe uma uf com essa mesma sigla",
                        status: 404,
                    });
                }

                const resultNome = await connection.execute(
                    `select * from tb_uf WHERE NOME= :NOME`,
                    [req.body.nome]
                );

                if ((resultNome.rows.length > 0) && (resultNome.rows[0].CODIGO_UF != req.body.codigoUF)) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar uf no banco, pois já existe uma uf com esse mesmo nome",
                        status: 404,
                    });
                }
                if (req.body.codigoUF == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar uf no banco, pois o campo codigoUF é obrigatório",
                        status: 404,
                        nomeDoCampo: "codigoUF",
                    });
                }

                if (req.body.sigla == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar uf no banco, pois o campo sigla é obrigatório",
                        status: 404,
                        nomeDoCampo: "sigla",
                    });
                }
                if (req.body.nome == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar uf no banco, pois o campo nome é obrigatório",
                        status: 404,
                        nomeDoCampo: "nome",
                    });
                }
                if (req.body.status == null) {
                    return res.status(404).send({
                        mensagem:
                            "Não foi possível alterar uf no banco, pois o campo status é obrigatório",
                        status: 404,
                        nomeDoCampo: "status",
                    });
                }
                if (req.body.sigla.length > 2) {
                    return res.status(404).send({
                        mensagem:
                            "Tamanho da sigla não pode ser maior do que 2 caracteres",
                        status: 404,
                        nomeDoCampo: "sigla",
                    });
                }
      

                const query = `UPDATE tb_uf set sigla = :sigla, nome= :nome, status= :status WHERE codigo_uf = :codigoUf `;
                const result = await connection.execute(
                    query,
                    [req.body.sigla, req.body.nome, req.body.status,req.body.codigoUF],
                    { autoCommit: true }
                );

                const result2 = await connection.execute(
                    "SELECT * FROM tb_uf order by codigo_uf DESC"
                );
                const response = {
                    ufs: result2.rows.map((uf: Uf) => {
                        return {
                            codigoUF: uf.CODIGO_UF,
                            sigla: uf.SIGLA,
                            nome: uf.NOME,
                            status: uf.STATUS,
                        };
                    }),
                };

                return res.status(200).send(response.ufs);
            } catch (error) {
                return res.status(500).send({ error: error });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };



    public listarUF = async (req: Request, res: Response) => {
        dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                if (req.query.codigoUF) {
                    let filtro = await connection.execute(
                        `SELECT * FROM tb_uf WHERE codigo_uf= :codigoUF `,
                        [req.query.codigoUF]
                    );
                    const response = {
                        ufs: filtro.rows.map((uf: Uf) => {
                            return {
                                codigoUF: uf.CODIGO_UF,
                                sigla: uf.SIGLA,
                                nome: uf.NOME,
                                status: uf.STATUS,
                            };
                        }),
                    };

                    return res.status(200).send(response.ufs);
                }
                if (
                    req.query.codigoUF ||
                    req.query.sigla ||
                    req.query.nome ||
                    req.query.status
                ) {
                    let filtro = await connection.execute(
                        `SELECT * FROM tb_uf WHERE codigo_uf= :codigoUF or  sigla LIKE :sigla  or nome LIKE :nome or status LIKE :status `,
                        [
                            req.query.codigoUF,
                            req.query.sigla,
                            req.query.nome,
                            req.query.status,
                        ]
                    );
                    const response = {
                        ufs: filtro.rows.map((uf: Uf) => {
                            return {
                                codigoUF: uf.CODIGO_UF,
                                sigla: uf.SIGLA,
                                nome: uf.NOME,
                                status: uf.STATUS,
                            };
                        }),
                    };

                    return res.status(200).send(response.ufs);
                }

                const result = await connection.execute("SELECT * FROM tb_uf order by codigo_uf DESC");
                const response = {
                    ufs: result.rows.map((uf: Uf) => {
                        return {
                            codigoUF: uf.CODIGO_UF,
                            sigla: uf.SIGLA,
                            nome: uf.NOME,
                            status: uf.STATUS,
                        };
                    }),
                };

                return res.status(200).send(response.ufs);
            } catch (error) {
                return res.status(500).send({ error: error });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };
}

export default UfController;
