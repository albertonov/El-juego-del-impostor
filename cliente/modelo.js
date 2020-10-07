function Juego(){
	this.partidas={};
	this.crearPartida= function(num, owner){
		let codigo =this.obtenerCodigo();
		if(!this.partidas[codigo]){
			this.partidas[codigo] =new Partida(num, owner);
		}
	}
	this.unirAPartida=function(codigo, nick){
		if(this.partidas[codigo]){
			this.partidas[codigo].agregarUsuario(nick);
		}
	}
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let letras=cadena.split('');

		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,25)-1]);
		}
		return codigo.join('');
	}
}

function Partida(num, owner){
	this.maximo=num;
	this.nickOwner=owner;
	this.usuarios={}; //el index 0 sera el owner
	this.fase = new Inicial;

	this.agregarUsuario()=function(nick){
		this.fase.agregarUsuario(nick,this);
	}

	

	this.puedeAgregarUsuario=function(nick){
		//comprobar el nick es unico
		//comprobar si maximo

		if(Object.keys(this.usuarios).length<this.maximo){
			let nuevo=nick;
			let contador=1;
			while(this.usuarios[nuevo]){
				nuevo=nick+contador;
				contador=contador+1;
			}
			this.usuarios[nuevo]=new Usuario(nuevo);			
		}
		else{
			console.log("Maximo alcanzado");
		}
	}
	this.agregarUsuario(owner);

}

function Inicial(){
	this.agregarUsuario=function(nick, partida){
		partida.puedeAgregarUsuario(nick);
	}
}
function Jugando(){

}
function Final(){

}

function Usuario(){

}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}
