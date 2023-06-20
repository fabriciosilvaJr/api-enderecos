import {Router} from 'express';

const rotas = Router();

rotas.get('/', (request, response) =>{
    return response.json({messagem: 'Olá Dev!' });
})

export default rotas;
