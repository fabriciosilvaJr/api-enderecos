import { NextFunction, Request, Response } from "express";
import db from "./../database";
const dbConexao = new db();

class Validacoes {
    public validarPessoa = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        await dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                if (req.method == "POST") {
                    if (req.body.nome == null || req.body.nome == "") {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível incluir pessoa no banco, pois o campo nome é obrigatório",
                            status: 404,
                            nomeDoCampo: "nome",
                        });
                    }
                    if (
                        req.body.sobrenome == null ||
                        req.body.sobrenome == ""
                    ) {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível incluir pessoa no banco, pois o campo sobrenome é obrigatório",
                            status: 404,
                            nomeDoCampo: "sobrenome",
                        });
                    }
                    if (req.body.idade == null) {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível incluir pessoa no banco, pois o campo idade é obrigatório",
                            status: 404,
                            nomeDoCampo: "idade",
                        });
                    }
                    if (req.body.login == null || req.body.login == "") {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível incluir pessoa no banco, pois o campo login é obrigatório",
                            status: 404,
                            nomeDoCampo: "login",
                        });
                    }

                    const resultLogin = await connection.execute(
                        `select * from tb_pessoa WHERE login = :login`,
                        [req.body.login]
                    );

                    if (resultLogin.rows.length > 0) {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível incluir pessoa no banco, pois esse login já está sendo usado",
                            status: 404,
                        });
                    }
                    if (req.body.status == null) {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível incluir pesssoa no banco, pois o campo status é obrigatório",
                            status: 404,
                            nomeDoCampo: "status",
                        });
                    }

                    const { enderecos } = req.body;

                    if (
                        typeof enderecos == "undefined" ||
                        enderecos.length == 0
                    ) {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível incluir pesssoa no banco, pois é necessario cadastrar pelo menos um endereço",
                            status: 404,
                            nomeDoCampo: "enderecos",
                        });
                    }
                    if (enderecos) {
                        const contador = enderecos.length;
                        console.log(contador);
                        for (let i = 0; i < contador; i++) {
                            if (enderecos[i].codigoBairro == null) {
                                return res.status(404).send({
                                    mensagem:
                                        "Não foi possível incluir endereço no banco, pois o campo codigoBairro é obrigatório",
                                    status: 404,
                                    nomeDoCampo: "codigoBairro",
                                });
                            }
                            if (
                                enderecos[i].nomeRua == null ||
                                enderecos[i].nomeRua == ""
                            ) {
                                return res.status(404).send({
                                    mensagem:
                                        "Não foi possível incluir endereço no banco, pois o campo nomeRua é obrigatório",
                                    status: 404,
                                    nomeDoCampo: "nomeRua",
                                });
                            }
                            if (
                                enderecos[i].numero == null ||
                                enderecos[i].numero == ""
                            ) {
                                return res.status(404).send({
                                    mensagem:
                                        "Não foi possível incluir endereço no banco, pois o campo número é obrigatório",
                                    status: 404,
                                    nomeDoCampo: "numero",
                                });
                            } else {
                                next();
                            }
                        }
                    } else {
                        next();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });
    };
}

export default Validacoes;
