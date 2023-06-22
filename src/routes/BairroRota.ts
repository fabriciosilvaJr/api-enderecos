import {Router} from 'express';
import BairroController from '../controllers/BairroController'; 

const bairroRotas = Router();

const bairroController = new BairroController();

bairroRotas.post('/', bairroController.criacaoBairro);
bairroRotas.get('/', bairroController.listarBairro);



export default bairroRotas;