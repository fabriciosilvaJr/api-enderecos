class AppErro{
    public readonly messagem: string;
    public readonly status: number;

    constructor(messagem: string, status = 400){
        this.messagem = messagem;
        this.status = status;
    }
}

export default AppErro;

