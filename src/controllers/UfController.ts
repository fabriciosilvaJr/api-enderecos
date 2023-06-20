import { Request, Response } from 'express';
import Uf  from './../models/uf';
import db from './../database';
import { Result } from 'oracledb';
import { TextDecoderOptions } from 'stream/web';
 
const dbConexao = new db;


// 
//     public async criacaoUf(request: Request, response: Response){

//         try {
//             dbConexao.conexaoComBanco().then(async (connection: any) => {
//                         await connection.execute("SELECT * FROM tb_uf", [], (err: Error, result: Result<[]>) => {
//                             if (err) {
//                                 console.error(err.message);
//                             }
//                             console.log(result.rows);
//                         });
//                         dbConexao.liberar(connection);
         
         
//         } 

//       } catch (error) {
//         console.log(error)
//     }
// }
// }
class UfController{
    public criacaoUF = async (req: Request, res: Response) => {

        try{

          const query = `INSERT INTO tb_uf (codigo_uf, sigla, nome, status) Values (:codigo_uf, :sigla, :nome, :status)` ;
           await dbConexao.conexaoComBanco().then(async (connection: any) => {
                const result = await connection.execute(query, [
                    req.body.codigo_uf,
                    req.body.sigla,
                    req.body.nome,
                    req.body.status,

                ], {autoCommit: true})
                
                const result2 =  await connection.execute("SELECT * FROM tb_uf order by codigo_uf DESC",)
                const response = {
                    ufs: result2.rows.map((uf: Uf) => {
                        return {
                            codigoUF: uf.CODIGO_UF,
                            sigla: uf.SIGLA,
                            nome: uf.NOME,
                            status: uf.STATUS,  
            
                        }
                    })
                }

            return res.status(200).send(response.ufs)  
                    dbConexao.liberar(connection);
                });
            

        } catch(error){

            return res.status(500).send({ error: error })

        } 
    };
    public listarUF = async (req: Request, res: Response) => {

        try{

             dbConexao.conexaoComBanco().then(async (connection: any) => {
                const result =  await connection.execute("SELECT * FROM tb_uf",)
                const response = {
                    ufs: result.rows.map((uf: Uf) => {
                        return {
                            codigoUF: uf.CODIGO_UF,
                            sigla: uf.SIGLA,
                            nome: uf.NOME,
                            status: uf.STATUS,  
            
                        }
                    })
                }

                return res.status(200).send(response.ufs)

                    dbConexao.liberar(connection);
                });

        } catch(error){

            return res.status(500).send({ error: error })

        } 
    };
}

export default UfController;

