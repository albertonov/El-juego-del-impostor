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
		    socket.on('crearPartida', function(nick,numero, mapa, isPrivate, isOscure){
				console.log("NDG en SCW" + isOscure)
				console.log("A crear partida (servidor) LE LLEGA "+ mapa)
				var codigo=juego.crearPartida(numero,nick, mapa, isPrivate, isOscure);	
				socket.join(codigo);	        			
				console.log('usuario: '+nick+" crea partida codigo: "+codigo);	
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo,"owner":nick, "mapa": mapa, "niebla": isOscure});		        		        
		    	var lista=juego.listaPartidasDisponibles();
		    	cli.enviarGlobal(socket,"recibirListaPartidasDisponibles",lista); 
		    });
		    socket.on('unirAPartida',function(nick,codigo){
		    	var res=juego.unirAPartida(codigo,nick);
				if (res != -1) {
					socket.join(codigo);
					var owner=juego.partidas[codigo].nickOwner;
					var mapa = juego.partidas[codigo].getMapa();
					var niebla = juego.partidas[codigo].niebla;
					console.log("Usuario "+res.nick+" se une a partida "+res.codigo +"en mapa "+ mapa + "con niebla en: " + niebla);
					cli.enviarRemitente(socket,"unidoAPartida",{"codigo":res.codigo, "nick":res.nick,"numJugador":res.numJugador, "mapa": mapa, "niebla":niebla });
					var lista=juego.obtenerListaJugadores(codigo);
					cli.enviarATodos(io, codigo, "nuevoJugador",lista);
				}
				
		    });
			socket.on('abandonarPartida',function(nick,codigo){
				var ownerAbandona = false;
		    	var partida=juego.partidas[codigo];
				if (partida){
					//comprobar si existe, ya que el owner puede haber abandonado la partida y eliminarla
					partida.abandonarPartida(nick);
					if (nick == partida.nickOwner){
						ownerAbandona = true;
					}
					console.log("OWNER ABANDONA: " + ownerAbandona)
					if (ownerAbandona){
						
						console.log("Avisando a usuarios de que Owner ha abandonado partida")
						cli.enviarATodosMenosRemitente(socket,codigo,"ownerAbandona", null);
						console.log("Eliminando partida...")
						juego.eliminarPartida(codigo);
					}
					else{
						var lista=juego.obtenerListaJugadores(codigo);
						cli.enviarATodosMenosRemitente(socket,codigo, "jugadorAbandona",lista);
					}
				}
		    });

		    socket.on('iniciarPartida',function(nick,codigo){
		      	juego.iniciarPartida(nick,codigo);
		    	var fase=juego.partidas[codigo].fase.nombre;
		    	if (fase=="jugando"){
			    	cli.enviarATodos(io, codigo, "partidaIniciada",fase);
			    }
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
				var lista=juego.obtenerListaJugadores(codigo);
				cli.enviarRemitente(socket,"dibujarRemoto",lista);
		    });

		    socket.on('movimiento',function(datos){
		    	cli.enviarATodosMenosRemitente(socket,datos.codigo,"moverRemoto",datos);
		    });

		    socket.on("lanzarVotacion",function(nick,codigo){
		    	juego.lanzarVotacion(nick,codigo);
		    	var partida=juego.partidas[codigo];
		    	var lista=partida.obtenerJugadoresVivos();
		    	cli.enviarATodos(io, codigo,"votacion",lista);
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
				var fase=partida.fase.nombre;
				if (fase=="final"){
			    	cli.enviarATodos(io, codigo, "final","FIN DEL JUEGO");
			    }
		    });

			socket.on("votar",function(nick,codigo,sospechoso){
		    	var partida=juego.partidas[codigo];
		    	juego.votar(nick,codigo,sospechoso);
		    	if (partida.todosHanVotado()){
					console.log("TODOS Han votado ya")
		    		var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
			    	cli.enviarATodos(io, codigo,"finalVotacion",data);	
		    	}
		    	else{
		    		cli.enviarATodos(io, codigo,"haVotado",partida.listaHanVotado());		    	
		    	}
				var fase=partida.fase.nombre;
				if (fase=="final"){
			    	cli.enviarATodos(io, codigo, "final","FIN DEL JUEGO");
			    }
		    });

		    socket.on("obtenerEncargo",function(nick,codigo, mapa){
		    	var encargo=juego.partidas[codigo].usuarios[nick].encargo;
		    	var impostor=juego.partidas[codigo].usuarios[nick].impostor;
				var infoTarea = juego.getTareaInfo(encargo, mapa);
				//console.log("Tarea info es:   "+infoTarea)
		    	cli.enviarRemitente(socket,"recibirEncargo",{"encargo":encargo,"impostor":impostor, "infoTarea":infoTarea});
		    });

		    socket.on("atacar",function(nick,codigo,inocente){
		    	juego.atacar(nick,codigo,inocente);
		    	var partida=juego.partidas[codigo];
		    	var fase=partida.fase.nombre;
		    	cli.enviarATodos(io,codigo,"muereInocente",inocente);
		    	cli.enviarRemitente(socket,"hasAtacado",fase);
			    if (fase=="final"){
			    	cli.enviarATodos(io, codigo, "final","ganan impostores");
			    }
		    });

		    socket.on("realizarTarea",function(nick,codigo){
		    	var partida=juego.partidas[codigo];
		    	juego.realizarTarea(nick,codigo);
		    	var percent=partida.obtenerPercentTarea(nick);
		    	var global=partida.obtenerPercentGlobal();
				cli.enviarRemitente(socket,"tareaRealizada",{"percent":percent,"goblal":global});			    	
		    	var fase=partida.fase.nombre;
		    	if (fase=="final"){
			    	cli.enviarATodos(io, codigo, "final","ganan ciudadanos");
			    }
		    });

			socket.on("enviarMensaje",function(nick, codigo, msg){
		    	var partida=juego.partidas[codigo];
		    	var newMsg = "<strong>"+ nick +"</strong>" + ": " + msg
				partida.agregarMensaje(newMsg);
				var listaMensajes = partida.getMensajes()
		    	cli.enviarATodos(io, codigo, "recibirMensaje",listaMensajes);
		    });

			socket.on("getTareaInfo",function(tarea, mapa){

				if (mapa == "map1"){
					var preguntasMapa1 = {
						"calles":
							['tarea1', 'Te encuentras en la herreria. Aun eres un aprendiz, pero has visto muchas peliculas y seguro que sabes forjar un anillo que te haga invisible. <br>Pero por el momento, aun tienes que aprender que <strong>para hacer bronce, el cobre se mezcla con...</strong>' , 'Estaño' ],
						
						"mobiliario":
							['tarea2', 'Te encuentras en el mercado. Un beduino llega de tierras lejanas, pero parece que no se entera de como se gestionan los pesos y precios de esta aldea. <br>- No se lo que es una arroba. <br>Tu, como experto comerciante que eres, sabes que <strong> una arroba equivale a X libras</strong>' , '25' ],
						
						"basuras":
							['tarea3', 'Quizas no sea el encargo más interesante del mundo, pero al menos te licenciastes en geografia. Y por supuesto, sabes que el rio más largo del mundo es el rio...' , 'Amazonas' ],

					}
					cli.enviarRemitente(socket,"returnTareaInfo", preguntasMapa1[tarea]);		
						    	
				}
				else if (mapa == "map2"){
					var preguntasMapa2 = {
						"calles":
							['Calles', 'El Bernabeu esta ubicado en el...' , 'Paseo de la Castellana' ],
						
						"mobiliario":
							['Mobiario', 'Es venta y no se vende, es Ana, pero no es gente. Soy una...' , 'Ventana' ],
						
						"basuras":
							['Basuras', 'El plastico va al contenedor...' , 'Amarillo' ],

					}
					cli.enviarRemitente(socket,"returnTareaInfo", preguntasMapa2[tarea]);		    	

				}
		    });
		});
	}
	
}

module.exports.ServidorWS=ServidorWS;