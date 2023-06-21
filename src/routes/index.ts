import {Router} from 'express';
import ufRotas from './UfRota'

const rotas = Router();
rotas.use('/uf', ufRotas);



export default rotas;
