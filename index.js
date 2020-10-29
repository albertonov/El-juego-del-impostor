var fs = require("fs");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var modelo=require("./servidor/modelo.js");

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var juego=new modelo.Juego();

app.get('/', function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html");   
    response.setHeader("Content-type", "text/html");
    response.send(contenido);    
});

app.get("/crearPartida/:nick/:num",function(request,response){
	var nick=request.params.nick;
	var num=parseInt(request.params.num);
	//ojo, nick nulo o numero nulo
	//var num=4;
	var usr=new modelo.Usuario(nick);
	var codigo=juego.crearPartida(num,usr);

	response.send({"codigo":codigo});
});

app.get("/unirAPartida/:nick/:codigo",function(request,response){
	var nick=request.params.nick;
	var codigo=request.params.codigo;
	var res=juego.unirAPartida(codigo,nick);
	response.send({"res":res});
});

app.get("/listaPartidas",function(request,response){
	var res=juego.obtenerCodigosPartidas();	
	response.send(res);
});

app.get("/iniciarPartida/:nick/:codigo",function(request,response){
	var nick=request.params.nick;
	var codigo=request.params.codigo;
	var partida = juego.partidas[codigo];
	var usr = partida.usuarios[nick]
	res = usr.iniciarPartida();
	response.send();
});

server.listen(app.get('port'), function () {
    console.log('Node is listening on port ', app.get('port'));
});

// app.listen(app.get('port'), function () {
//      console.log('Node app is running on port', app.get('port'));
// });
