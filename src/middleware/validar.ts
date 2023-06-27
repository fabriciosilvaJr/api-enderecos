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
                    var validaEndereco = false;
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
                    if (req.body.senha == null || req.body.senha == "") {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível incluir pessoa no banco, pois o campo senha é obrigatório",
                            status: 404,
                            nomeDoCampo: "senha",
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
                     
                        enderecos.map((endereco: any) => {
                            if (endereco.codigoBairro == null) {
                                 return res.status(404).send({
                                    mensagem:
                                        "Não foi possível incluir endereço no banco, pois o campo codigoBairro é obrigatório",
                                    status: 404,
                                    nomeDoCampo: "codigoBairro",
                                });
                                
                            }
                            if (
                                endereco.nomeRua == null ||
                                endereco.nomeRua == ""
                            ) {
                                return res.status(404).send({
                                    mensagem:
                                        "Não foi possível incluir endereço no banco, pois o campo nomeRua é obrigatório",
                                    status: 404,
                                    nomeDoCampo: "nomeRua",
                                });
                            }
                            if (
                                endereco.numero == null ||
                                endereco.numero == ""
                            ) {
                                return res.status(404).send({
                                    mensagem:
                                        "Não foi possível incluir endereço no banco, pois o campo número é obrigatório",
                                    status: 404,
                                    nomeDoCampo: "numero",
                                });
                            }
                            if (
                                endereco.complemento == null ||
                                endereco.complemento == ""
                            ) {
                                return res.status(404).send({
                                    mensagem:
                                        "Não foi possível incluir endereço no banco, pois o campo complemento é obrigatório",
                                    status: 404,
                                    nomeDoCampo: "complemento",
                                });
                            }

                            if (endereco.cep == null || endereco.cep == "") {
                                return res.status(404).send({
                                    mensagem:
                                        "Não foi possível incluir endereço no banco, pois o campo cep é obrigatório",
                                    status: 404,
                                    nomeDoCampo: "cep",
                                });
                               
                            }else{
                                return next();
                               
        
                           }
                           
                        });
                    } 
                }
                if (req.method == "GET") {
                    function ehNumero(valor: any) {
                        return /^[0-9]+$/.test(valor);
                    }
                    if (
                        req.query.codigoPessoa &&
                        !ehNumero(req.query.codigoPessoa)
                    ) {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível consultar Pessoa no banco de dados, pois o valor do campo codigoPessoa precisa ser um número",
                            status: 404,
                        });
                    }
                    if (req.query.login == "") {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível enontrar o login informado, pois o campo não foi preenchido.",
                            status: 404,
                        });
                    }
                    if (req.query.status && !ehNumero(req.query.status)) {
                        return res.status(404).send({
                            mensagem:
                                "Não foi possível consultar Pessoa no banco de dados, pois o valor do campo status precisa ser um número inteiro 1 - aitvado ou 2 - desativado",
                            status: 404,
                        });
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
