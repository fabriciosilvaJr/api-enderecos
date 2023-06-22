import {Router} from 'express';
import ufRotas from './UfRota';
import municipioRotas from './MunicipioRota';
import bairroRotas from './BairroRota';


const rotas = Router();
rotas.use('/uf', ufRotas);
rotas.use('/municipio', municipioRotas);
rotas.use('/bairro', bairroRotas);


export default rotas;
