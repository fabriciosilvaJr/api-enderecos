
import {Router} from 'express';
import UFController from './../controllers/UfController'

const ufRotas = Router();

const ufController = new UFController();

ufRotas.post('/', ufController.criacaoUF);
ufRotas.get('/', ufController.listarUF);
ufRotas.put('/', ufController.alterarUF);

export default ufRotas;