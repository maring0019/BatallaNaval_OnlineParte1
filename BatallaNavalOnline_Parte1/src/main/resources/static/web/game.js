var app = new Vue({
	el: '#app',
	data: {
		//Datos del encabezado de la tabla(nombres columnas)
		columnHeaders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		//Datos de la primera columna de la tabla (nombres de filas)
		rowHeaders: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
		//Necesario numérico para pasarlo para array
		valor: -1,
		url: '',
		game: {},
		viewer: {},
		otherPlayer: {},
		shipLocations: [],
		salvoLocations: [],
		shipSalvoLocations: [],
		// Array de objetos. o Hacer un map.
	},
	methods: {
		//Esto también se podría poner en el html
		//Uso función landa porque no toma los valores de rowHeader+columnHeader
		getTurnoSalvo: function (celda) {
			var index = this.salvoLocations.findIndex(salvo => salvo.location == celda);
			if (index != -1) {
				console.log(this.salvoLocations[index].turno);
				return this.salvoLocations[index].turno;
			} else
				return -1;
		},
		getTurnoShipSalvo: function (celda) {
			var index = this.shipSalvoLocations.findIndex(salvo => salvo.location == celda);
			if (index != -1) {
				console.log(this.shipSalvoLocations[index].turno);
				return this.shipSalvoLocations[index].turno;
			} else
				return -1;
		}
	}
})

getParameter()

// Usar este método porque puedo tener más de un paramétro 
function getParameter() {
	const urlParams = new URLSearchParams(window.location.search);
	const myParam = urlParams.get('Gp');
	app.valor = myParam;
	//pasar valor con nn(gp) ya decifrado, es app.valor
	app.url = '/api/game_view/' + app.valor;
}

$.get(app.url)
	.done(function (data) {
		//ya obtengo el JSON
		app.game = data;
		//Para obtener el player y el viewer
		getPlayers()
		getShipLocations()
		getSalvoLocations()
		getShipSalvo()

	})
	.fail(function (data) {
		alert("error");
	});

function getPlayers() {

	for (var i = 0; i < app.game.gamePlayers.length; ++i) {
		if (app.game.gamePlayers[i].id == app.valor) {
			// es el id del gamePlayer, no del player 
			app.viewer = app.game.gamePlayers[i].player;
		} else {
			app.otherPlayer = app.game.gamePlayers[i].player;
		}
	}
}

//En un solo array guardo todas las localizaciones de los barcos
function getShipLocations() {
	for (var i = 0; i < app.game.ships.length; ++i) {
		for (var j = 0; j < app.game.ships[i].locations.length; ++j) {
			app.shipLocations.push(app.game.ships[i].locations[j]);
			console.log(app.shipLocations);
		}
	}

}

//En un solo array guardo todas las localizaciones de los salvos, disparos
function getSalvoLocations() {
	for (var i = 0; i < app.game.salvoes.length; ++i) {
		if (app.game.salvoes[i].player == app.viewer.id) {
			//recorro el salvo del viewer
			//Hay mas de un turno, por eso almacenar como array
			for (var j = 0; j < app.game.salvoes[i].locations.length; ++j) {
				//salvoLocations solo del viewer 
				//ARRAY DE OBJETOS, GUARDAR LA LOCATION Y EL TURNO
				//array de objetos, guardo dato de la localización y del turno de locations
				app.salvoLocations.push({
					location: app.game.salvoes[i].locations[j],
					turno: app.game.salvoes[i].turn,
				});

				console.log(app.salvoLocations);
			}
		}
	}

	//REEMPLAZAR POR ANTERIOR. ESTO ERA PARA PROBAR LO DEL CSS Y HTML
	/*app.salvoLocations = ["B5","C5","F1","F2","D5"];*/
}

//En un solo array guardo todas las localizaciones de los salvos a los ships, es decir los salvos del oponente
function getShipSalvo() {

	for (var i = 0; i < app.game.salvoes.length; ++i) {

		if (app.game.salvoes[i].player == app.otherPlayer.id) {
			for (var j = 0; j < app.game.salvoes[i].locations.length; ++j) {
				//salvoLocations solo del oponente
				app.shipSalvoLocations.push({
					location: app.game.salvoes[i].locations[j],
					turno: app.game.salvoes[i].turn,
				});
				console.log(app.shipSalvoLocations);
			}
		}
	}
	//REEPLAZAR POR ANTERIOR. ESTO ERA PARA PROBAR LO DEL CSS Y HTML
	/*app.shipSalvoLocations = ["B4", "B5", "B6", "E1", "H3", "A2"];*/
}
