describe("El juego del impostor", function() {
  var juego;
  var usr;

  beforeEach(function() {
  	juego=new Juego();
  	usr=new Usuario("Pepe",juego);
  });

  it("comprobar valores iniciales del juego", function() {
  	expect(Object.keys(juego.partidas).length).toEqual(0);
  	expect(usr.nick).toEqual("Pepe");
  	expect(usr.juego).not.toBe(undefined);
  });

  describe("el usr Pepe crea una partida de 4 jugadores",function(){
	var codigo;
	beforeEach(function() {
	  	codigo=usr.crearPartida(4);
	  });

	it("se comprueba la partida",function(){ 	
	  	expect(codigo).not.toBe(undefined);
	  	expect(juego.partidas[codigo].nickOwner).toEqual(usr.nick);
	  	expect(juego.partidas[codigo].maximo).toEqual(4);
	  	expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	 	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(1);
	  });
	it("Comprobar partida si no se cumplen los numeros limites", function(){
		codigo1= usr.crearPartida(30);
		expect(codigo1).toEqual("error");
	  });


	it("Jugadores se unen a la partida",function(){
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"jugador1");
		juego.unirAPartida(codigo,"jugador2");	
		juego.unirAPartida(codigo,"jugador3");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
	  });

	it("Inicio Partida",function(){
		juego.unirAPartida(codigo,"jugador1");
		juego.unirAPartida(codigo,"jugador2");	
		juego.unirAPartida(codigo,"jugador3");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
		})
   });

  	describe("durante la partida...", function(){
  		var partida;
  		beforeEach(function(){
  			codigo=usr.crearPartida(4);
  			partida = juego.partidas[codigo];

  			juego.unirAPartida(codigo,"jugador1");
			juego.unirAPartida(codigo,"jugador2");	
			juego.unirAPartida(codigo,"jugador3");

			partida.iniciarPartida();

  		});
  		it("Jugadores abandonan la partida", function(){
		  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
		  	expect(num).toEqual(4);


  			usr.abandonarPartida();
  			var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  		expect(num).toEqual(3);

  			var j1 = juego.partidas[codigo].usuarios["jugador1"]
  			j1.abandonarPartida();
  			var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  		expect(num).toEqual(2);

	  		var j2 = juego.partidas[codigo].usuarios["jugador2"]
  			j2.abandonarPartida();
  			var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  		expect(num).toEqual(1);

	  		var j3 = juego.partidas[codigo].usuarios["jugador3"]
  			j3.abandonarPartida();
  			var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  		expect(num).toEqual(0);



  		});

  		it("comprobar que hay un impostor", function(){
  			var encontradoImpostor = false;

  			for (var key in partida.usuarios){
  				if (partida.usuarios[key].impostor){
  					encontradoImpostor = true;
  				}
  			}
  			expect(encontradoImpostor).toBe(true);
  		});

  		it("impostor ataca", function(){
  			var num=partida.numeroCiudadanosVivos();
		  	expect(num).toEqual(3);

  			var nickImpostor;
  			var nickVictima;
  			for (var key in partida.usuarios){
  				if (partida.usuarios[key].impostor){
  					nickImpostor = key;
  				}
  				else{
  					nickVictima = key;
  				}
  			}
  			var impostor = partida.usuarios[nickImpostor];

  			impostor.atacar(nickVictima);
  			var num=partida.numeroCiudadanosVivos();
		  	expect(num).toEqual(2);
  		});

  		it("impostor gana", function(){
  			var num=partida.numeroCiudadanosVivos();
		  	expect(num).toEqual(3);

  			var nickImpostor;
  			
  			for (var key in partida.usuarios){
  				if (partida.usuarios[key].impostor){
  					nickImpostor = key;
  				}
  			}
  			var impostor = partida.usuarios[nickImpostor];
  			for (var key in partida.usuarios){
  				if (!partida.usuarios[key].impostor){
  					impostor.atacar(key);
  				}
  			}

  			expect(partida.gananImpostores()).toBe(true);
  		});

  	})
})
