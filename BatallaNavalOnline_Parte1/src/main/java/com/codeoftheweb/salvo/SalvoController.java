package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.xml.stream.Location;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api")
public class SalvoController {
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @RequestMapping("/games")
    public List<Object> getAllGame() {
        //Punto 5 map(game es nombre de la variable)
        return gameRepository.findAll().stream().map(game -> makeGameDTO(game)).collect(toList());
    }
    private Map<String, Object> makeGameDTO(Game game){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", game.getId());
        dto.put("created", game.getCreationDate());
        dto.put("gamePlayers", game.getGamePlayers().stream().map(gamePlayer -> makeGamePlayerDTO(gamePlayer)).collect(toList()));
        return dto;
    }
    private Map<String, Object> makeGamePlayerDTO(GamePlayer gamePlayer){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getId());
        dto.put("player",makePlayerDTO(gamePlayer.getPlayer()));
        //OBTENER UN GAME A PARTIR DE GamePlayer. Pide poner este campo en esta sección, no dentro del player
        //Hacemos DTO para que la muestra no sea como lo trae el sistema. Si no referencia circular.
        dto.put("score", makeScoreDTO(gamePlayer.getScore()));
        return  dto;
    }

    private Map<String, Object> makePlayerDTO(Player player){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("email", player.getUserName());
        return  dto;
    }

    private Map<String, Object> makeScoreDTO(Score score){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("score", score.getScore());
        return  dto;
    }

    @RequestMapping("/game_view/{id}")
    private Map<String, Object> getGamePlayer(@PathVariable Long id){
     //Obtener id de un gamePlayer, seleccionar solo ese gamePlayer
    //Buscar que coincida con el id que es pasado por parámetro.
    // Retorna tipo Optional . Obtengo valor con get()

    Optional<GamePlayer> gamePlayer1 =  gamePlayerRepository.findById(id);//
        Map<String, Object> dto = makeGameViewDTO(gamePlayer1.get());
        //Lo siguiente no funciona porque pide Info de un GamePlayer, no de un Game. Entonces hacer un nuevo DTO, obteniendo
        //los datos del DTO a partir de GamePlayer
        // Map<String, Object> dto = makeGameDTO(gamePlayer1.get());
        return dto;
    }

    private Map<String, Object> makeGameViewDTO(GamePlayer gamePlayer){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getGame().getId());
        dto.put("created", gamePlayer.getJoinDate());
        dto.put("gamePlayers", gamePlayer.getGame().getGamePlayers().stream().map(gamePlayer2 -> makeGamePlayerDTO(gamePlayer2)).collect(toList()));
        dto.put("ships", gamePlayer.getShips().stream().map(ship -> makeShipDTO(ship)).collect(toList()));
        //con flatMap obtengo un solo elemento
        dto.put("salvoes", gamePlayer.getGame().getGamePlayers().stream()
                //Poniendo map solo, obtengo un array de salvos dentro del array. Y con flatMap obtengo un solo objeto y no un array.
                .flatMap(gamePlayer3 -> gamePlayer3.getSalvoes().stream()
                        //Debo hacer nuevo DTO para salvo, porque obtengo recurrencia.
                        .map(salvo -> makeSalvoDTO(salvo)))
                .collect(toList()));
        return dto;
    }

    private Map<String, Object> makeSalvoDTO(Salvo salvo){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn",salvo.getTurn());
        dto.put("player",salvo.getGamePlayer().getPlayer().getId());
        dto.put("locations",salvo.getLocations());
        return  dto;
    }

    private Map<String, Object> makeShipDTO(Ship ship){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("type", ship.getType());
        dto.put("locations",ship.getLocations());
        return  dto;
    }
}
