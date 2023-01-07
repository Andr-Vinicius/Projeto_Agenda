const Login = require('../models/LoginModel')

exports.index = (req, res) =>{
    // res.render -> renderiza a página
    //console.log(req.session.user)
    if(req.session.user){
        console.log('Você deve sair para logar ou criar outra conta...');
        return res.redirect('/');
    } 
    return res.render('login');
}

exports.register = async (req, res) => {
    try{
        // res.send -> Manda mensagens no sistema
        // req.body pega os dados do formulário
        const register = new Login(req.body);
        await register.register();

        // Exibir as mensagens de erro no form
        if(register.errors.length > 0){
            req.flash('errors', register.errors);
            req.session.save(() => {
                return res.redirect('/login');
            });
            return;
        }
        req.flash('success', 'Seu usuário foi cadastrado com sucesso!');
        req.session.save(() => {
            return res.redirect('/login');
        });
    }catch(error){
        console.log(error);
        return res.render('404');
    }
}

exports.login = async (req, res) => {
    try{
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0){
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login');
            });
            return;
        }

        req.flash('success', 'Usuário logado com sucesso!');
        req.session.user = login.user;
        req.session.save(() => {
            return res.redirect('/');
        });
    }catch(error){
        console.log(error);
        return res.render('404');
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}