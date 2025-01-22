
const {response}= require('express');
const Evento  = require('../models/Events');

const getEventos= async(req, res = response)=>{

    const eventos = await Evento.find()
                          .populate('user','name')


    res.status(201).json({
        ok:true,
        eventos

    })
  
}


const crearEventos= async(req, res = response)=>{

    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
          const eventoguardado = await evento.save();
          res.json({
            ok:true,
            evento:eventoguardado
          })
    } catch (error) {
            console.log(error);
            res.status(500).json(
                {
                    ok:false,
                    msg:'hable con el administrador'
                }
            )
    }


    res.status(201).json({
        ok:true,
        msg:'crear eventos'
    })
}

const actualizarEvento= async(req, res = response)=>{

    const eventoId = req.params.id;
    console.log(eventoId);

    try {
        const evento = await Evento.findById(eventoId);
        const uid=req.uid;
        console.log('eventoid',{evento});
        console.log('uidd',req.uid);

        if(!evento){
            res.status(404).json({
                ok:false,
                msg:'Evento no existe por ese id'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:'No tiene privilegios para editar este evento'
            })
        }

        const nuevoEvento={
            ...req.body,
            user:uid
        }
    
    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true});

    res.json({
        ok:true,
        evento:eventoActualizado
    })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
}


const eliminarEvento = async(req, res = response)=>{

    const eventoId = req.params.id;
    console.log(eventoId);

    try {
        const evento = await Evento.findById(eventoId);
        const uid=req.uid;
        console.log('eventoid',{evento});
        console.log('uidd',req.uid);

        if(!evento){
         return   res.status(404).json({
                ok:false,
                msg:'Evento no existe por ese id'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:'No tiene privilegios para eliminar este evento'
            })
        }

  
    await Evento.findByIdAndDelete(eventoId);

    res.json({
        ok:true
    })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }

}





module.exports = {
    getEventos,
    crearEventos,
    actualizarEvento,
    eliminarEvento
}