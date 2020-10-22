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
})
