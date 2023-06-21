import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import rotas from './routes'
import AppErro from './errors/AppErro';




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

