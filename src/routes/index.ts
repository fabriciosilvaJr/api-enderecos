import {Router} from 'express';
import ufRotas from './UfRota';
import municipioRotas from './MunicipioRota';


const rotas = Router();
rotas.use('/uf', ufRotas);
rotas.use('/municipio', municipioRotas);


export default rotas;
