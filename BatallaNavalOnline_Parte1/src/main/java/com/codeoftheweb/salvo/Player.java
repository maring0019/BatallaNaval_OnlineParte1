package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.List;
import java.util.Set;
import static java.util.stream.Collectors.toList;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private String userName;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    private Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    private Set<Score> scores;

    public Player() { }

    public Player(String userName) {

        this.userName = userName;
    }

    public void addGamePlayer(GamePlayer gamePlayer) {
        gamePlayer.setPlayer(this);// es como poner sello al hijo(soy su padre) antes de agregarlo
        gamePlayers.add(gamePlayer);
    }

    public long getId(){
        return id;
    }
    public String getUserName(){
        return userName;
    }
    public  void  setUserName(){
        this.userName = userName;
    }

    public List<Game> getGames() {
        return gamePlayers.stream().map(sub -> sub.getGame()).collect(toList());
    }

    public Set<Score> getScores() {
        return scores;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

    public Score getScore(Game game){
        //filtrar por id del game
        return this.scores.stream().filter(score -> score.getGame().getId()== game.getId()).findFirst().orElse(null);
    }
    public String toString() {
        return userName;
    }

}