import { Request, Response } from "express";
import Uf from "./../models/uf";
import Conexao from "../conexao";

class UfController {
    public criacaoUF = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();

            const resultSigla = await conexao.execute(
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

            const resultNome = await conexao.execute(
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

            if (req.body.sigla == null || req.body.sigla == "") {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível incluir uf no banco, pois o campo sigla é obrigatório",
                    status: 404,
                    nomeDoCampo: "sigla",
                });
            }
            if (req.body.nome == null || req.body.nome == "") {
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
            const result = await conexao.execute(query, [
                req.body.sigla,
                req.body.nome,
                req.body.status,
            ]);

            await Conexao.commit();
            await this.listarUF(req, res);
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                mensagem: "Não foi possível incluir UF no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };
    public alterarUF = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            const resultSigla = await conexao.execute(
                `select * from tb_uf WHERE SIGLA = :SIGLA`,
                [req.body.sigla]
            );

            if (
                resultSigla.rows.length > 0 &&
                resultSigla.rows[0].CODIGO_UF != req.body.codigoUF
            ) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível alterar uf no banco, pois já existe uma uf com essa mesma sigla",
                    status: 404,
                });
            }

            const resultNome = await conexao.execute(
                `select * from tb_uf WHERE NOME= :NOME`,
                [req.body.nome]
            );

            if (
                resultNome.rows.length > 0 &&
                resultNome.rows[0].CODIGO_UF != req.body.codigoUF
            ) {
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

            if (req.body.sigla == null || req.body.sigla == "") {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível alterar uf no banco, pois o campo sigla é obrigatório",
                    status: 404,
                    nomeDoCampo: "sigla",
                });
            }
            if (req.body.nome == null || req.body.nome == "") {
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
            await conexao.execute(query, [
                req.body.sigla,
                req.body.nome,
                req.body.status,
                req.body.codigoUF,
            ]);

            await Conexao.commit();
            await this.listarUF(req, res);
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                mensagem: "Não foi possível alterar UF no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };
    public deletarUF = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            const { codigoUF } = req.params;

            let verificaUF = await conexao.execute(
                "select * from tb_uf where codigo_uf = :codigoUF",
                [codigoUF]
            );
            if (verificaUF.rows.length > 0) {
                const query = `UPDATE tb_uf set status = 2 WHERE codigo_uf = :codigoUF`;
                const result = await conexao.execute(query, [codigoUF]);
                console.log(
                    "FORAM DELETADOS" +
                        result.rowsAffected +
                        " NO BANCO DE DADOS"
                );

                await Conexao.commit();
                await this.listarUF(req, res);
            } else {
                return res.status(404).send({
                    status: 404,
                    mensagem:
                        "Não foi possível encontrar uma uf com o código informado.",
                });
            }
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                status: 404,
                mensagem: "Não foi possível desativar a UF no banco de dados.",
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };

    public listarUF = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            if (req.query.codigoUF) {
                let filtro = await conexao.execute(
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
                let filtro = await conexao.execute(
                    `SELECT * FROM tb_uf WHERE codigo_uf= :codigoUF or  sigla LIKE :sigla collate binary_ci  or nome LIKE :nome collate binary_ci or status LIKE :status   `,
                    [
                        req.query.codigoUF,
                        req.query.sigla,
                        "%" + req.query.nome + "%",
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

            const result = await conexao.execute(
                "SELECT * FROM tb_uf order by codigo_uf DESC"
            );
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
            console.log(error);
            return res.status(404).send({
                mensagem: "Não foi possível consultar UF no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };
}

export default UfController;
