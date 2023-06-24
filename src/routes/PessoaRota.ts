import {Router} from 'express';
import PessoaController from '../controllers/PessoaController'; 
import Validacoes from '../middleware/validar';

const pessoaRotas = Router();

const validar = new Validacoes();
const pessoaController = new PessoaController();

pessoaRotas.post('/',validar.validarPessoa ,pessoaController.criacaoPessoa);

pessoaRotas.get('/',validar.validarPessoa ,pessoaController.listarPessoa);


export default pessoaRotas;