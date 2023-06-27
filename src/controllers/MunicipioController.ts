import { Request, Response } from "express";
import Conexao from "../conexao";
import Municipio from "./../models/municipio";

class MunicipioController {
    public criacaoMunicipio = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            //validações
            if (req.body.codigoUF == null) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível incluir municipio no banco, pois o campo codigoUF é obrigatório",
                    status: 404,
                    nomeDoCampo: "codigoUF",
                });
            }
            if (req.body.nome == null || req.body.nome == "") {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível incluir municipio no banco, pois o campo nome é obrigatório",
                    status: 404,
                    nomeDoCampo: "nome",
                });
            }
            if (req.body.status == null) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível incluir municipio no banco, pois o campo status é obrigatório",
                    status: 404,
                    nomeDoCampo: "status",
                });
            }

            const resultUF = await conexao.execute(
                `select * from tb_uf WHERE codigo_uf = :codigoUF`,
                [req.body.codigoUF]
            );

            if (resultUF.rows.length == 0) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível incluir Municipio no banco, pois ainda não existe uma uf cadastrada para esse código",
                    status: 404,
                });
            }

            const resultNome = await conexao.execute(
                `select * from tb_municipio WHERE NOME= :NOME`,
                [req.body.nome]
            );

            if (resultNome.rows.length > 0) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível incluir Municipio no banco, pois já existe um Municipio com esse mesmo nome cadastrado",
                    status: 404,
                });
            }

            const query = `INSERT INTO tb_municipio (codigo_municipio, codigo_uf,  nome, status) Values (SEQUENCE_MUNICIPIO.nextval, :codigoUF, :nome, :status)`;
            const result = await conexao.execute(query, [
                req.body.codigoUF,
                req.body.nome,
                req.body.status,
            ]);

            await Conexao.commit();
            await this.listarMunicipio(req, res);
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                mensagem:
                    "Não foi possível cadastrar município no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };

    public alterarMunicipio = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            //validações
            if (req.body.codigoMunicipio == null) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível alterar municipio no banco, pois o campo codigoMunicipio é obrigatório",
                    status: 404,
                    nomeDoCampo: "codigoMunicipio",
                });
            }
            if (req.body.nome == null || req.body.nome == "") {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível alterar municipio no banco, pois o campo nome é obrigatório",
                    status: 404,
                    nomeDoCampo: "nome",
                });
            }
            if (req.body.codigoUF == null) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível alterar municipio no banco, pois o campo codigoUF é obrigatório",
                    status: 404,
                    nomeDoCampo: "codigoUF",
                });
            }
            if (req.body.status == null) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível alterar municipio no banco, pois o campo status é obrigatório",
                    status: 404,
                    nomeDoCampo: "status",
                });
            }

            const query = `UPDATE tb_municipio set codigo_uf = :codigoUF, nome= :nome, status= :status WHERE codigo_municipio = :codigoMunicipio `;
            await conexao.execute(query, [
                req.body.codigoUF,
                req.body.nome,
                req.body.status,
                req.body.codigoMunicipio,
            ]);
            await Conexao.commit();
            await this.listarMunicipio(req, res);
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                mensagem:
                    "Não foi possível alterar municipio no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };

    public listarMunicipio = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            function ehNumero(valor: any) {
                return /^[0-9]+$/.test(valor);
            }

            //validação
            if (
                req.query.codigoMunicipio &&
                !ehNumero(req.query.codigoMunicipio)
            ) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível consultar Município no banco de dados, pois o valor do campo codigoMunicipio precisa ser um número",
                    status: 404,
                });
            }

            if (
                req.query.codigoMunicipio ||
                req.query.codigoUF ||
                req.query.nome ||
                req.query.status
            ) {
                let filtro = await conexao.execute(
                    `SELECT * FROM tb_municipio WHERE codigo_municipio= :codigoMunicipio or codigo_uf = :codigoUF  or nome LIKE :nome collate binary_ci or status LIKE :status `,
                    [
                        req.query.codigoMunicipio,
                        req.query.codigoUF,
                        "%" + req.query.nome + "%",
                        req.query.status,
                    ]
                );
                const response = {
                    municipios: filtro.rows.map((municipio: Municipio) => {
                        return {
                            codigoMunicipio: municipio.CODIGO_MUNICIPIO,
                            codigoUF: municipio.CODIGO_UF,
                            nome: municipio.NOME,
                            status: municipio.STATUS,
                        };
                    }),
                };

                return res.status(200).send(response.municipios);
            }

            const result = await conexao.execute(
                "SELECT * FROM tb_municipio order by codigo_municipio DESC"
            );
            const response = {
                municipios: result.rows.map((municipio: Municipio) => {
                    return {
                        codigoMunicipio: municipio.CODIGO_MUNICIPIO,
                        codigoUF: municipio.CODIGO_UF,
                        nome: municipio.NOME,
                        status: municipio.STATUS,
                    };
                }),
            };

            return res.status(200).send(response.municipios);
        } catch (error) {
            return res.status(404).send({
                mensagem:
                    "Não foi possível consultar Município no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };
}

export default MunicipioController;
