import {Router} from 'express';
import MunicipioController from '../controllers/MunicipioController'; 
const municipioRotas = Router();

const municipioController = new MunicipioController();

municipioRotas.post('/', municipioController.criacaoMunicipio);
municipioRotas.get('/', municipioController.listarMunicipio);
municipioRotas.put('/', municipioController.alterarMunicipio);
municipioRotas.delete('/:codigoMunicipio', municipioController.deletarMunicipio);

export default municipioRotas;