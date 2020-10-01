function Juego(){
	this.partidas={};
	this.crearPartida= function(num, owner){
		let codigo =this.obtenerCodigo();
		if(!this.partidas[codigo]){
			this.partidas[codigo] =new Partida(num, owner);
		}
	}
	this.unirAPartida=function(){
		//ToDo
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
	this.owner=owner;
	this.usuarios=[]; //el index 0 sera el owner

	this.agregarUsuario=function(nick){
		//comprobar el nick es unico
		//comprobar si maximo
	}
	this.agregarUsuario(owner);

}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}
