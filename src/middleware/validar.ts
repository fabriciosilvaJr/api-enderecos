import { NextFunction, Request, Response } from "express";
import Conexao from "../conexao";

class Validacoes {
    public validarPessoa = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
     
            try {
                let conexao = await Conexao.abrirConexao();
                var erros:any = [];
                if (req.method == "POST") {
                    if (req.body.nome == null || req.body.nome == "") {
                        erros.push(" campo nome é obrigatório");
                    }
                    if (
                        req.body.sobrenome == null ||
                        req.body.sobrenome == ""
                    ) {
                        erros.push("campo sobrenome é obrigatório");
        
                    }
                    if (req.body.idade == null) {
                        erros.push("campo idade é obrigatório");
                    }
                    if (req.body.login == null || req.body.login == "") {
                        erros.push("campo login é obrigatório");
                    }
                    if (req.body.senha == null || req.body.senha == "") {
                        erros.push("campo senha é obrigatório");
                    }

                    const resultLogin = await conexao.execute(
                        `select * from tb_pessoa WHERE login = :login`,
                        [req.body.login]
                    );

                    if (resultLogin.rows.length > 0) {
                        erros.push("login já está sendo usado");

                    }
                    if (req.body.status == null) {
                        erros.push("campo status é obrigatório");

                    }

                    const { enderecos } = req.body;

                    if (
                        typeof enderecos == "undefined" ||
                        enderecos.length == 0
                    ) {
                        erros.push("Cadastre ao menos um endereço");
                    }
        
                     
                        enderecos.map((endereco: any) => {
                            if (endereco.codigoBairro == null) {
                                erros.push("campo codigoBairro é obrigatório");
                                
                            }
                            if (
                                endereco.nomeRua == null ||
                                endereco.nomeRua == ""
                            ) {
                                erros.push("campo nomeRua é obrigatório");
                            }
                            if (
                                endereco.numero == null ||
                                endereco.numero == ""
                            ) {
                                erros.push("campo número é obrigatório");
                            }
                            if (
                                endereco.complemento == null ||
                                endereco.complemento == ""
                            ) {
                                erros.push("campo complemento é obrigatório");
                            }
                            if(endereco.complemento.length > 20){
                                erros.push("O complemento está muito grande");

                            }

                            if (endereco.cep == null || endereco.cep == "") {
                                erros.push("campo cep é obrigatório");
                                
                               
                            }
                          
                           

                        });
  
                      
                        if(erros.length > 0){
                            return res.status(404).json({mensagem: erros, status: 404} )

                        }
                        else if(erros.length == 0){
                            return  next();

                        }
                     
                    
                }
                if (req.method == "PUT") {
                    if (req.body.codigoPessoa == null) {
                        erros.push("campo codigoPessoa é obrigatório");
                        
                    }
                    if (req.body.nome == null || req.body.nome == "") {
                        erros.push(" campo nome é obrigatório");
                    }
                    if (
                        req.body.sobrenome == null ||
                        req.body.sobrenome == ""
                    ) {
                        erros.push("campo sobrenome é obrigatório");
        
                    }
                    if (req.body.idade == null) {
                        erros.push("campo idade é obrigatório");
                    }
                    if (req.body.login == null || req.body.login == "") {
                        erros.push("campo login é obrigatório");
                    }
                    if (req.body.senha == null || req.body.senha == "") {
                        erros.push("campo senha é obrigatório");
                    }

                    const resultLogin = await conexao.execute(
                        `select * from tb_pessoa WHERE login = :login`,
                        [req.body.login]
                    );
           
               
                    if ((resultLogin.rows.length > 0 ) && (resultLogin.rows[0].LOGIN != req.body.login)
                       ) {
                        erros.push("login já está sendo usado");

                    }
                    if (req.body.status == null) {
                        erros.push("campo status é obrigatório");

                    }

                    const { enderecos } = req.body;

                    if (
                        typeof enderecos == "undefined" ||
                        enderecos.length == 0
                    ) {
                        erros.push("Cadastre ao menos um endereço");
                    }
        
                     
                        enderecos.map((endereco: any) => {
                            if (endereco.codigoBairro == null) {
                                erros.push("campo codigoBairro é obrigatório");
                                
                            }
                            if (endereco.codigoPessoa == null) {
                                erros.push("campo codigoPessoa em endereços é obrigatório");
                                
                            }
                            if (
                                endereco.nomeRua == null ||
                                endereco.nomeRua == ""
                            ) {
                                erros.push("campo nomeRua é obrigatório");
                            }
                            if (
                                endereco.numero == null ||
                                endereco.numero == ""
                            ) {
                                erros.push("campo número é obrigatório");
                            }
                            if (
                                endereco.complemento == null ||
                                endereco.complemento == ""
                            ) {
                                erros.push("campo complemento é obrigatório");
                            }
                            if(endereco.complemento && endereco.complemento.length > 20){
                                erros.push("O complemento está muito grande");

                            }

                            if (endereco.cep == null || endereco.cep == "") {
                                erros.push("campo cep é obrigatório");
                                
                               
                            }
                          
                           

                        });
  
                      
                        if(erros.length > 0){
                            return res.status(404).json({mensagem: erros, status: 404} )

                        }
                        else if(erros.length == 0){
                            return  next();

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
      
    };
}

export default Validacoes;
