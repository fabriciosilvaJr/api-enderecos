import { Request, Response } from "express";
import Pessoa from "./../models/pessoa";
import db from "./../database";
import { error } from "console";

const dbConexao = new db();

class PessoaController {
    public criacaoPessoa = async (req: Request, res: Response) => {
        await dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                const {
                    nome,
                    sobrenome,
                    idade,
                    login,
                    senha,
                    status,
                    enderecos,
                } = req.body;

                const queryPessoa = `INSERT INTO tb_pessoa (codigo_pessoa,nome,sobrenome, idade, login, senha, status)
                 Values (SEQUENCE_PESSOA.nextval, :nome, :sobrenome, :idade, :login, :senha, :status) `;

                const result = await connection.execute(
                    queryPessoa,
                    [nome, sobrenome, idade, login, senha, status],
                    { autoCommit: true }
                );

                if (result.rowsAffected == 1) {
                    const codigoPessoa = await connection.execute(
                        "select max(codigo_pessoa) as max from tb_pessoa"
                    );
                    //console.log(codigoPessoa.rows[0].MAX)
                    const contador = enderecos.length;

                    const queryEndereco = `INSERT INTO tb_endereco (codigo_endereco, codigo_pessoa, codigo_bairro, nome_rua, numero, complemento, cep) 
                        Values (SEQUENCE_ENDERECO.nextval, :codigoPessoa , :codigoBairro, :nomeRua, :numero, :complemento, :cep)
                    `;
                    for (let i = 0; i < contador; i++) {
                        await connection.execute(
                            queryEndereco,
                            [
                                codigoPessoa.rows[0].MAX,
                                enderecos[i].codigoBairro,
                                enderecos[i].nomeRua,
                                enderecos[i].numero,
                                enderecos[i].complemento,
                                enderecos[i].cep,
                            ],
                            { autoCommit: true }
                        );
                    }
                }

                const results = await connection.execute(
                    "SELECT * FROM tb_pessoa order by codigo_pessoa DESC"
                );

                const response = {
                    pessoas: results.rows.map((pessoa: Pessoa) => {
                        return {
                            codigoPessoa: pessoa.CODIGO_PESSOA,
                            nome: pessoa.NOME,
                            sobrenome: pessoa.SOBRENOME,
                            idade: pessoa.IDADE,
                            login: pessoa.LOGIN,
                            senha: pessoa.SENHA,
                            status: pessoa.STATUS,
                            enderecos: [],
                        };
                    }),
                };

                return res.status(200).send(response.pessoas);
            } catch (error) {
                console.log(error);

                return res.status(404).send({
                    mensagem:
                        "Não foi possível cadastrar pessoa no banco de dados.",
                    status: 404,
                });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };
}
export default PessoaController;
