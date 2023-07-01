import { Request, Response } from "express";
import Conexao from "../Conexao";
import Bairro from "./../models/bairro";

class BairroController {
    public criacaoBairro = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
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

            const resultMunicipio = await conexao.execute(
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

            const resultNome = await conexao.execute(
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
            await conexao.execute(query, [
                req.body.codigoMunicipio,
                req.body.nome,
                req.body.status,
            ]);

            await Conexao.commit();
            await this.listarBairro(req, res);
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                mensagem:
                    "Não foi possível cadastrar bairro no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };

    public alterarBairro = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
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
            if (req.body.nome == null || req.body.nome == "") {
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
            const resultMunicipio = await conexao.execute(
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
            const result = await conexao.execute(query, [
                req.body.codigoMunicipio,
                req.body.nome,
                req.body.status,
                req.body.codigoBairro,
            ]);

            await Conexao.commit();
            await this.listarBairro(req, res);
        } catch (error) {
            return res.status(404).send({
                mensagem: "Não foi possível alterar bairro no banco de dados.",
                status: 404,
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };

    public deletarBairro = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            const { codigoBairro } = req.params;

            let verificaBairro = await conexao.execute(
                "select * from tb_bairro where codigo_bairro = :codigoBairro",
                [codigoBairro]
            );
            if (verificaBairro.rows.length > 0) {
                const query = `UPDATE tb_bairro set status = 2 WHERE codigo_bairro = :codigoBairro`;
                const result = await conexao.execute(query, [codigoBairro]);
                console.log(
                    "FORAM DELETADOS" +
                        result.rowsAffected +
                        " NO BANCO DE DADOS"
                );

                await Conexao.commit();
                await this.listarBairro(req, res);
            } else {
                return res.status(404).send({
                    status: 404,
                    mensagem:
                        "Não foi possível encontrar um bairro com o código informado.",
                });
            }
        } catch (error) {
            console.log(error);
            await Conexao.rollback();
            return res.status(404).send({
                status: 404,
                mensagem: "Não foi possível desativar o bairro no banco de dados.",
            });
        } finally {
            await Conexao.fecharConexao();
        }
    };


    public listarBairro = async (req: Request, res: Response) => {
        try {
            let conexao = await Conexao.abrirConexao();
            const bairro = req.query;
            function ehNumero(valor: any) {
                return /^[0-9]+$/.test(valor);
            }

            //validação
            if (bairro.codigoBairro && !ehNumero(bairro.codigoBairro)) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível consultar Bairro no banco de dados, pois o valor do campo codigoBairro precisa ser um número",
                    status: 404,
                });
            }

            if (
                bairro.codigoMunicipio &&
                !ehNumero(bairro.codigoMunicipio)
            ) {
                return res.status(404).send({
                    mensagem:
                        "Não foi possível consultar Bairro no banco de dados, pois o valor do campo codigoMunicipio precisa ser um número",
                    status: 404,
                });
            }

           
        
            
            let recursos : any[] = this.gerarSQLConsultarListar(bairro);
            let sql = recursos[0]; //sql
            let parametros : any[] = recursos[1]; //parametros

            const result = await conexao.execute(
                sql, parametros
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
            await Conexao.fecharConexao();
        }
    };

    private gerarSQLConsultarListar(bairro : any) : any []
    {
        let parametros : any[] = [];
        let sql = 'SELECT CODIGO_BAIRRO, CODIGO_MUNICIPIO, NOME, STATUS FROM TB_BAIRRO WHERE 1 = 1 ';
        if(bairro.codigoBairro != null || bairro.codigoUF != undefined)
        {
            sql += ' AND CODIGO_BAIRRO = :codigoBairro ';
            parametros = [...parametros, bairro.codigoBairro]; 
        }
        if(bairro.codigoMunicipio != null || bairro.codigoMunicipio != undefined)
        {
            sql += ' AND CODIGO_MUNICIPIO = :codigoMunicipio  ';
            parametros = [...parametros, bairro.codigoMunicipio];
        }
        if(bairro.nome != null || bairro.nome != undefined )
        {
            sql += ' AND NOME = :nome collate binary_ci ';
            parametros = [...parametros, bairro.nome];
        }
        if(bairro.status != null || undefined)
        {
            sql += ' AND STATUS = :status ';
            parametros = [...parametros, bairro.status];
        }
        sql += " ORDER BY CODIGO_BAIRRO DESC ";
        return [sql, parametros];   
    }
}

export default BairroController;
