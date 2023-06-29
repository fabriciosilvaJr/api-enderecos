import oracledb, { Connection } from 'oracledb';
 oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = false;



class Conexao{
    public static conexao : any = null

    private static dbConfig = {
        user: "C##NODE",
        password: "node",
        connectString: "localhost/xe"
    }


    constructor(){
  
    }

    public static async abrirConexao()
{
    try {
        if(this.conexao === null)
    {
        console.log('TENTANDO ABRIR CONEXÃO...');
        this.conexao = await oracledb.getConnection(this.dbConfig);
        console.log("ABRIU CONEXÃO");
    }
       return this.conexao; 
    } catch (error) {
        console.log(error)
        
    }
}

public static async fecharConexao()
{
   try {
    if(this.conexao != null)
    {
        console.log('TENTANDO FECHAR CONEXÃO...');
        this.conexao.close();
        this.conexao = null;
        console.log("FECHAR CONEXÃO");
    }
    
   } catch (error) {
      console.log(error)
    
   }
}
public static async  commit()
{
    if(this.conexao != null)
    {
        await this.conexao.commit();
    }
}

public static async rollback()
{
    if(this.conexao != null)
    {
        await this.conexao.rollback();
    }
}

}

export default Conexao;
