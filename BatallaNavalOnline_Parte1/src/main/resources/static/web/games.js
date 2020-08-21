var app = new Vue({
	el: '#app',
	data: {
		games: [],
		//array con players, tabla de puntuaciones
		players: [],
	},

	filters: {
		formatDate: function (value) {
			if (!value) return '';
			//recibe cadena,value, en formato fecha y lo covierte a tipo fecha, y recién puede aplicar format()
			return moment(value).format('MMMM Do YYYY, h:mm:ss a');
		}
	},
})

$.get("http://localhost:8080/api/games")
	.done(function (data) {
		//alert("Data Loaded: " + data);
		//ya obtengo el JSON
		app.games = data;

		//ME ESTA CAMBIANDO LOS DATOS QUE ME LLEGAN DEL JSON. AL HACER CADA RECARGA DEL HTML Y SE CONCUERDA AL RECARGAR EL API/GAMES (DUDA)
		getScoresList()

	})
	.fail(function (data) {
		alert("error");
	});

//FIJARSE SI SE PUEDE SIMPLIFICAR TODO ESTO USANDO FILTER, MAP, SORT , FUNCIONES LANDA - > CON LA IDEA QUE TENIA SI LO NECESITABA. Pero al cambiar la solución, ya no fue necesario usarlo.


function getScoresList() {
	//obtiene array de todos los player
	//uso misma variable para 2 cosas. Funciona como bandera(si existe) y como índice. Inicialmente en -1(no existe)
	var indice = -1;
	var id = -1;
	var games = app.games;
	var players = app.players;

	for (var i = 0; i < games.length; ++i) {
		for (var j = 0; j < games[i].gamePlayers.length; ++j) {
			id = games[i].gamePlayers[j].player.id;
			//Recorro array de players, para verificar si ya existe
			indice = players.findIndex(idPlayer => id == idPlayer.id);

			//agrego solo los que no estan ya en el array
			if (indice == -1) {
				players.push({
					id: games[i].gamePlayers[j].player.id,
					email: games[i].gamePlayers[j].player.email,
					//agrego campo total e inicializo  a cero para poder usarlo como acumulador
					//agrego campos faltantes, como contadores que si SE PUEDE hacer
					total: 0,
					cantWin: 0,
					cantLoss: 0,
					cantTie: 0,

				});
				//si acaba de hacer push es porque es el último elemento insertado
				indice = players.length - 1;
				console.log("Indice nuevo:" + indice);
				//LLAMA  A UNA FUNCION PARA NO PERDER EL PRIMER VALOR DE SCORE DE LA PRIMERA OCURRENCIA
				//paso games y players par que que reconozca  simplificación()
				addScore(indice, i, j)

			} else {
				//Si ya existe, debo guardar los valores del score del player.
				//TOMA INDICE DEL QUE YA EXISTE. PORQUE SI NO EXISTE, NO HACE NADA. Al indice se lo obtiene de (*)
				addScore(indice, i, j)
			}
			indice = -1;
		}
		//USAR indexById, indexOf, for each
		//No era la posicion correcta para volver a poner valor inicial de indice. Se lo vuelve a ubicar donde estaba. -> sino los resultados de la tabla de Scores era resultados que variaban en cada recarga de la pagina de html y ademas porque el JSON cambia en cada recarga. indice = -1;
	}
}


//A las funciones que hacian lo siguiente, se las pone en esta unica función. Van a ser 3 IF.
function addScore(indice, i, j) {
	//EN if (app.games[i].gamePlayers[j].player.id == indice && app.games[i].gamePlayers[j].player.score == 1) {}
	//NO NECESARIO PONER LA PRIMERA CONDICIÓN PORQUE YA CONOCE EL INDICE DEL ELEMENTO A MODIFICAR.

	//Para simplificar notación
	var score = app.games[i].gamePlayers[j].score.score;
	var player = app.players[indice];

	//NO PUEDO USAR PUSH PORQUE ESTO MODIFICA EL VALOR QUE YA TENIA, Y BORRA LO QUE YA TENIA. En tonces lo cambio accediendo al campo directamente  - > app.players[indice].push({cantWin: ++cantWin,}) player.total += score; ++player.cantWin;

	//USO OPERADOR TERNARIO
	score == 1.0 ? (player.total += score, ++player.cantWin) :
		(score == 0.0 ? (player.total += score, ++player.cantLoss) :
			(player.total += score, ++player.cantTie));
}
