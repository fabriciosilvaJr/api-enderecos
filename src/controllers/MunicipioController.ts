import { Request, Response } from "express";
import Municipio from "./../models/municipio";
import db from "./../database";

const dbConexao = new db();

class MunicipioController {
    public criacaoMunicipio = async (req: Request, res: Response) => {
        await dbConexao.conexaoComBanco().then(async (connection: any) => {
            try {
                //validações
                const resultUF = await connection.execute(
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

                const resultNome = await connection.execute(
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
                const result = await connection.execute(
                    query,
                    [req.body.codigoUF, req.body.nome, req.body.status],
                    { autoCommit: true }
                );

                const result2 = await connection.execute(
                    "SELECT * FROM tb_municipio order by codigo_uf DESC"
                );
                const response = {
                    municipios: result2.rows.map((municipio: Municipio) => {
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
                console.log(error)
                return res
                    .status(404)
                    .send({
                        mensagem:
                            "Não foi possível cadastrar município no banco de dados.",
                        status: 404,
                    });
            } finally {
                await dbConexao.liberar(connection);
            }
        });
    };


}

export default MunicipioController;