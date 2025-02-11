const {response} = require('express');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const  Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt')

const crearusuario= async(req,res = response)=>{
    const  {email,password} = req.body;

  

    try {
        console.log(req.body);

        let usuario = await Usuario.findOne({email});
        console.log(usuario);
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'Un usuario Existe con ese correo'
            })
        }
        usuario = new Usuario(req.body);
       //encriptar contraseña
       const salt = bcrypt.genSaltSync();
       usuario.password = bcrypt.hashSync(password,salt);
       
       await usuario.save();
       const token = await generarJWT(usuario.id,usuario.name);
        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
    
        })
        
    } catch (error) {
        res.status(501).json({
            ok:false,
            msg:'por favor hable con el administrador'
    
        })
        
    }
  
}

const loginusuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id,usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}


const revalidarToken = async (req,res = response)=>{
    const uid = req.uid;
    const name = req.name;
    const token = await generarJWT(uid,name);
    res.json({
        ok:true,
        token,
        name,
        uid
    })
}

module.exports = {
    crearusuario,
    loginusuario,
    revalidarToken
}