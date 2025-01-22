const { getEventos,crearEventos,actualizarEvento,eliminarEvento} = require('../controllers/events');
const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt')
const  router = Router();
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { isDate } = require('../middlewares/isDate');


router.use(validarJWT);

router.get('/',getEventos);
router.post(
            '/'
            ,
            [ 
              check('title','El titulo es obligatorio').not().isEmpty(),
              check('start','fecha de inicio es obligatoria').custom(isDate),
              check('end','fecha de finalizacion es obligatoria').custom(isDate),
              validarCampos

            ],
            crearEventos);
router.put('/:id',actualizarEvento);
router.delete('/:id',eliminarEvento);
module.exports = router;