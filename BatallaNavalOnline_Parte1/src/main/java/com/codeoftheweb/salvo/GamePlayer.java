package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class GamePlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private LocalDateTime joinDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_Id")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_Id")
    private Player player;

    @OneToMany(mappedBy="gamePlayer", cascade=CascadeType.ALL) // Va nombre del  identificador del que está relacionado
    private Set<Ship> ships = new HashSet<Ship>();

    @OneToMany(mappedBy="gamePlayer", cascade=CascadeType.ALL) // Va nombre del  identificador del que está relacionado
    private Set<Salvo> salvoes = new HashSet<Salvo>();

    //private Score score;

    public GamePlayer() {}
    public GamePlayer(Player player, Game game) {
        this.player=player;
        this.game=game;
        this.joinDate = LocalDateTime.now();
    }

    public void addShip(Ship ship) {
        ship.setGamePlayer(this);
        ships.add(ship);
    }

    public long getId() {
        return id;
    }

    public void setGame(Game game) {
        this.game=game;
    }

    public Game getGame(){
        return game;
    }
    public void setPlayer(Player player) {
        this.player=player;
    }
    public  Player getPlayer(){
        return  player;
    }

    public Set<Ship> getShips() {
        return ships;
    }

    public void setShips(Set<Ship> ships) {
        this.ships = ships;
    }

    public Set<Salvo> getSalvoes() {
        return salvoes;
    }

    public void setSalvoes(Set<Salvo> salvoes) {
        this.salvoes = salvoes;
    }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public Score getScore() {return this.player.getScore(this.game);}

}