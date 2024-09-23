import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import * as WebFont from "webfontloader";

export class Timeline extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    box: GameObjects.Image;
    clouds: GameObjects.Image[] = [];
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    stones: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Physics.Arcade.Sprite;
    startText: GameObjects.Text; // Reference to the start text
    bgMusic: Phaser.Sound.BaseSound; // Reference to the background music
    platforms: Phaser.Physics.Arcade.StaticGroup; // Reference to the platforms
    boxes: Phaser.Physics.Arcade.StaticGroup; // Reference to the boxes
    villains: Phaser.Physics.Arcade.Group; // Reference to the villains
    exit: Phaser.Physics.Arcade.Image; // Reference to the exit box
    coins: Phaser.Physics.Arcade.Group; // Reference to the coins
    scoreText: GameObjects.Text; // Reference to the score text
    score: number = 0; // Score variable

    private targetScene: string = "FAQ";

    constructor() {
        super("Timeline");
    }

    preload() {
        this.load.image("stones", "assets/stones.png");
        this.load.image("box", "assets/box.png");
        this.load.image("cloud", "assets/cloud.png");
        this.load.image("stone", "assets/stone.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });

        this.load.script(
            "webfont",
            "https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js"
        );

        this.load.image("villain", "assets/octocat.png");
        this.load.image("star", "assets/star.png");
        this.load.spritesheet("coin", "assets/coins.png", {
            frameWidth: 31.8,
            frameHeight: 31.8,
        });
    }

    create() {
        const { innerWidth: width, innerHeight: height } = window;

        this.cameras.main.setBackgroundColor("#000000");

        const stonesTexture = this.textures.get("stones");
        const stonesImage = this.add.image(width / 2, height - 150, "stones");
        stonesImage.setDisplaySize(width, stonesImage.height);
        stonesImage.setScale(0.9);

        this.stones = this.physics.add.staticGroup();
        this.stones
            .create(stonesImage.x, stonesImage.y, "stones")
            .setScale(0.88)
            .refreshBody();

        this.add.existing(stonesImage);

        const skyHeight = height / 4;

        for (let i = 0; i < 2; i++) {
            const cloud = this.physics.add
                .image(
                    Phaser.Math.Between(0, width),
                    Phaser.Math.Between(0, skyHeight),
                    "cloud"
                )
                .setDepth(50);
            cloud.setScale(0.5);
            this.clouds.push(cloud);
            this.moveCloud(cloud);
        }

        const stonesHeight = this.textures
            .get("stones")
            .getSourceImage().height;

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "spin",
            frames: this.anims.generateFrameNumbers("coin", {
                start: 0,
                end: 5,
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.player = this.physics.add.sprite(
            0,
            height - stonesHeight - 40,
            "dude",
            4
        );

        this.player.setScale(3);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input?.keyboard?.createCursorKeys()!;

        this.input?.keyboard?.on("keydown-LEFT", () => {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        });

        this.input?.keyboard?.on("keydown-RIGHT", () => {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        });

        this.input?.keyboard?.on("keyup-LEFT", () => {
            if (this.cursors.right.isUp) {
                this.player.setVelocityX(0);
                this.player.anims.play("turn");
            }
        });

        this.input?.keyboard?.on("keyup-RIGHT", () => {
            if (this.cursors.left.isUp) {
                this.player.setVelocityX(0);
                this.player.anims.play("turn");
            }
        });

        this.input?.keyboard?.on("keydown-SPACE", () => {
            if (this.player.body && this.player.body.touching.down) {
                this.player.setVelocityY(-500);
            }
        });

        this.physics.add.collider(this.player, this.stones);

        this.platforms = this.physics.add.staticGroup();
        this.boxes = this.physics.add.staticGroup();
        this.villains = this.physics.add.group();
        this.coins = this.physics.add.group();

        const platformPositions = [
            { x: width * 0.15, y: height * 0.3 },
            { x: width * 0.4, y: height * 0.35 },
            { x: width * 0.66, y: height * 0.45 },
            { x: width * 0.9, y: height * 0.3 },
        ];

        platformPositions.forEach((pos, index) => {
            this.platforms
                .create(pos.x - 96, pos.y, "stone")
                .setScale(1)
                .refreshBody();
            const box = this.boxes
                .create(pos.x, pos.y, "box")
                .setScale(0.25)
                .refreshBody();
            this.platforms
                .create(pos.x + 96, pos.y, "stone")
                .setScale(1)
                .refreshBody();

            // Add collision detection for the box
            this.physics.add.collider(
                this.player,
                box,
                () => this.hitBox(index),
                undefined,
                this
            );

            const coin = this.coins.create(pos.x, pos.y - 90, "coin");
            coin.setScale(2);
            coin.setCollideWorldBounds(true);
            this.physics.add.collider(coin, box);
            coin.anims.play("spin", true);
            this.physics.add.overlap(this.player, coin, this.collectCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
            
            // Add villains to platforms 2 and 4
            if (index === 1 || index === 3) {
                const villain = this.villains.create(
                    pos.x,
                    pos.y - 90,
                    "villain"
                );
                villain.setScale(0.5);
                villain.setCollideWorldBounds(true);
                villain.body.setVelocityX(50);
                villain.body.setBounce(1, 0);
                this.physics.add.collider(villain, box);
                this.physics.add.collider(villain, this.platforms);
                this.physics.add.collider(villain, this.stones);
            }
        });

        // Add a villain on the stones
        // const stoneVillain = this.villains.create(
        //     width / 2,
        //     height + 200,
        //     "villain"
        // );
        // stoneVillain.setScale(0.5);
        // stoneVillain.setCollideWorldBounds(true);
        // stoneVillain.body.setVelocityX(50);
        // stoneVillain.body.setBounce(1, 0);
        // this.physics.add.collider(stoneVillain, this.stones);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(
            this.player,
            this.villains,
            this.handlePlayerVillainCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.physics.add.collider(this.villains, this.platforms);
        this.physics.add.collider(this.villains, this.stones);

        this.exit = this.physics.add.image(width - 50, height - stonesHeight - 100, "star");

        this.physics.add.collider(this.exit, this.platforms);
        this.physics.add.collider(this.exit, this.stones);

        this.physics.add.collider(
            this.player,
            this.exit,
            this.handleExitCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Add score text
        this.scoreText = this.add.text(width - 16, 16, 'Score: 0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(1, 0);

        EventBus.emit("current-scene-ready", this);
    }

    handlePlayerVillainCollision(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        villain: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
        const playerSprite = player as Phaser.Physics.Arcade.Sprite;
        const villainSprite = villain as Phaser.Physics.Arcade.Sprite;

        if (
            playerSprite.body &&
            playerSprite.body.touching.down &&
            villainSprite.body &&
            villainSprite.body.touching.up
        ) {
            villainSprite.destroy(); // Kill the villain
            this.updateScore(100); // Add 100 points for killing a villain
        } else {
            playerSprite.setTint(0xff0000); // Turn the player sprite red
            this.add
                .text(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    "Game Over",
                    {
                        fontFamily: '"Press Start 2P"',
                        fontSize: "32px",
                        color: "#ffffff",
                    }
                )
                .setOrigin(0.5, 0.5);
            this.physics.pause(); // Pause the game
        }
    }

    startFAQ() {
        this.platforms.setVisible(false);
        this.boxes.setVisible(false);
        this.villains.setVisible(false);
        this.stones.setVisible(false);
        this.player.setVisible(false);
        this.exit.setVisible(false);
        this.coins.setVisible(false);
        
        // Ensure the targetScene is set correctly
        if (!this.targetScene || !this.scene.get(this.targetScene)) {
          console.error('Invalid target scene:', this.targetScene);
          return;
        }
      
        this.scene.start(this.targetScene);
    }

    handleExitCollision(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, exit: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        this.startFAQ();
    }

    hitBox(index: number) {
        const { innerWidth: width, innerHeight: height } = window;

        const messages = [
            "Welcome to the Timeline!",
            "This is the second event.",
            "Here is the third event.",
            "Finally, the fourth event.",
        ];

        WebFont.load({
            google: {
                families: ["Press Start 2P"],
            },
            active: () => {
                const text = this.add.text(
                    width / 2,
                    height * 0.1,
                    messages[index],
                    {
                        fontFamily: '"Press Start 2P"',
                        fontSize: "32px",
                        color: "#ffffff",
                    }
                );
                text.setOrigin(0.5, 0);

                // Destroy the text after 2 seconds
                this.time.delayedCall(2000, () => {
                    text.destroy();
                });
            },
        });
    }

    moveCloud(cloud: Phaser.Physics.Arcade.Image) {
        const width = this.scale.width;
        const height = this.scale.height;
        const skyHeight = height / 4;

        this.tweens.add({
            targets: cloud,
            x: {
                value: Phaser.Math.Between(0, width),
                duration: Phaser.Math.Between(30000, 40000),
                ease: "Sine.easeInOut",
            },
            y: {
                value: Phaser.Math.Between(0, skyHeight),
                duration: Phaser.Math.Between(30000, 40000),
                ease: "Sine.easeInOut",
            },
            repeat: -1,
            yoyo: true,
            onComplete: () => {
                this.moveCloud(cloud);
            },
        });
    }

    collectCoin(player: Phaser.Physics.Arcade.Sprite, coin: Phaser.Physics.Arcade.Sprite) {
        const playerSprite = player as Phaser.Physics.Arcade.Sprite;
        const coinSprite = coin as Phaser.Physics.Arcade.Sprite;
        coinSprite.destroy(); // Remove the coin
        this.updateScore(50); // Add 50 points for collecting a coin
    }

    updateScore(points: number) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
    }
}