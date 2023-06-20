import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import rotas from './routes'
import AppErro from './errors/AppErro';
import db from './database';
import { Result } from 'oracledb';


const dbConexao = new db;

//dbConexao.conexaoComBanco();

const app = express();


app.use(cors());
app.use(express.json());
app.use(rotas);


app.use((error: Error, request: Request, response: Response, next: NextFunction) =>{
  if(error instanceof AppErro){
    return response.status(error.status).json({
        status: ' erro',
        messagem: error.messagem,
    })
  }

  return response.status(500).json({
    status: 'erro',
    mensagem: 'Erro interno no servidor'
  });

})

app.listen(3333,()=>{
    console.log('Servidor rodando na porta 3333!');
});

//  async function conectarDB() {
//      dbConexao.conexaoComBanco().then(async (connection: any) => {
//         await connection.execute("SELECT * FROM tb_uf", [], (err: Error, result: Result<[]>) => {
//             if (err) {
//                 console.error(err.message);
//             }
//             console.log(result.rows);
//         });
//         dbConexao.liberar(connection);
//     }).catch(error => {
//         console.log(error);
//     });
// }

// conectarDB()