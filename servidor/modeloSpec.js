var modelo=require("./modelo.js");

describe("El juego del impostor", function() {
  var juego;
  var nick;

  beforeEach(function() {
  	juego=new modelo.Juego(4, "test");
  	nick="jugador1";
  });

  it("comprobar valores iniciales del juego", function() {
  	expect(Object.keys(juego.partidas).length).toEqual(0);
  	expect(nick).toEqual("jugador1");
  });

  it("comprobar valores de la partida",function(){
  	var codigo=juego.crearPartida(3,nick);
  	expect(codigo).toEqual("fallo");
  	codigo=juego.crearPartida(11,nick);
  	expect(codigo).toEqual("fallo");
  })

  describe("el usr jugador1 crea una partida de 4 jugadores",function(){
	var codigo;
	beforeEach(function() {
	  	codigo=juego.crearPartida(4,nick);
		partida = juego.partidas[codigo];

	});
	it("se comprueba la partida",function(){ 	
	  	expect(codigo).not.toBe(undefined);
	  	expect(partida.nickOwner).toEqual(nick);
		expect(partida.maximo==4).toBe(true);
	  	expect(partida.fase.nombre).toEqual("inicial");
	  	expect(Object.keys(partida.usuarios).length).toEqual(1);
	  });



	it("no se puede crear partida si el num no está entre 4 y 10",function(){
		var codigo=juego.crearPartida(3,nick);
		expect(codigo).toEqual("fallo");
		codigo=juego.crearPartida(11,nick);
		expect(codigo).toEqual("fallo");
		codigo=juego.crearPartida(6,nick);
		expect(codigo).not.toEqual("fallo");
	});

	it("usuarios se unen a la partida",function(){
		expect(partida.fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"jugador2");
		expect(Object.keys(partida.usuarios["jugador2"])).not.toBe(undefined);
	  	expect(Object.keys(partida.usuarios).length).toEqual(2);
		expect(partida.fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"jugador3");
		expect(Object.keys(partida.usuarios["jugador3"])).not.toBe(undefined);
	  	expect(Object.keys(partida.usuarios).length).toEqual(3);
		expect(partida.fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"jugador4");
		expect(Object.keys(partida.usuarios["jugador4"])).not.toBe(undefined);
	  	expect(Object.keys(partida.usuarios).length).toEqual(4);
		expect(partida.fase.nombre).toEqual("completado");
	  });

	  it("jugador1 intenta iniciar partida con 2 jugadores",function(){
		juego.unirAPartida(codigo,"jugador2");
	  	expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(2);

		expect(juego.partidas[codigo].fase.nombre).not.toEqual("completado");		
		juego.iniciarPartida(nick,codigo);
		expect(juego.partidas[codigo].fase.nombre).not.toEqual("jugando");		
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");		
	});

	it("jugador6 crea una nueva partida oculta y no aparece en la lista de partidas disponibles",function(){
		expect(juego.listaPartidas().length).toEqual(1);
		codigoOculto=juego.crearPartida(4,"jugador6", "map1", true);
		expect(juego.listaPartidas().length).toEqual(2);
		expect(juego.listaPartidasDisponibles().length).toEqual(1);
	});

	it("jugador1 inicia partida con 4 jugadores",function(){
		juego.unirAPartida(codigo,"jugador2");
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"jugador3");
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"jugador4");
	  	expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		juego.iniciarPartida(nick,codigo);
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	});

	it("comprobar que hay un impostor", function(){
		juego.unirAPartida(codigo,"jugador2");
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"jugador3");
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"jugador4");
		juego.iniciarPartida(nick,codigo);
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
		var encontradoImpostor = false;
		for (var key in partida.usuarios){
			if (partida.usuarios[key].impostor){
				encontradoImpostor = true;
			}
		}
		expect(encontradoImpostor).toBe(true);
	});

	it("varios jugadores abandonan la partida",function(){
		expect(partida.fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"jugador2");
		expect(Object.keys(partida.usuarios["jugador2"])).not.toBe(undefined);
	  	expect(Object.keys(partida.usuarios).length).toEqual(2);
		expect(partida.fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"jugador3");
		expect(Object.keys(partida.usuarios["jugador3"])).not.toBe(undefined);
	  	expect(Object.keys(partida.usuarios).length).toEqual(3);
		expect(partida.fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"jugador4");
		expect(Object.keys(partida.usuarios["jugador4"])).not.toBe(undefined);
	  	expect(Object.keys(partida.usuarios).length).toEqual(4);
		expect(partida.fase.nombre).toEqual("completado");
		expect(partida.obtenerListaJugadores().length).toEqual(4)

		
		partida.usuarios["jugador4"].abandonarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		expect(partida.obtenerListaJugadores().length).toEqual(3)
		partida.usuarios["jugador2"].abandonarPartida();
		partida.usuarios["jugador3"].abandonarPartida();

		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		expect(partida.obtenerListaJugadores().length).toEqual(1)
		partida.usuarios["jugador1"].abandonarPartida();
		expect(partida.numeroJugadores()).toEqual(0);
		expect(juego.partidas[codigo]).toBe(undefined);
		expect(juego.listaPartidasDisponibles.length).toEqual(0);
	});
   


	describe("Votar",function(){
		var partida;
		beforeEach(function() {
			juego.unirAPartida(codigo,"jugador2");
			juego.unirAPartida(codigo,"jugador3");
			juego.unirAPartida(codigo,"jugador4");
			juego.iniciarPartida(nick,codigo);
			partida=juego.partidas[codigo];
		});

		it("Comprobar numero de votos",function(){
			expect(partida.fase.nombre).toEqual("jugando");
			juego.lanzarVotacion(nick,codigo);
			expect(partida.fase.nombre).not.toEqual("jugando");
			expect(partida.fase.nombre).toEqual("votacion");

			expect(partida.usuarios["jugador4"].votos).toEqual(0);
			juego.votar(nick,codigo,"jugador4");
			expect(partida.usuarios["jugador4"].votos).toEqual(1);
			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.usuarios["jugador4"].votos).toEqual(2);
			juego.votar("jugador3",codigo,"jugador4");
			expect(partida.usuarios["jugador4"].votos).toEqual(3);
			juego.votar("jugador4",codigo,"jugador4");
			expect(partida.usuarios["jugador4"].votos).toEqual(4);
			expect(partida.fase.nombre).toEqual("jugando");
		});

		it("Todos saltan su voto",function(){
			juego.lanzarVotacion(nick,codigo);
			expect(partida.obtenerListaJugadores().length).toEqual(4)
			expect(partida.fase.nombre).toEqual("votacion");
			juego.saltarVoto(nick,codigo);
			expect(partida.fase.nombre).toEqual("votacion");
			juego.saltarVoto("jugador3",codigo);
			expect(partida.fase.nombre).toEqual("votacion");
			juego.saltarVoto("jugador2",codigo);
			expect(partida.fase.nombre).toEqual("votacion");
			juego.saltarVoto("jugador4",codigo);
			expect(partida.obtenerListaJugadores().length).toEqual(4)
			expect(partida.fase.nombre).toEqual("jugando");
		});

		it("2 votan, 2 skipean",function(){
			juego.lanzarVotacion(nick,codigo);
			expect(partida.obtenerListaJugadores().length).toEqual(4)
			expect(partida.fase.nombre).toEqual("votacion");
			juego.saltarVoto(nick,codigo);
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar("jugador3",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.saltarVoto("jugador4",codigo);
			expect(partida.obtenerListaJugadores().length).toEqual(4)
			expect(partida.fase.nombre).toEqual("jugando");
		});

		it("3 votan, 1 skipean",function(){
			juego.lanzarVotacion(nick,codigo);
			expect(partida.obtenerListaJugadores().length).toEqual(4)
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar(nick,codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar("jugador3",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.saltarVoto("jugador4",codigo);
			expect(partida.usuarios["jugador4"].estado.nombre).toEqual("muerto");
			expect(partida.obtenerJugadoresVivos().length).toEqual(3)
			expect(partida.fase.nombre).toEqual("jugando");
		});

		it("jugador 2 intenta votar varias veces a jugador 4",function(){
			juego.lanzarVotacion(nick,codigo);
			expect(partida.obtenerListaJugadores().length).toEqual(4)
			expect(partida.fase.nombre).toEqual("votacion");

			expect(partida.usuarios["jugador4"].votos).toEqual(0);

			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			expect(partida.usuarios["jugador4"].votos).toEqual(1);


			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			expect(partida.usuarios["jugador4"].votos).toEqual(1);
			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			expect(partida.usuarios["jugador4"].votos).toEqual(1);
			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			expect(partida.usuarios["jugador4"].votos).toEqual(1);
			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			expect(partida.usuarios["jugador4"].votos).toEqual(1);
			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			expect(partida.usuarios["jugador4"].votos).toEqual(1);

			juego.votar(nick,codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar("jugador3",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.saltarVoto("jugador4",codigo);

			expect(partida.usuarios["jugador4"].estado.nombre).toEqual("muerto");
			expect(partida.obtenerJugadoresVivos().length).toEqual(3)
			expect(partida.fase.nombre).toEqual("jugando");
		});

		it("votacion inocente",function(){
			juego.lanzarVotacion(nick,codigo);
			
			partida.usuarios[nick].impostor=true;
			partida.usuarios["jugador3"].impostor=false;
			partida.usuarios["jugador2"].impostor=false;
			partida.usuarios["jugador4"].impostor=false;

			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar(nick,codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar("jugador3",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar("jugador2",codigo,"jugador4");
			expect(partida.fase.nombre).toEqual("votacion");
			juego.votar("jugador4",codigo,"jugador2");
			expect(partida.usuarios["jugador4"].estado.nombre).toEqual("muerto");
			expect(partida.fase.nombre).toEqual("jugando");
		});

		it("impostor pillado, gana el pueblo", function(){
			var nickImpostor;
			var partida=juego.partidas[codigo];
			usr = partida.usuarios["jugador1"];
			usr.lanzarVotacion();
			expect(partida.fase.nombre).toEqual("votacion");
			for (var key in partida.usuarios){
				if (partida.usuarios[key].impostor){
					nickImpostor = key;
				}
			}

			for (var key in partida.usuarios){
				if (partida.usuarios[key].impostor){
					//el impostor salta el voto
					partida.usuarios[key].saltarVoto()
				}
				else{
					//los demas le votan
					partida.usuarios[key].votar(nickImpostor);
				}
			}
			partida.comprobarVotacion();
			expect(partida.gananCiudadanos()).toBe(true);
			
		});
		
	})


		describe("Ataques",function(){
			var partida;
			beforeEach(function() {
				juego.unirAPartida(codigo,"jugador2");
				juego.unirAPartida(codigo,"jugador3");
				juego.unirAPartida(codigo,"jugador4");
				juego.iniciarPartida(nick,codigo);
				partida=juego.partidas[codigo];

				partida.usuarios[nick].impostor=true;
				partida.usuarios["jugador3"].impostor=false;
				partida.usuarios["jugador2"].impostor=false;
				partida.usuarios["jugador4"].impostor=false;

			});

			it("impostor ataca a un jugador",function(){
				expect(partida.obtenerJugadoresVivos().length).toEqual(4);
				juego.atacar(nick,codigo,"jugador3");
				expect(partida.usuarios["jugador3"].estado.nombre).toEqual("muerto");
				expect(partida.obtenerJugadoresVivos().length).toEqual(3);
			});

			it("impostor ataca a todos y gana",function(){	
				expect(partida.obtenerJugadoresVivos().length).toEqual(4);
				juego.atacar(nick,codigo,"jugador3");
				expect(partida.usuarios["jugador3"].estado.nombre).toEqual("muerto");
				expect(partida.obtenerJugadoresVivos().length).toEqual(3);
				expect(partida.fase.nombre).toEqual("jugando");
				juego.atacar(nick,codigo,"jugador2");
				expect(partida.usuarios["jugador2"].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("final");
			});

			it("impostor trata de atacar en una votacion",function(){
				juego.lanzarVotacion("jugador3",codigo);	
				juego.atacar(nick,codigo,"jugador3");
				expect(partida.usuarios["jugador3"].estado.nombre).not.toEqual("muerto");
				expect(partida.obtenerJugadoresVivos().length).toEqual(4);
			});

			it("impostor trata de atacar a un muerto",function(){
				juego.atacar(nick,codigo,"jugador3");
				expect(partida.usuarios["jugador3"].estado.nombre).toEqual("muerto");
				expect(partida.obtenerJugadoresVivos().length).toEqual(3);
				juego.atacar(nick,codigo,"jugador3");
				expect(partida.usuarios["jugador3"].estado.nombre).toEqual("muerto");
				expect(partida.obtenerJugadoresVivos().length).toEqual(3);
			});

			
		});

		describe("Tareas",function(){
			var partida;
			beforeEach(function() {
				juego.unirAPartida(codigo,"jugador2");
				juego.unirAPartida(codigo,"jugador3");
				juego.unirAPartida(codigo,"jugador4");
				juego.iniciarPartida(nick,codigo);
				partida=juego.partidas[codigo];

			});

			it("comprobar que todos tienen sus tareas y no estan completadas, excepto el impostor",function(){
				for (var key in partida.usuarios){
					if (partida.usuarios[key].impostor){
						expect(partida.usuarios[key].estadoTarea).toEqual("completada")
					}
					else{
						expect(partida.usuarios[key].estadoTarea).toEqual("no terminada")
					}
				}
			});
			
			it("todos los jugadores realizan su tarea y termina el juego",function(){
				for (var key in partida.usuarios){
					if (!partida.usuarios[key].impostor){
						expect(partida.fase.nombre).toEqual("jugando");
						partida.usuarios[key].realizarTarea()
						expect(partida.usuarios[key].estadoTarea).toEqual("completada")
						
					}
				}
				expect(partida.fase.nombre).toEqual("final");
			});

			it("jugador3 intenta realizar una tarea en una votacion",function(){
				partida.usuarios["jugador3"].estadoTarea = false;
				expect(partida.fase.nombre).toEqual("jugando");
				juego.lanzarVotacion("jugador3",codigo);	
				expect(partida.fase.nombre).toEqual("votacion");
				partida.realizarTarea("jugador3");
				console.log(partida.usuarios["jugador3"].estadoTarea);
				expect(partida.fase.nombre).toEqual("votacion");
				expect(partida.usuarios["jugador3"].estadoTarea).not.toEqual("completada");
			});

		});
	
  });
})