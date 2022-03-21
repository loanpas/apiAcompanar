import { Meteor } from 'meteor/meteor';
import { EspaciosCollection } from '../imports/api/espacios';

if(Meteor.isServer) {

    const messages = (c, e, m) => {
        return obj = { code: c, error: e, message: m }
    } 

    const insertEspacio = ({nombre, direccion, descripcion, geolocalizacion}) => {
        return EspaciosCollection.insert({nombre, direccion, descripcion, geolocalizacion });                       
    }

    // When Meteor starts, create new collection in Mongo if not exists.
     Meteor.startup(function () {
        console.log('|--------------------------|')
        console.log('| API - Acompañar iniciada |')
        console.log('|--------------------------|')
     });

    /**
     * GET /espacios, 
     * POST /espacios, 
     */
    Router.route('/espacios',{where: 'server'})
        // GET /espacios - devuelve todos los espacios de la colección MongoDB.
        .get(function(){
            var response = EspaciosCollection.find().fetch();

            if(response.length === 0) {
                response = messages("404", true, "no existen datos !.")
            }

            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));            
        })

        // POST /espacios - { espacio as post data } - agrega un nuevo espacio a la collecion MongoDB.
        .post(function() {
            var response;            
            if(this.request.body.nombre === "" || 
                this.request.body.direccion === "" ||
                this.request.body.geolocalizacion === null ) {
                    response = messages("000", true, "datos inválidos !.")
            } else {                
                insertEspacio({"nombre": this.request.body.nombre, "direccion": this.request.body.direccion, "descripcion": this.request.body.descripcion, "geolocalizacion": this.request.body.geolocalizacion});
                response = messages("201", false, "registro agregado con éxito !.")
            }
            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        });

    /**
     * GET /espacios/:id, 
     * PUT /espacios:id, 
     * DELETE /espacios/:id 
     */
    Router.route('/espacios/:id',{where: 'server'})

        // GET /espacios/:id - retorna un espacio específico según su id.
        .get(function() {
            var response;
            if(this.params.id !== undefined) {
                var data = EspaciosCollection.find({_id : this.params.id}).fetch();
                if(data.length > 0) {
                    response = data
                } else {
                    response = messages("404", true, "registro no encontrado !.")
                }
            }
            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        })

        // PUT /espacios/:id { espacio as put data } - actualiza un espacio espacífico.
        .put(function() {
            var response;
            if(this.params.id !== undefined) {

                var data = EspaciosCollection.find({_id : this.params.id}).fetch();
                if(data.length > 0) {
                    if(EspaciosCollection.update(
                        {_id : data[0]._id},
                        {$set : {nombre : this.request.body.nombre, 
                                    direccion: this.request.body.direccion, 
                                    descripcion: this.request.body.descripcion, 
                                    geolocalizacion: this.request.body.geolocalizacion}}) === 1) {

                        response = messages("202", false, "registro actualizado con éxito !.")          
                    } else {
                        response = messages("000", true, "registro no actualizado !.")          
                    }
                } else {
                    response = messages("404", true, "registro no encontrado !.")          
                }
            }
            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        })

        // DELETE /espacios/:id - elimina un espacio específico.
        .delete(function() {
            var response;
            if(this.params.id !== undefined) {
                var data = EspaciosCollection.find({_id : this.params.id}).fetch();
                if(data.length >  0) {
                    if(EspaciosCollection.remove(data[0]._id) === 1) {
                        response = messages("200", false, "registro eliminado !.")          
                    } else {
                        response = messages("000", true, "registro no eliminado !.")          
                    }
                } else {
                    response = messages("404", true, "registro no encontrado !.")          
                }
            }
            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        });        
}
