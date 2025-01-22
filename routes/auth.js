const {Router} = require('express');
const  router = Router();
const { crearusuario,loginusuario,revalidarToken} = require('../controllers/auth');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt')
 
// utas
router.post('/new',
[
check('name','El nombre es obligatorio').not().isEmpty(),
check('email','El email es obligatorio').isEmail(),
check('password','debe de ser de 6 caracteres').isLength({min:6}),
validarCampos
],crearusuario)


router.post('/',
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','debe de ser de 6 caracteres').isLength({min:6}),
        validarCampos
        ]
    ,loginusuario)

router.get('/renew',validarJWT,revalidarToken)

module.exports = router;