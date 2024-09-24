import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Timeline } from './scenes/Timeline';
import { FAQ } from './scenes/FAQ';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 80,
    parent: 'game-container',
    backgroundColor: '#0000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x:0, y: 1000 },
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Timeline,
        FAQ,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent: string) => {
    const game = new Game({ ...config, parent });

    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });

    return game;
}

export default StartGame;