function ClienteRest(){
	this.crearPartida=function(nick,num){
		$.getJSON("/crearPartida/"+nick+"/"+num,function(data){    
    		console.log(data);
		});
	}
	this.unirAPartida=function(nick,codigo){
		$.getJSON("/unirAPartida/"+nick+"/"+codigo,function(data){    
    		console.log(data);
		});
	}
}