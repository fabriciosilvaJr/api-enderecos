import { Request, Response } from "express";
import Conexao from "../Conexao";
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
    public deletarMunicipio = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            const { codigoMunicipio } = req.params;

            let verificaMunicipio = await conexao.execute(
                "select * from tb_municipio where codigo_municipio = :codigoMunicipio",
                [codigoMunicipio]
            );
            if (verificaMunicipio.rows.length > 0) {
                const query = `UPDATE tb_municipio set status = 2 WHERE codigo_municipio = :codigoMunicipio`;
                const result = await conexao.execute(query, [codigoMunicipio]);
                console.log(
                    "FORAM DELETADOS" +
                        result.rowsAffected +
                        " NO BANCO DE DADOS"
                );

                await Conexao.commit();
                await this.listarMunicipio(req, res);
            } else {
                return res.status(404).send({
                    status: 404,
                    mensagem:
                        "Não foi possível encontrar um municipio com o código informado.",
                });
            }
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                status: 404,
                mensagem: "Não foi possível desativar o municipio no banco de dados.",
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };


    public listarMunicipio = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            let municipio= req.query;
            function ehNumero(valor: any) {
                return /^[0-9]+$/.test(valor);
            }

            //validação
            if (
                municipio.codigoMunicipio &&
                !ehNumero(municipio.codigoMunicipio)
            ) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível consultar Município no banco de dados, pois o valor do campo codigoMunicipio precisa ser um número",
                    status: 404,
                });
            }

            let recursos : any[] = this.gerarSQLConsultarListar(municipio);
            let sql = recursos[0]; //sql
            console.log(sql)
            let parametros : any[] = recursos[1]; //parametros

            const result = await conexao.execute(
                sql, parametros
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
    private gerarSQLConsultarListar(municipio : any) : any []
    {
        let parametros : any[] = [];
        let sql = 'SELECT  CODIGO_MUNICIPIO, CODIGO_UF, NOME, STATUS FROM TB_MUNICIPIO WHERE 1 = 1 ';
     
        if(municipio.codigoMunicipio != null || municipio.codigoMunicipio != undefined)
        {
            sql += ' AND CODIGO_MUNICIPIO = :codigoMunicipio  ';
            parametros = [...parametros, municipio.codigoMunicipio];
        }
        if(municipio.codigoUF != null || municipio.codigoUF != undefined)
        {
            sql += ' AND CODIGO_UF = :codigoUF ';
            parametros = [...parametros, municipio.codigoUF]; 
        }
        if(municipio.nome != null || municipio.nome != undefined )
        {
            sql += ' AND NOME = :nome collate binary_ci ';
            parametros = [...parametros, municipio.nome];
        }
        if(municipio.status != null || undefined)
        {
            sql += ' AND STATUS = :status ';
            parametros = [...parametros, municipio.status];
        }
        sql += " ORDER BY CODIGO_MUNICIPIO DESC ";
        return [sql, parametros];   
    }
}

export default MunicipioController;
