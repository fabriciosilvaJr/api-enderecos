import { Request, Response } from "express";
import Uf from "./../models/uf";
import db from "./../database";
import { Result } from "oracledb";

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
    public listarUF = async (req: Request, res: Response) => {
        dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                const result = await connection.execute("SELECT * FROM tb_uf");
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
