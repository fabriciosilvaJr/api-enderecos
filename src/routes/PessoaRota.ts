import {Router} from 'express';
import PessoaController from '../controllers/PessoaController'; 

const pessoaRotas = Router();

const pessoaController = new PessoaController();

pessoaRotas.post('/', pessoaController.criacaoPessoa);


export default pessoaRotas;