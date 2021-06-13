var cad = require('./cad.js');

function Juego(min, test){
	this.cad = new cad.Cad();
	this.min=min;
	this.partidas={};
	this.test = test;
	this.crearPartida=function(num,owner, mapa, isPrivate, isOscure){
		let codigo;
		console.log(this.numeroValido(num) + " " + num + " " + min + "|" + isOscure)
		if (!this.partidas[codigo] && this.numeroValido(num)){
			codigo=this.obtenerCodigo();
			this.partidas[codigo]=new Partida(num,owner,codigo,mapa, isPrivate,isOscure, this);
			if(test == "noTest"){
				var fase = this.partidas[codigo].fase.nombre;
				this.cad.insertarPartida({"nick": owner, "numeroJugadores": num, "codigo": codigo, "mapa":mapa, "nieblaDeGuerra":isOscure,  "fase":fase}, function(res){})	
			}
			return codigo;
		}
		else{
			return "fallo"
		}
	}
	this.numeroValido=function(num){
		return (num>=this.min && num<=10)
	}

	this.unirAPartida=function(codigo,nick){
		if (this.partidas[codigo]){
			return this.partidas[codigo].agregarUsuario(nick);
		}
		else return -1;
	}


	this.listaPartidas=function(){
		let listaPartidas=[];
		for (var codigo in this.partidas){
			let partida=this.partidas[codigo];
			let owner=partida.nickOwner;
			listaPartidas.push({"codigo":codigo,"owner":owner});
		}
		return listaPartidas;
	}


	
	this.listaPartidasDisponibles=function(){
		var listaPartidas=[];
		var huecos=0;
		var max=0;
		for (var codigo in this.partidas){
			var partida=this.partidas[codigo];
			huecos=partida.obtenerHuecos();
			max=partida.maximo;
			if (huecos>0 && !partida.isPrivate)
			{
			  listaPartidas.push({"codigo":codigo,"huecos":huecos,"maximo":max, "fase": partida.fase});
			}
		}
		return listaPartidas;
	}
	this.iniciarPartida=function(nick,codigo){
		if (nick== this.partidas[codigo].nickOwner){
			this.partidas[codigo].iniciarPartida();
		}
	}
	this.obtenerListaJugadores=function(codigo){
		return this.partidas[codigo].obtenerListaJugadores();
	}
	this.obtenerEncargo=function(nick,codigo){
		let encargo=this.partidas[codigo].usuarios[nick].encargo;
		let impostor=this.partidas[codigo].usuarios[nick].impostor;
		return {"nick":nick,
				"encargo":encargo,
				"impostor":impostor};
	}

	this.eliminarPartida=function(codigo){
		delete this.partidas[codigo];
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

	this.atacar=function(nick,codigo,inocente){
		let usr=this.partidas[codigo].usuarios[nick];
		usr.atacar(inocente);
	}



	this.realizarTarea=function(nick,codigo){
		this.partidas[codigo].realizarTarea(nick);
	}

	this.lanzarVotacion=function(nick,codigo){
		let usr=this.partidas[codigo].usuarios[nick];
		usr.lanzarVotacion();
	}

	this.saltarVoto=function(nick,codigo){
		let usr=this.partidas[codigo].usuarios[nick];
		usr.saltarVoto();
	}

	this.votar=function(nick,codigo,sospechoso){
		let usr=this.partidas[codigo].usuarios[nick];
		usr.votar(sospechoso);
	}

	this.getTareaInfo = function(tarea, mapa){
		console.log("AQUI LLEGA"+tarea + mapa)
		if (mapa == "map1"){
			var preguntasMapa1 = {
				"calles":
					['pregunta1', 'Te encuentras en la herreria. Aun eres un aprendiz, pero has visto muchas peliculas y seguro que sabes forjar un anillo que te haga invisible. <br>Pero por el momento, aun tienes que aprender que <strong>para hacer bronce, el cobre se mezcla con...</strong>' , 'Estaño' ],
				
				"mobiliario":
					['pregunta2', 'Te encuentras en el mercado. Un beduino llega de tierras lejanas, pero parece que no se entera de como se gestionan los pesos y precios de esta aldea. <br>- No se lo que es una arroba. <br>Tu, como experto comerciante que eres, sabes que <strong> una arroba equivale a X libras</strong>' , '25' ],
				
				"basuras":
					['pregunta3', 'Quizas no sea el encargo más interesante del mundo, pero al menos te licenciastes en geografia. Y por supuesto, sabes que el rio más largo del mundo es el rio...' , 'Amazonas' ],

			}

			return preguntasMapa1[tarea];		
						
		}
		else if (mapa == "map2"){
			var preguntasMapa2 = {
				"calles":
					['pregunta1', 'El Bernabeu esta ubicado en el...' , 'Paseo de la Castellana' ],
				
				"mobiliario":
					['pregunta2', 'Es venta y no se vende, es Ana, pero no es gente. Soy una...' , 'Ventana' ],
				
				"basuras":
					['pregunta3', 'El plastico va al contenedor...' , 'Amarillo' ],

			}
			return preguntasMapa2[tarea];		
		}
		else if (mapa == "map3"){
			var preguntasMapa3 = {
				"calles":
					['pregunta1', 'NAVEGACION' , 'Paseo de la Castellana' ],
				
				"mobiliario":
					['pregunta2', 'ESCANER' , 'Ventana' ],
				
				"basuras":
					['pregunta3', 'ELECTRICIDAD' , 'Amarillo' ],

			}
			return preguntasMapa3[tarea];			
		}
	}
	if (test == "noTest"){
		this.cad.connect(function(db){
			console.log("Conectado a Atlas")
		});
	}


	this.partidasFinalizadas=function(admin,callback){
		if(admin=="pass1234" && this.test=="noTest"){
			this.cad.obtenerPartidaCriterio({fase:"final"},function(lista){
				if(lista){
					callback(lista);
				}else{
					callback({})
				}
			});
		}
	}
}

function Partida(num,owner,codigo,mapa, isPrivate, isOscure, juego){
	this.maximo=num;
	this.nickOwner=owner;
	this.codigo=codigo;
	this.juego=juego;
	this.fase=new Inicial();
	this.usuarios={};
	this.elegido="nadie";
	this.encargos=["mobiliario","basuras","calles"];
	this.mapa = mapa;
	this.isPrivate = isPrivate;
	this.niebla = isOscure;
	this.mensajes = [];

	this.agregarMensaje = function(msg){
		return this.mensajes.push(msg);
	}

	this.getMensajes = function(){
		return this.mensajes;
	}

	this.getMapa = function(){
		return this.mapa;
	}

	this.agregarUsuario=function(nick){
		return this.fase.agregarUsuario(nick,this)
	}

	this.puedeAgregarUsuario=function(nick){
		let newNick=nick;
		let contador=1;
		while(this.usuarios[newNick]){
			newNick=nick+contador;
			contador=contador+1;
		}

		this.usuarios[newNick] = new Usuario(newNick);
		this.usuarios[newNick].partida = this;		
		let numeroJugador = (this.numeroJugadores()-1);

		this.usuarios[newNick].numJugador=numeroJugador
		if (this.obtenerHuecos() == 0){
			this.fase=new Completado();
		}

		return {"codigo":this.codigo,
				"nick":newNick,
				"numJugador":numeroJugador};
	}
	
	this.obtenerListaJugadores=function(){
		var listaJugadores=[]
		for (var key in this.usuarios){
			var numero=this.usuarios[key].numJugador;
			listaJugadores.push({nick:key,numJugador:numero});
		}
		return listaJugadores;
	}

	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}

	this.puedeAbandonarPartida=function(nick){
		this.eliminarUsuario(nick);
		if (!this.comprobarMinimo()){
			this.fase=new Inicial();
		}
		if (this.numeroJugadores()<=0){
			this.juego.eliminarPartida(this.codigo);
		}
	}

	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}

	this.obtenerJugadoresVivos=function(){
		var jugadoresVivos=[]
		for (var key in this.usuarios){
			if (this.usuarios[key].estadoVivo()){
				var numero=this.usuarios[key].numJugador;
				jugadoresVivos.push({nick:key,numJugador:numero});
			}
		}
		return jugadoresVivos;
	}

	this.obtenerHuecos=function(){
		return this.maximo-this.numeroJugadores();
	}

	this.numeroJugadores=function(){
		return Object.keys(this.usuarios).length;
	}

	this.iniciarPartida=function(){
		this.fase.iniciarPartida(this);
	}

	this.puedeIniciarPartida=function(){
		this.asignarEncargos();
		this.asignarImpostor();
		this.fase=new Jugando();
	}


	this.comprobarMinimo=function(){
		return this.numeroJugadores()>=this.juego.min;
	}

	this.comprobarMaximo=function(){
		return this.numeroJugadores()<this.maximo;
	}


	this.atacar=function(inocente){
		this.fase.atacar(inocente,this);
	}

	this.puedeAtacar=function(inocente){
		this.usuarios[inocente].esAtacado();
	}


	this.asignarEncargos=function(){
		let ind=0;
		for (var key in this.usuarios) {
		    this.usuarios[key].encargo=this.encargos[ind];
		    ind=(ind+1)%(this.encargos.length)
		}
	}
	
	this.asignarImpostor=function(){
		let listaNicks=Object.keys(this.usuarios);
		let oneNumber=randomInt(0,listaNicks.length-1);
		let nick=listaNicks[oneNumber];
		this.usuarios[nick].asignarImpostor();
	}



	this.numeroImpostoresVivos=function(){
		let nImpostoresVivos=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].impostor && this.usuarios[key].estadoVivo()){
				nImpostoresVivos++;
			}
		}
		return nImpostoresVivos;
	}

	this.numeroCiudadanosVivos=function(){
		let nCiudadanosVivos=0;
		for (var key in this.usuarios) {
			if (!this.usuarios[key].impostor &&  this.usuarios[key].estadoVivo() ){
				nCiudadanosVivos++;
			}
		}
		return nCiudadanosVivos;
	}

	this.numeroCiudadanos=function(){
		let nCiudadanos=0;
		for (var key in this.usuarios) {
			if (!this.usuarios[key].impostor){
				nCiudadanos++;
			}
		}
		return nCiudadanos;
	}

	this.gananImpostores=function(){
		return (this.numeroImpostoresVivos()>=this.numeroCiudadanosVivos());
	}

	this.gananCiudadanos=function(){
		return (this.numeroImpostoresVivos()==0);
	}


	this.reiniciarContadoresVotaciones=function(){
		this.elegido="nadie";
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoVivo()){
				this.usuarios[key].reiniciarContadoresVotaciones();
			}
		}
	}


	this.votar=function(sospechoso){
		this.fase.votar(sospechoso,this)
	}

	this.puedeVotar=function(sospechoso){
		this.usuarios[sospechoso].esVotado();
		this.comprobarVotacion();
	}

	this.todosHanVotado=function(){
		let res=true;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoVivo() && !this.usuarios[key].haVotado){
				res=false;
				break;
			}
		}
		return res;
	}

	this.masVotado=function(){
		let votado=undefined;
		let cont=0;
		let max=1;

		for (var key in this.usuarios) {
			if (max<this.usuarios[key].votos){
				max=this.usuarios[key].votos;
				votado=this.usuarios[key];
			}
		}

		for (var key in this.usuarios) {
			if (max==this.usuarios[key].votos){
				cont++;
			}
		}

		if (cont>1){
			votado=undefined;
		}
		return votado;
	}

	this.numeroSkips=function(){
		let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoVivo() && this.usuarios[key].skip){
				cont++;
			}
		}
		return cont;
	}


	this.listaHanVotado=function(){
		var lista=[];
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoVivo() && this.usuarios[key].haVotado){
				lista.push(key);
			}
		}
		return lista;
	}

	this.comprobarVotacion=function(){
		if (this.todosHanVotado()){
			let elegido=this.masVotado();
			if (elegido && elegido.votos>this.numeroSkips()){
				console.log("matando a " + elegido)
				elegido.esAtacado();
				this.elegido=elegido.nick;
			}
			else {
				console.log("no hay victima")
			}
			this.finalVotacion();
		}
	}

	this.finalVotacion=function(){
		this.fase=new Jugando();
		this.comprobarFinal();
	}



	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			console.log("GANAN IMPOSTORES")
			this.finPartida();
		}
		else if (this.gananCiudadanos()){
			console.log("GANAN CIUDADANOS")
			this.finPartida();
		}
	}

	this.finPartida=function(){
		this.fase=new Final();
		if(this.juego.test == "noTest"){
			var fase = this.fase.nombre;
			this.juego.cad.insertarPartida({"nick": this.nickOwner, "numeroJugadores": this.num, "codigo": this.codigo, "mapa":this.mapa,  "fase":fase, "mensajes":this.mensajes }, function(res){})	
		}
	}


	this.lanzarVotacion=function(){
		this.fase.lanzarVotacion(this);
	}

	this.puedeLanzarVotacion=function(){
		this.reiniciarContadoresVotaciones();
		this.fase=new Votacion();
	}

	this.realizarTarea=function(nick){
		this.fase.realizarTarea(nick,this);
	}

	this.puedeRealizarTarea=function(nick){
		this.usuarios[nick].realizarTarea();
	}

	this.tareaTerminada=function(){
		if (this.comprobarTareasTerminadas()){
			this.finPartida();
		}
	}
	
	this.comprobarTareasTerminadas=function(){
		let res=true;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoTarea!="completada"){
				res=false;
				break;
			}
		}
		return res;		
	}
	this.obtenerPercentTarea=function(nick){
		return this.usuarios[nick].obtenerPercentTarea();
	}
	this.obtenerPercentGlobal=function(){
		var total=0;
		for(var key in this.usuarios){
			if (!this.usuarios[key].impostor)
			{
				total=total+this.obtenerPercentTarea(key);
			}
		}
		total=total/this.numeroCiudadanos();
		return total;
	}
	this.agregarUsuario(owner);
}

function Inicial(){
	this.nombre="inicial";
	this.agregarUsuario=function(nick,partida){
		return partida.puedeAgregarUsuario(nick);
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(inocente){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.lanzarVotacion=function(){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.realizarTarea=function(){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		partida.puedeIniciarPartida();
	}
	this.agregarUsuario=function(nick,partida){
		if (partida.comprobarMaximo()){
			return partida.puedeAgregarUsuario(nick);
		}
		else{
			return -1
		}
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(inocente){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.lanzarVotacion=function(){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.realizarTarea=function(){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
}

function Jugando(){
	this.nombre="jugando";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha comenzado");
		return -1
	}
	this.iniciarPartida=function(partida){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(inocente,partida){
		partida.puedeAtacar(inocente);
	}
	this.lanzarVotacion=function(partida){
		partida.puedeLanzarVotacion();
	}
	this.votar=function(sospechoso,partida){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.realizarTarea=function(nick,partida){
		partida.puedeRealizarTarea(nick);
	}
}

function Votacion(){
	this.nombre="votacion";
	this.agregarUsuario=function(nick,partida){return -1}
	this.iniciarPartida=function(partida){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(inocente){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.lanzarVotacion=function(){}
	this.votar=function(sospechoso,partida){
		partida.puedeVotar(sospechoso);
	}
	this.realizarTarea=function(){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
}

function Final(){
	this.nombre="final";
	this.agregarUsuario=function(nick,partida){return -1}
	this.iniciarPartida=function(partida){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(inocente){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.lanzarVotacion=function(){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
	this.realizarTarea=function(){
		console.log("No deberias de poder realizar esta accion en esta fase...")
	}
}

function Usuario(nick){
	this.nick=nick;
	this.partida;
	this.impostor=false;
	this.numJugador;
	this.encargo="ninguno";
	this.estado=new Vivo();
	this.votos=0;
	this.skip=false;
	this.haVotado=false;
	this.realizado=0;
	this.estadoTarea="no terminada";
	this.maxTarea=3; 
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.estadoVivo=function(){
		return this.estado.estadoVivo();
	}
	this.asignarImpostor=function(){
		this.impostor=true;
		this.estadoTarea="completada";
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
		if (this.partida.numeroJugadores()<=0){
			console.log(this.nick," era el último");
		}
	}
	this.atacar=function(inocente){
		if (this.impostor && !(this.nick==inocente)){
			this.partida.atacar(inocente);
		}
	}
	this.esAtacado=function(){
		this.estado.esAtacado(this);
	}
	this.saltarVoto=function(){
		if(this.haVotado){
			console.log(this.nick + " ya ha votado!")
		}
		else{
			this.skip=true;
			this.haVotado=true;
			this.partida.comprobarVotacion();
		}

	}
	this.lanzarVotacion=function(){
		this.estado.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.partida.lanzarVotacion();
	}
	this.votar=function(sospechoso){
		if(this.haVotado){
			console.log(this.nick + " ya ha votado!")
		}
		else{
			this.haVotado=true;
			this.partida.votar(sospechoso);
		}

	}
	this.esVotado=function(){
		this.votos++;
		console.log(this.nick + "recibe un voto" + this.votos)
	}
	this.reiniciarContadoresVotaciones=function(){
		this.votos=0;
		this.haVotado=false;
		this.skip=false;
	}
	this.realizarTarea=function(){
		this.estadoTarea="completada";
		this.partida.tareaTerminada();
		console.log("usuario "+this.nick+" realiza tarea "+this.encargo);
	}
	this.obtenerPercentTarea=function(){
		return 100*(this.realizado/this.maxTarea);
	}
}

function Vivo(){
	this.nombre="vivo";
	this.esAtacado=function(usr){
		console.log(usr + " muere")
		usr.estado=new Muerto();
		usr.partida.comprobarFinal();
	}
	this.lanzarVotacion=function(usr){
		usr.puedeLanzarVotacion();
	}
	this.estadoVivo=function(){
		return true;
	}
}

function Muerto(){
	this.nombre="muerto";
	this.esAtacado=function(usr){}
	this.lanzarVotacion=function(usr){}
	this.estadoVivo=function(){
		return false;
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}



module.exports.Juego=Juego;
module.exports.Usuario=Usuario;