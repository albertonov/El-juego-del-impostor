function ControlWeb($){

	



	this.mostrarCrearPartida=function(min){
		var cadena = '<div class="container">'
		cadena= cadena + '<br><br><div id="mostrarCP">';

		cadena=cadena+	'<div class="row">';
		cadena=cadena+		'<div class="form-group col-sm-2"> <br><br><br><br>';
		cadena=cadena+			'<label for="num">Número de jugadores:</label>';
		cadena=cadena+			'<input type="number" min="'+min+'" max="10" value="'+min+'" class="form-control" id="num">';
		cadena=cadena+		'</div>';
		cadena=cadena+		'<div class="form-group col-sm-2"> <br><br><br><br>';
		cadena=cadena+			'<input type="checkbox" id="isPrivate"> <label for="isPrivate">Partida Privada &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp;</label>';
		cadena=cadena+			'<input type="checkbox" id="isOscure"> <label for="isOscure">Niebla de guerra</label>';
		cadena=cadena+					'<select id="selectorMapa" class="form-select" aria-label="Default select example">';
		cadena=cadena+						'<option value="map1">Medieval Rampage</option>';
		cadena=cadena+						'<option value="map2">Tuxmon City Frenzy</option>';
		cadena=cadena+						'<option value="map3">Space´s perils</option>';
		cadena=cadena+					'</select>';
		cadena=cadena+		'</div>';

		cadena=cadena+		'<div class="container">';
		cadena=cadena+			'<div class="row ">';
		cadena=cadena+				'<div class=" col-sm-8">';
		cadena=cadena+					'<p class="text-center"><strong>Todos los mapas:</strong></p>';
		cadena=cadena+				'</div>';
		cadena=cadena+				'<div class=" col-sm-1">';
		cadena=cadena+					'<label>&nbsp;</label>';
		cadena=cadena+				'</div>';
		cadena=cadena+				'<div class="form-group col-sm-2">';
		cadena=cadena+					'<img src="cliente\\assets\\images\\medievil.png" class="img-thumbnail">';
		cadena=cadena+					'<p class="text-center"><strong>Medieval Rampage</strong></p>';
		cadena=cadena+				'</div>';
		cadena=cadena+				'<div class="form-group col-sm-2">';
		cadena=cadena+					'<img src="cliente\\assets\\images\\tuxemon-town.png" class="img-thumbnail">';
		cadena=cadena+					'<p class="text-center"><strong>Tuxmon City Frenzy</strong></p>';
		cadena=cadena+				'</div>';
		cadena=cadena+				'<div class="form-group col-sm-2">';
		cadena=cadena+					'<img src="cliente\\assets\\images\\naveespacial.png" class="img-thumbnail">';
		cadena=cadena+					'<p class="text-center"><strong>Space´s Perils</strong></p>';
		cadena=cadena+				'</div>';
		cadena=cadena+				'<div class=" col-sm-1">';
		cadena=cadena+					'<label>&nbsp;</label>';
		cadena=cadena+				'</div>';
		cadena=cadena+				'<div class=" col-sm-5">';
		cadena=cadena+					'<label>&nbsp;</label>';
		cadena=cadena+				'</div>';
		cadena=cadena+			'</div>';
		cadena=cadena+		'</div>';
		cadena=cadena+	'</div>';
		cadena=cadena+'<button type="button" id="btnCrear" class="btn btn-primary">Crear partida</button>';
		cadena=cadena+'</div>';
		cadena=cadena+'</div>';
		$('#crearPartida').append(cadena);

		$('#btnCrear').on('click',function(){
			var nick=$('#nick').val();
			var num=$("#num").val();
			var mapa=$("#selectorMapa").val();
			var isPrivate= $('#isPrivate').is(":checked")
			var oscure= $('#isOscure').is(":checked")
			console.log("NDG en CW" + oscure)
			if (nick){
				$("#menuPrincipal").remove();
				ws.crearPartida(nick,num, mapa, isPrivate, oscure);
				$('#nick').prop( "disabled", true );
			}
			else{
				$("#alerta").show();
			}
		});
	}

	this.mostrarListaPartidas=function(lista){
		$('#mostrarListaPartidas').remove();
		$('#unirme').remove();
		$('#unirsePartidaPrivada').remove();
		$('#avisoSinPartidas').remove();

		var cadena = ""
		cadena = cadena + '<div id="unirsePartidaPrivada" class="container"> ';
		cadena = cadena + 	'<div class="row ">';
		cadena = cadena + 		'<br><br><label for="codigoPartidaInput">Codigo:</label>';
		cadena = cadena + 		'<input type="text" id="codigoPartidaInput" name="codigoPartidaInput" placeholder="Código..."><br><br> ';
		cadena = cadena + 		'<input type="button" id="botonPartidaPrivada" class="btn btn-primary btn-md" value="Entrar">';
		cadena = cadena + 		'<hr />';
		cadena = cadena + 	'</div>';
		cadena = cadena + '</div>';

		if (Object.keys(lista).length == 0){
			cadena= cadena + '<div id="avisoSinPartidas"><h3>No hay partidas disponibles...</h3> <br><br>Parece que no hay ninguna partida en curso </div>';
		}
		else{

			cadena= cadena + '<div id="mostrarListaPartidas">';  
			cadena=cadena+'<div class="list-group" id="lista">';
			for(var i=0;i<lista.length;i++){
				var maximo=lista[i].maximo;
				var numJugadores=maximo-lista[i].huecos;
				cadena=cadena+'<a href="#" value="'+lista[i].codigo+'" class="list-group-item">'+lista[i].codigo+''+lista[i].mapa+'<span class="badge">'+numJugadores+'/'+maximo+'</span></a>';
			} 
			cadena=cadena+'</div>';
			cadena=cadena+'<input type="button" class="btn btn-primary btn-md" id="unirme" value="Unirme">';'</div>';
	
		}
	    $('#listaPartidas').append(cadena);
	    StoreValue = []; //Declare array
	    $(".list-group a").click(function(){
	        StoreValue = []; //clear array
	        StoreValue.push($(this).attr("value")); // add text to array
	    });

	    $('#unirme').click(function(){
	          var codigo="";
	          codigo=StoreValue[0];//$("#lista").val();
	          console.log(codigo);
	          var nick=$('#nick').val();
	          if (codigo && nick){
				$("#menuPrincipal").remove();
	            ws.unirAPartida(nick,codigo);
	          }
	    });

		$('#botonPartidaPrivada').click(function(){
			var codigo=$('#codigoPartidaInput').val();
			var nick=$('#nick').val();
			if (codigo && nick){
			  $("#menuPrincipal").remove();
			  ws.unirAPartida(nick,codigo);
			}
	  });
	  }

	this.mostrarEsperandoRival=function(codigo){
	    this.limpiar();
	    //$('#mER').remove();
	    var cadena='<div id="mER"><h3>Esperando rival - '+ codigo +'</h3>';
	    cadena=cadena+'<img id="gif" src="cliente/img/waiting.gif"><br>';
	    if (ws.owner){
			cadena=cadena+'<input type="button" class="btn btn-primary btn-md" id="iniciar" value="Iniciar partida"> &nbsp;&nbsp;';    
		}
		cadena = cadena + '<input type="button" class="btn btn-danger btn-md" id="abandonar" value="Abandonar partida">';  
		cadena=cadena+'</div>';
	    $('#esperando').append(cadena);
	    $('#iniciar').click(function(){
	    	ws.iniciarPartida();
	    });
		$('#abandonar').click(function(){
	    	ws.abandonarPartida();
			location.reload(true);
	    });
	  }

	this.mostrarUnirAPartida=function(lista){
		$('#mUAP').remove();
		var cadena='<div id="mUAP">';
		cadena=cadena+'<div class="list-group">';
 	    for(var i=0;i<lista.length;i++){
 		    cadena=cadena+'<a href="#" value="'+lista[i].codigo+'" class="list-group-item">'+lista[i].codigo+' huecos:'+lista[i].huecos+'</a>';
		}	
		cadena=cadena+'</div>';
		cadena=cadena+'<button type="button" id="btnUnir" class="btn btn-primary">Unir a partida</button>';
		cadena=cadena+'</div>';

		$('#unirAPartida').append(cadena);

		var StoreValue = [];
	    $(".list-group a").click(function(){
	        StoreValue = []; //clear array
	        StoreValue.push($(this).attr("value")); // add text to array
	    });

		$('#btnUnir').on('click',function(){
			var nick=$('#nick').val();
			var codigo=StoreValue[0];
			$("#nickForm").remove();
			$("#mUAP").remove();
			ws.unirAPartida(nick,codigo);
		});
	}

	this.mostrarListaJugadores=function(lista){
	  	$('#mostrarListaEsperando').remove();
	  	var cadena='<div id="mostrarListaEsperando"><h3>Lista Jugadores</h3>';
	  	cadena =cadena+'<ul class="list-group">';
	  	 for(var i=0;i<lista.length;i++){
	  		cadena=cadena+'<li class="list-group-item">'+lista[i].nick+'</li>';
	  	}
		cadena=cadena+'</ul></div>';
		$('#listaEsperando').append(cadena);
	}
	this.limpiar=function(){
		$('#mUAP').remove();
		$('#mCP').remove();
		$('#mostrarListaPartidas').remove();
		$('#mER').remove();
		$('#mostrarListaEsperando').remove();
		

	}

	this.mostrarModalSimple=function(msg){
		this.limpiarModal();
		var cadena="<p id='avisarImpostor'>"+msg+'</p>';
		$("#contenidoModal").append(cadena);
		$("#pie").append('<button type="button" id="cerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>');
		$('#modalGeneral').modal("show");
	}


	this.mostrarChatyTareas = function(){
		var cadena = ''
		cadena = cadena +  '<ul id="tareas" style=" background-color: #fffff; margin: 12px 12px 12px 12px; padding-inline-start: 0px; height:5600px; max-height:100px; overflow-x:hidden;"></ul>'
		cadena = cadena +  '<ul id="messages" style=" background-color:#f8f8f8; margin: 12px 12px 12px 12px; padding-inline-start: 0px; height:5600px; max-height:460px; overflow-x:hidden;"></ul>'
		cadena = cadena +  '<div class="row" style="margin: 12px 12px 12px 12px;">'
		cadena = cadena +  		'<div class="col-sm-8">'
		cadena = cadena +  			'<input type="text" class="form-control" id="inputMesage" placeholder="Escribe un mensaje">'
		cadena = cadena +  		'</div>'
		cadena = cadena +  		'<div class="col-sm-4">'
		cadena = cadena +  			'<button type="button" class="btn btn-secondary" id="btnEnviar" >Enviar</button>'
		cadena = cadena +  		'</div>'
		cadena = cadena +  '</div>'
		
		$("#chat").append(cadena);

		$('#btnEnviar').on('click',function(){
			var msg = 	$("#inputMesage").val();
			console.log("enviando mensaje "+ msg)
			ws.enviarMensaje(msg);
			$("#inputMesage").clear();
		});
	}

	this.anadirMensajeChat = function (listaMSG){
		$("#messages").empty()
		cadena = ''
		for(var i=0;i<listaMSG.length;i++){
			cadena=cadena+'<li class="list-group-item"  style=" margin: 0 0 3px 0;">'+listaMSG[i]+'</li>';
		}
		$("#messages").append(cadena);
	}
	this.anadirTareas = function (listaTareas, isImpostor){
		console.log("anadirtareas" + listaTareas)
		$("#tareas").empty()
		cadena = ''
		if (isImpostor){
			cadena = cadena + 'Eres el <p style="color:red; display:inline">impostor</p><br><br>Acaba con los ciudadanos!'
		}
		else{
			for(var i=0;i<listaTareas.length;i++){
				cadena = cadena + 'Eres un <p style=" display:inline; color:blue"">ciudadano</p>. <br><br>Cumple con las siguientes tareas para ganar el juego:'
				cadena=cadena+ "<strong> " + listaTareas[i] + "</strong>";
			}
		}

		$("#tareas").append(cadena);
	}

	this.mostrarModalTarea=function(infoTarea){
		this.limpiarModal();
		//ws.getTareaInfo(tarea, mapa)
		$("#contenidoModal").append(infoTarea[1]);
		$("#pie").append('<button type="button" id="validarRespuesta" class="btn btn-secondary">Validar respuesta</button>');
		$('#modalGeneral').modal("show");
		$("#contenidoModal").append('<br><br>');
		$("#contenidoModal").append('<input type="text" class="form-control" id="solucionInput" placeholder="Solucion...">');

		$('#validarRespuesta').on('click',function(){
			if ($('#solucionInput').val() == ws.infoTarea[2]){
				ws.realizarTarea(); 
				$("#validarRespuesta").remove()
				$("#pie").append('<button type="button" id="cerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>');

			}
			else{
				console.log("RESPUESTA INCORRECTA")
			}
		});

	}
	this.addInfoTarea=function(info){
		$("#contenidoModal").append(info[0]);
		$("#contenidoModal").append(info[1]);
	}



	this.mostrarModalVotacion=function(lista){
		this.limpiarModal();
		var cadena='<div id="votacion"><h3>Votación</h3>';		
		cadena =cadena+'<div class="input-group">';
	  	 for(var i=0;i<lista.length;i++){
	  		cadena=cadena+'<div><input type="radio" name="optradio" value="'+lista[i].nick+'"> '+lista[i].nick+'</div>';
	  	}
	  	cadena=cadena+'<div><input type="radio" name="optradio" value="-1"> Saltar voto</div>';
		cadena=cadena+'</div>';
		
		$("#contenidoModal").append(cadena);
		$("#pie").append('<button type="button" id="votar" class="btn btn-secondary" >Votar</button>');
		$('#modalGeneral').modal("show");
		
		var sospechoso=undefined;
		$('.input-group input').on('change', function() {
		   sospechoso=$('input[name=optradio]:checked', '.input-group').val(); 
		});
		
		$('#votar').click(function(){
	    	if (sospechoso!="-1"){
		    	ws.votar(sospechoso);
		    }
		    else{
	    		ws.saltarVoto();
	    	}
	    });

	}

	this.limpiarModal=function(){
		$('#avisarImpostor').remove();
		$('#tarea').remove();
		$('#cerrar').remove();
		$('#votacion').remove();
		$('#votar').remove();
	}

}