import oracledb, { Connection } from 'oracledb';
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// oracledb.autoCommit = true;

export default class DatabaseConnection {
    private oracledb = oracledb;
    private dbConfig = {
        user: "C##NODE",
        password: "node",
        connectString: "localhost/xe"
    }

    public async init(): Promise<void> {
    }

    public async conexaoComBanco() {
        return new Promise((resolve, reject) => {
            this.oracledb.getConnection(this.dbConfig, (err:oracledb.DBError, connection:Connection) => {
                if (err) {
                    reject(err.message);
                }
                console.log('Conectado com banco de dados..');
                resolve(connection);
            });
        });
    }

    public liberar(connection: Connection) {
        connection.release((err) => {
            if (err)
                console.error(err.message);
            console.log('Conexão liberada');
        });
    }
}
