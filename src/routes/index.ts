import {Router} from 'express';
import ufRotas from './UfRota';
import municipioRotas from './MunicipioRota';
import bairroRotas from './BairroRota';
import pessoaRotas from './PessoaRota';


const rotas = Router();
rotas.use('/uf', ufRotas);
rotas.use('/municipio', municipioRotas);
rotas.use('/bairro', bairroRotas);
rotas.use('/pessoa', pessoaRotas);


export default rotas;
