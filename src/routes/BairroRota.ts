import {Router} from 'express';
import BairroController from '../controllers/BairroController'; 

const bairroRotas = Router();

const bairroController = new BairroController();

bairroRotas.post('/', bairroController.criacaoBairro);
bairroRotas.get('/', bairroController.listarBairro);
bairroRotas.put('/', bairroController.alterarBairro);
bairroRotas.delete('/:codigoBairro', bairroController.deletarBairro);


export default bairroRotas;