import {Router} from 'express';
import MunicipioController from '../controllers/MunicipioController'; './../controllers/MunicipioController'

const municipioRotas = Router();

const municipioController = new MunicipioController();

municipioRotas.post('/', municipioController.criacaoMunicipio);
municipioRotas.get('/', municipioController.listarMunicipio);


export default municipioRotas;