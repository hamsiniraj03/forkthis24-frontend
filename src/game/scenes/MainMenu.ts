import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import * as WebFont from "webfontloader";

export class MainMenu extends Scene {
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
    hasHitBox: boolean = false; // Flag to track if the player has hit the box

    private targetScene: string = "Timeline";

    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image("stones", "assets/stones.png");
        this.load.image("box", "assets/box.png");
        this.load.image("cloud", "assets/clouds.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });

        //this.load.audio("bgMusic", "assets/music/background.mp3"); // Load background music

        this.load.script(
            "webfont",
            "https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js"
        );
    }

    create() {
        const { innerWidth: width, innerHeight: height } = window;

        this.cameras.main.setBackgroundColor("#000000");

        this.box = this.add.image(width / 2, height * 0.3, "box").setDepth(100);
        this.box.setScale(0.25);
        this.physics.add.existing(this.box, true); // Make the box a static physics object

        WebFont.load({
            google: {
                families: ["Press Start 2P"],
            },
            active: () => {
                this.startText = this.add.text(
                    width / 2,
                    height * 0.15,
                    "Hit Space",
                    {
                        fontFamily: '"Press Start 2P"',
                        fontSize: "32px",
                        color: "#ffffff",
                    }
                );
                this.startText.setOrigin(0.5, 0);
            },
        });

        // Play background music
        //this.bgMusic = this.sound.add("bgMusic", { loop: true });
        //this.bgMusic.play();

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

        for (let i = 0; i < 3; i++) {
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

        this.player = this.physics.add.sprite(
            width / 2,
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
                this.player.setVelocityY(-330);
            }
        });

        this.physics.add.collider(
            this.player,
            this.stones,
            this
                .onPlayerLands as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        this.physics.add.collider(
            this.player,
            this.box,
            this.hitBox as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        EventBus.emit("current-scene-ready", this);
    }

    startGame() {
        // Hide the menu elements
        this.startText.setVisible(false);
        this.box.setVisible(false);
        this.stones.setVisible(false);

        // Transition to the GameplayScene
        this.scene.start(this.targetScene);
    }

    hitBox(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        box: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
        // Add tween animation to scale down the box
        this.tweens.add({
            targets: box,
            scaleX: 0,
            scaleY: 0,
            duration: 500,
            ease: "Power2",
            onComplete: () => {
                box.destroy(); // Make the box disappear
                if (this.startText) {
                    this.startText.destroy(); // Destroy the start text
                }
                const { innerWidth: width, innerHeight: height } = window;
                WebFont.load({
                    google: {
                        families: ["Press Start 2P"],
                    },
                    active: () => {
                        const text = this.add
                            .text(width / 2, height * 0.28, "Forkthis'24", {
                                fontFamily: '"Press Start 2P"',
                                fontSize: "32px",
                                color: "#ffffff",
                            })
                            .setScale(2);
                        text.setOrigin(0.5, 0);
                    },
                });
                this.hasHitBox = true; // Set the flag to true
            },
        });
    }

    onPlayerLands(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        stones: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
        // Check if the player has hit the box and this is the second landing
        if (this.hasHitBox) {
            // Wait for 5 seconds after the player lands on the stones
            this.time.delayedCall(2000, () => {
                this.startGame();
            });
        }
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

    moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: {
                    value: window.innerWidth * 0.75,
                    duration: 3000,
                    ease: "Back.easeInOut",
                },
                y: {
                    value: window.innerHeight * 0.1,
                    duration: 1500,
                    ease: "Sine.easeOut",
                },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}
