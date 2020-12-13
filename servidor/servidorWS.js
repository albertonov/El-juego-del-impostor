var modelo=require("./modelo.js");

function ServidorWS(){
	this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }
	this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }
    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };
    this.enviarGlobal=function(socket,mens,data){
    	socket.broadcast.emit(mens,data);
    }
	this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){		    
		    socket.on('crearPartida', function(nick,numero){
		        //var usr=new modelo.Usuario(nick);
				var codigo=juego.crearPartida(numero,nick);	
				socket.join(codigo);	        			
				console.log('usuario: '+nick+" crea partida codigo: "+codigo);	
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo,"owner":nick});		        		        
		    	var lista=juego.listaPartidasDisponibles();
		    	cli.enviarGlobal(socket,"recibirListaPartidasDisponibles",lista); 
		    });
		    socket.on('unirAPartida',function(nick,codigo){
		    	//nick o codigo nulo
		    	var res=juego.unirAPartida(codigo,nick);
		    	socket.join(codigo);
		    	var owner=juego.partidas[codigo].nickOwner;
		  		console.log("Usuario "+res.nick+" se une a partida "+res.codigo);
		    	cli.enviarRemitente(socket,"unidoAPartida",res);
		    	var lista=juego.obtenerListaJugadores(codigo);
		    	//cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",res.nick);
		    	cli.enviarATodos(io, codigo, "nuevoJugador",lista);
		    });

		    socket.on('iniciarPartida',function(nick,codigo){
		    	//iniciar partida ToDo
		    	//controlar si nick es el owner
		    	//cli.enviarATodos(socket,codigo,"partidaIniciada",fase);
		    	juego.iniciarPartida(nick,codigo);
		    	var fase=juego.partidas[codigo].fase.nombre;
		    	cli.enviarATodos(io, codigo, "partidaIniciada",fase);
		    });

		    socket.on('listaPartidasDisponibles',function(){
		    	var lista=juego.listaPartidasDisponibles();
		    	cli.enviarRemitente(socket,"recibirListaPartidasDisponibles",lista);
		    });

		    socket.on('listaPartidas',function(){
		    	var lista=juego.listaPartidas();
		    	cli.enviarRemitente(socket,"recibirListaPartidas",lista);
		    });

		    socket.on('estoyDentro',function(nick,codigo){
		    	//var usr=juego.obtenerJugador(nick,codigo);
		  //   	var numero=juego.partidas[codigo].usuarios[nick].numJugador;
		  //   	var datos={nick:nick,numJugador:numero};
				// cli.enviarATodosMenosRemitente(socket,codigo,"dibujarRemoto",datos)
				var lista=juego.obtenerListaJugadores(codigo);
				cli.enviarRemitente(socket,"dibujarRemoto",lista);
		    });

		    socket.on('movimiento',function(nick,codigo,numJugador,x,y){
		    	var datos={nick:nick,numJugador:numJugador,x:x, y:y};
		    	cli.enviarATodosMenosRemitente(socket,codigo,"moverRemoto",datos);
		    });

		    socket.on("lanzarVotacion",function(nick,codigo){
		    	juego.lanzarVotacion(nick,codigo);
		    	var partida=juego.partidas[codigo];
		    	cli.enviarATodos(io, codigo,"votacion",partida.fase.nombre);
		    });

		    socket.on("saltarVoto",function(nick,codigo){
		    	var partida=juego.partidas[codigo];
		    	juego.saltarVoto(nick,codigo);
		    	if (partida.todosHanVotado()){
		    		var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
			    	cli.enviarATodos(io, codigo,"finalVotacion",data);	
		    	}
		    	else{
		    		cli.enviarATodos(io, codigo,"haVotado",partida.listaHanVotado());		    	
		    	}
		    });

			socket.on("votar",function(nick,codigo,sospechoso){
		    	var partida=juego.partidas[codigo];
		    	juego.votar(nick,codigo,sospechoso);
		    	if (partida.todosHanVotado()){
		    		var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
			    	cli.enviarATodos(io, codigo,"finalVotacion",data);	
		    	}
		    	else{
		    		cli.enviarATodos(io, codigo,"haVotado",partida.listaHanVotado());		    	
		    	}
		    });

		    socket.on("obtenerEncargo",function(nick,codigo){
		    	var encargo=juego.partidas[codigo].usuarios[nick].encargo;
		    	var impostor=juego.partidas[codigo].usuarios[nick].impostor;
		    	cli.enviarRemitente(socket,"recibirEncargo",{"encargo":encargo,"impostor":impostor});
		    });

		    socket.on("atacar",function(nick,codigo,inocente){
		    	juego.atacar(nick,codigo,inocente);
		    	var partida=juego.partidas[codigo];
		    	var fase=partida.fase.nombre;
			    if (fase=="final"){
			    	cli.enviarATodos(io, codigo, "final","ganan impostores");
			    }
			    else{
			    	cli.enviarRemitente(socket,"muereInocente",fase);
			    }
		    })

		});
	}
	
}

module.exports.ServidorWS=ServidorWS;