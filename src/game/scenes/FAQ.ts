import { Scene, GameObjects } from "phaser";

export class FAQ extends Scene {
    player: Phaser.Physics.Arcade.Sprite;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    faqBoxes: Phaser.Physics.Arcade.StaticGroup;
    stones: Phaser.Physics.Arcade.StaticGroup;
    clouds: GameObjects.Image[] = [];
    villains: Phaser.Physics.Arcade.Group;
    coins: Phaser.Physics.Arcade.Group;
    pipes: Phaser.Physics.Arcade.StaticGroup;
    scoreText: GameObjects.Text;
    score: number = 0;

    constructor() {
        super("FAQ");
    }

    preload() {
        this.load.image("ground", "assets/platform.png");
        this.load.image("faqBox", "assets/box.png");
        this.load.image("stones", "assets/stones.png");
        this.load.image("cloud", "assets/clouds.png");
        this.load.spritesheet("mario", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("pipe", "assets/pipe.png");
        this.load.image("villain", "assets/octocat.png");
        this.load.spritesheet("coin", "assets/coins.png", {
            frameWidth: 31.8,
            frameHeight: 31.8,
        });
        this.load.image("stone", "assets/stone.png");
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
            frameRate: 10,
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

        // Create FAQ boxes
        this.faqBoxes = this.physics.add.staticGroup();
        const faqBoxPositions = [
            { x: width * 0.15, y: height * 0.3 },
            { x: width * 0.4, y: height * 0.35 },
            { x: width * 0.66, y: height * 0.45 },
            { x: width * 0.9, y: height * 0.3 },
        ];

        this.faqBoxes = this.physics.add.staticGroup();
        faqBoxPositions.forEach((pos) => {
            this.faqBoxes
                .create(pos.x, pos.y, "faqBox")
                .setScale(0.25)
                .refreshBody();
        });

        // Add collision between player and FAQ boxes
        this.physics.add.collider(
            this.player,
            this.faqBoxes,
            this
                .displayFAQ as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Create platforms, villains, pipes, and coins
        this.platforms = this.physics.add.staticGroup();
        this.villains = this.physics.add.group();
        this.coins = this.physics.add.group();
        this.pipes = this.physics.add.staticGroup();

        const platformPositions = [
            { x: width * 0.2, y: height * 0.4 },
            { x: width * 0.8, y: height * 0.6 },
            { x: width * 0.3, y: height * 0.7 },
            { x: width * 0.7, y: height * 0.2 },
        ];

        platformPositions.forEach((pos, index) => {
            this.platforms
                .create(pos.x - 96, pos.y, "stone")
                .setScale(1)
                .refreshBody();
            const box = this.faqBoxes
                .create(pos.x, pos.y, "faqBox")
                .setScale(0.25)
                .refreshBody();
            this.platforms
                .create(pos.x + 96, pos.y, "stone")
                .setScale(1)
                .refreshBody();

            // Add coins on top of each box
            const coin = this.coins.create(pos.x, pos.y - 90, "coin");
            coin.anims.play("spin", true);
            coin.setScale(2);
            coin.setCollideWorldBounds(true);
            this.physics.add.collider(coin, box);
            this.physics.add.collider(coin, this.platforms);
            this.physics.add.overlap(
                this.player,
                coin,
                this
                    .collectCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined,
                this
            );

            // Add villains to platforms 2 and 4
            if (index === 1 || index === 3) {
                const villain = this.villains.create(
                    pos.x,
                    pos.y - 60,
                    "villain"
                );
                villain.setScale(0.5);
                villain.setCollideWorldBounds(true);
                villain.body.setVelocityX(50);
                villain.body.setBounce(1, 0);
                this.physics.add.collider(villain, this.platforms);
            }

            // Add pipes to some platforms
            // if (index % 2 === 0) {
            //     this.pipes.create(pos.x, pos.y - 100, "pipe").setScale(0.25).refreshBody();
            // }
        });

        const pipe = this.pipes
            .create(width * 0.5, height * 0.65 - 75, "pipe")
            .setScale(0.25);

        this.physics.add.collider(pipe, this.player);

        // Add a villain on the stones
        const stoneVillain = this.villains.create(
            width / 2,
            height - 200,
            "villain"
        );
        stoneVillain.setScale(0.5);
        stoneVillain.setCollideWorldBounds(true);
        stoneVillain.body.setVelocityX(50);
        stoneVillain.body.setBounce(1, 0);
        this.physics.add.collider(stoneVillain, this.stones);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(
            this.player,
            this.villains,
            this
                .handlePlayerVillainCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.physics.add.collider(this.villains, this.platforms);
        this.physics.add.collider(this.villains, this.stones);

        // Add score text
        this.scoreText = this.add
            .text(width - 16, 16, "Score: 0", {
                fontFamily: '"Press Start 2P"',
                fontSize: "32px",
                color: "#ffffff",
            })
            .setOrigin(1, 0);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (this.cursors?.up?.isDown && this.player.body?.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    displayFAQ(
        player: Phaser.GameObjects.GameObject,
        faqBox: Phaser.GameObjects.GameObject
    ) {
        const faqText = this.add.text(
            (faqBox as Phaser.Physics.Arcade.Sprite).x,
            (faqBox as Phaser.Physics.Arcade.Sprite).y - 50,
            "FAQ Information",
            {
                font: "16px Arial",
                color: "#000000",
                backgroundColor: "#ffffff",
                padding: { x: 10, y: 5 },
            }
        );
        faqText.setOrigin(0.5, 1);

        // Destroy the text after 3 seconds
        this.time.delayedCall(3000, () => {
            faqText.destroy();
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

    collectCoin(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        coin: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
        const playerSprite = player as Phaser.Physics.Arcade.Sprite;
        const coinSprite = coin as Phaser.Physics.Arcade.Sprite;
        coinSprite.destroy(); // Remove the coin
        this.updateScore(50); // Add 50 points for collecting a coin
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

    updateScore(points: number) {
        this.score += points;
        this.scoreText.setText("Score: " + this.score);
    }
}

