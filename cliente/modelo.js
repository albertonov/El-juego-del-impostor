function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		//comprobar los limites de num
		if(num>10 || num<4){
			console.log("Introducir un maximo de 10 jugadores");
			return "error";
		}
		else{
			let codigo=this.obtenerCodigo();
			if (!this.partidas[codigo]){
				this.partidas[codigo]=new Partida(num,owner.nick);
				owner.partida=this.partidas[codigo];
			}
			return codigo;
		}
	}

	this.unirAPartida=function(codigo,nick){
		if (this.partidas[codigo]){
			this.partidas[codigo].agregarUsuario(nick);
		}
	}
	
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}
	this.eliminarPartida = function(codigo){
		delete this.partidas[codigo];
	}
}

function Partida(num,owner){
	this.maximo=num;
	this.nickOwner=owner;
	this.fase=new Inicial();
	this.usuarios={};
	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this);
	}
	this.puedeAgregarUsuario=function(nick){
		let nuevo=nick;
		let contador=1;
		while(this.usuarios[nuevo]){
			nuevo=nick+contador;
			contador=contador+1;
		}
		this.usuarios[nuevo]=new Usuario(nuevo);
		//this.comprobarMinimo();
		this.usuarios[nuevo].partida=this;
	}

	this.puedeIniciarPartida=function(){
		this.asignarEncargos();
		this.asignarImpostor();
		this.fase = new Jugando();
	}
	this.comprobarMinimo=function(){
		return this.numeroJugadores()>=4
	}
	this.comprobarMaximo=function(){
		return this.numeroJugadores()<this.maximo
	}
	this.numeroJugadores=function(){
		return Object.keys(this.usuarios).length;
	}
	this.iniciarPartida=function(){
		this.fase.iniciarPartida(this);
	}
	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}
	this.puedeAbandonarPartida=function(nick){
		this.eliminarUsuario(nick);
		if(!this.comprobarMinimo()){
			this.fase=new Inicial();
		}

	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.asignarEncargos=function(){
		encargos = ["mobiliario", "basuras", "jardin", "huerto"];
		cont = 0;
		keys = Object.keys(this.usuarios);
		for (var key in this.usuarios) {
			this.usuarios[key].encargo = encargos[cont];
			cont = cont +1;
			
		}
	}

	this.asignarImpostor=function(){
		//numusuarios=Object.keys(this.usuarios).lenght;
		let numusr = randomInt(1,this.numeroJugadores()-1);
		let cont = 0;
		

		//sol rapida para salir del paso (tiene que haber otra mejor)

		for (var key in this.usuarios) {
			if (cont == numusr){
				this.usuarios[key].impostor = true;
			}
			cont = cont +1;
		}
	}
	this.agregarUsuario(owner);

	this.numeroImpostoresVivos=function(){
		let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].impostor && this.usuarios[key].estado.nombre=="vivo"){
				cont++;
			}
		}
		return cont;
	}
	this.numeroCiudadanosVivos=function(){
		let cont=0;
		for (var key in this.usuarios) {
			if (!this.usuarios[key].impostor && this.usuarios[key].estado.nombre=="vivo"){
				cont++;
			}
		}
		return cont;
	}

	this.gananImpostores=function(){
	//comprobar si impostores vivos>=ciudadanos vivos
	//en caso de cierto: cambiar fase a final (fuera)
		if(this.numeroImpostoresVivos>= this.numeroCiudadanosVivos){
			return true;
		}
		return false;
	}
	this.gananCiudadanos=function(){
		return (numeroImpostoresVivos() == 0);
	}

	this.masVotado=function(){
	//max=0;
	//usr=undefined;
	//Recorre los usuarios vivos y (para cada usr comprueba si max<votos de ese usuario) => en caso cierto, actualiza max y guarda el usr
	//Devuelve usr
		let max = 0;
		let usr = undefined;

		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo"){
				if (max<this.usuarios[key].votos){
					max = this.usuarios[key].votos;
					usr = this.usuarios[key];
				}
			}
		}
		return usr;
	}
	this.numeroSkips=function(){
	//numero de usuarios que han hecho skip
	//recorrrer usuarios vivos, incrementar contador si skip de ese usuario es true
		nskips=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo"){
				if (this.usuarios[key].skip){
					nskips = nskips +1;
				}
			}
		}
		return nskips;
	}
	this.reiniciarContadores=function(){
	//recorrer usuarios vivos y poner votos a 0 y skip a false
		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo"){
				this.usuarios[key].votos = 0;
				this.usuarios[key].skip = false;
			}
		}
	}

	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			this.estado = new Final();
		}
		else if (this.gananCiudadanos()){
			this.estado = new Final();
		}
	}

	this.comprobarVotacion=function(){
		let elegido=this.masVotado();
		if (elegido && elegido.votos>this.numeroSkips()){
			elegido.esAtacado();
		}
	}


}

function Inicial(){
	this.nombre="inicial";
	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()){
			partida.fase=new Completado();
		}		
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
		//partida.eliminarUsuario(nick);
		//comprobar si no quedan usr
	}
}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		//llame a puedeIciarPartida();
		//partida.fase=new Jugando();
		//asignar encargos: secuencialmente a todos los usr
		//asignar impostor: dado el array usuario (Objectc.keys)

		partida.puedeIniciarPartida();


	}
	this.agregarUsuario=function(nick,partida){
		if (partida.comprobarMaximo()){
			partida.puedeAgregarUsuario(nick);
		}
		else{
			console.log("Lo siento, numero máximo")
		}
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (!partida.comprobarMinimo()){
			partida.fase=new Inicial();
		}
	}
}

function Jugando(){
	this.nombre="jugando";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		//comprobar si termina la partida
	}
	this.atacarUsuario = function(nick, partida, nickAtacante){
		partida.usuarios[nick].esAtacadoPor(nickAtacante);
	}
}

function Final(){
	this.final="final";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ha terminado");
	}
	this.iniciarPartida=function(partida){

	}
	this.abandonarPartida=function(nick,partida){
		//absurdo
	}
}

function Vivo(){
	this.puedeSerAtacadoPor = function(partida,nick,nickAtacante){
		partida[nick].puedeSerAtacadoPor(nickAtacante);
	}
}

function Muerto(){
	this.puedeSerAtacadoPor = function(partida,nick,nickAtacante){
		console.log("Los muertos no pueden ser atacados");
	}
}

function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.partida;
	this.encargo = "";
	this.impostor = false;
	this.estado = new Vivo();
	this.votos = 0;
	this.skip = false;
	this.haVotado=false;

	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
		if(this.partida.numeroJugadores()<=0){
			console.log(this.nick, " era el ultimo jugador");
		}
	}
	this.atacarUsuario = function(nick){
		if (this.impostor){
			this.partida.fase.atacarUsuario(nick, this, this.nick);
		}
		else {
			console.log("No eres el impostor");
		}
		
	}


	this.esAtacadoPor = function(nickAtacante){
		this.estado.puedeSerAtacadoPor(this, this.nick, nickAtacante);
	}

	this.puedeSerAtacadoPor = function(nickAtacante){
		this.estado = new Muerto();
		console.log(nickAtacante, " mata a ", this.nick);
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function inicio(){
	juego = new Juego();
	var usr = new Usuario("pepe", juego);
	usr.juego=juego;
	var codigo = usr.crearPartida(4);
	var usr2 = new Usuario("perico", juego);
	var usr3 = new Usuario("antonio", juego);
	var usr4 = new Usuario("paquito", juego);

	juego.unirAPartida(codigo,usr2);
	juego.unirAPartida(codigo,usr3);
	juego.unirAPartida(codigo,usr4);
	//juego.unirAPartida(codigo,"bartolo");

	usr.iniciarPartida();
}