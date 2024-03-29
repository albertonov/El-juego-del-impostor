var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;

function Cad (){
	this.partidas=undefined;
    this.connected;
    //// Partidas
    this.insertarPartida=function(partida,callback){
        insertar(this.partidas,partida,callback);
    }

    this.obtenerPartidas=function(callback){
        obtenerTodos(this.partidas,callback);
    }

    this.obtenerPartidaCriterio=function(criterio,callback){
        obtener(this.partidas,criterio,callback);
    }

    this.modificarColeccionPartidas=function(partida,callback){
        modificarColeccion(this.partidas,partida,callback);
    }

    this.eliminarPartida=function(uid,callback){
        eliminar(this.partidas,{_id:ObjectID(uid)},callback);
    }


    //// funciones genéricas

    function obtenerTodos(coleccion,callback){
        coleccion.find().toArray(function(error,col){
            callback(col);
        });
    };

    function obtener(coleccion,criterio,callback){
        coleccion.find(criterio).toArray(function(error,partida){
            if (partida.length==0){
                callback(undefined);
            }
            else{
                callback(partida);
            }
        });
    };

	function insertar(coleccion,elemento,callback){
        coleccion.insertOne(elemento,function(err,result){
            if(err){
                console.log("error");
            }
            else{
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    }

    function modificarColeccion(coleccion,partida,callback){
        coleccion.findAndModify({_id:ObjectID(partida._id)},{},usr,{},function(err,result){
            if (err){
                console.log("No se pudo actualizar (método genérico)");
            }
            else{     
                console.log("Partida actualizada"); 
            }
            callback(result);
        });
    }

    function eliminar(coleccion,criterio,callback){
        coleccion.remove(criterio,function(err,result){
            if(!err){
                callback(result);
            }
        });
    }


    this.connect=function(callback){
	    var cad=this;		
        //mongodb+srv://alberto:<password>@cluster0.enecr.mongodb.net/impostorjuego?retryWrites=true&w=majority
		mongo.connect("mongodb+srv://alberto:albertopass@cluster0.enecr.mongodb.net/impostorjuego?retryWrites=true&w=majority",{useUnifiedTopology: true },function(err, database){
            if (err){
                console.log("No pudo conectar a la base de datos");
                this.connected = false;
                callback("ERROR");

            }
            else{                
	 			console.log("conectado a Mongo: coleccion partidas");                             
                database.db("impostorapp").collection("partidas",function(err,col){
                    if (err){
                        console.log("No se puede obtener la coleccion")
                        callback("ERROR");
                    }
                    else{       
                        console.log("tenemos la colección partidas");                                 
                        cad.partidas=col;  
                        callback(database);                                                
                    }
                });
            }
		});
	}
}

module.exports.Cad = Cad;