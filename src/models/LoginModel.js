const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  senha: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login(){
        this.valida();
        if(this.errors.length > 0) return;

        this.user = await LoginModel.findOne({email: this.body.email});
        if(!this.user) {
            this.errors.push('Usuário não existe');
            return;
        }


        if(!bcryptjs.compareSync(this.body.senha, this.user.senha)){
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        }
        
    }

    // Precisamos usar async/await pois o LoginModel vai retornar Promises
    async register(){
        this.valida();
        if(this.errors.length > 0) return;

        await this.usuarioExiste();
        if(this.errors.length > 0) return;


        // Gera uma sequência aleatória pra criptografia
        const salt = bcryptjs.genSaltSync();
        this.body.senha =  bcryptjs.hashSync(this.body.senha, salt);

        this.user = await LoginModel.create(this.body);           
    }

    async usuarioExiste(){
        this.user = await LoginModel.findOne({email: this.body.email});
        if(this.user) this.errors.push('Usuário já existe');
    }

    valida(){
        this.cleanUp();
        // Validação dos campos
        // email váido
        if(!validator.isEmail(this.body.email)){
            this.errors.push('Email inválido');
        }
        // senha precisa ter entre 8-30 caracteres
        if(this.body.senha.length < 8 || this.body.senha.length >= 30) {
            this.errors.push('Tamanho de senha inválido')
        }


    }

    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            senha: this.body.senha
        };
    }

}

module.exports = Login;