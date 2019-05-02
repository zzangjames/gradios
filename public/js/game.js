var player;
var aliens;
var bullets;
var bulletTime = 0;
var invincibleTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var countstage = 1;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var live_count;
var max_live = 3;
var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];
var music;
var sfx_fire;
var sfx_enemy_die;
var heart;
var last = -1;
var first = 0;
var stage = 1;
var stageString = '';
var stageText;
var sfx_stage_clear;
var speedup;
var player_speed;
var power_up_count = 1;
var power_up;
var settings;
var speed_up;
var player_speed;
var power_up_count = 1;
var power_up;
var score_up_2;
var score_2_switch = false;
var score_up_3;
var score_3_switch = false;
var debugFlag = false;
var bulletsCollision = true;
var Game = {

    preload : function() {

        // load all sprites
        game.load.image('speed_up', 'img/speed_up.png');
        game.load.image('bullet', 'img/bullet.png');
        game.load.image('enemyBullet', 'img/enemy-bullet.png');
        game.load.spritesheet('invader', 'img/invader32x32x4.png', 32, 32);
        game.load.spritesheet('ship', 'img/ship64x64x5.png', 64, 64, 5);
        game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
        game.load.image('starfield', 'img/starfield.png');
        game.load.image('heart', 'img/heart.png');
        game.load.image('power_up','img/power_up.png');
        game.load.image('score_up_2', 'img/score_up_2.png');
        game.load.image('score_up_3', 'img/score_up_3.png');
        game.load.image('lower_mountain', 'img/lower_mountain.png');
        game.load.image('upper_mountain', 'img/upper_mountain.png');
        game.load.image('debug_message', 'img/debugMessage.png');
        
        // load all sfx and music
        game.load.audio('music1', 'audio/gradius.mp3');
        game.load.audio('sfx_enemy_die', 'audio/enemy-die.wav');
        game.load.audio('sfx_fire', 'audio/fire.wav');
        game.load.audio('sfx_player_hit', 'audio/player-hit.wav');
        game.load.audio('sfx_stage_clear', 'audio/stage-clear.wav');
        // load the setting icon
        game.load.image('settingButton', 'img/settingButton.png');
        game.load.image('settingBack', 'img/settingBackground.png');

    },

    create  : function() {

        // reset
        bulletTime = 0;
        invincibleTime = 0;
        score = 0;
        scoreString = '';
        firingTimer = 0;
        livingEnemies = [];
        countstage = 1;
        stage = 1;
        player_speed = 200;
        stageString = '';
        power_up_count = 1;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        music = game.add.audio('music1');
        music.volume = 0.4;
        music.play();


        //  Here we set-up our audio sprites
        sfx_fire = game.add.audio('sfx_fire');
        sfx_fire.allowMultiple = false;

        sfx_stage_clear = game.add.audio('sfx_stage_clear');
        sfx_stage_clear.allowMultiple = true;

        sfx_player_hit = game.add.audio('sfx_player_hit');
        sfx_player_hit.allowMultiple = true;

        sfx_enemy_die = game.add.audio('sfx_enemy_die');
        sfx_enemy_die.allowMultiple = true;

        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 900, 600, 'starfield');
        upper_mountain = game.add.tileSprite(0, 0, 900, 30, 'upper_mountain');
        lower_mountain = game.add.tileSprite(0, 500, 900, 0, 'lower_mountain');

        //  The starship
        player = game.add.sprite(150, 300, 'ship');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.setSize(64,32,0,16);

        //  Our two animations, moving up and down.
        player.animations.add('up', [3, 4], 2, false);
        player.animations.add('down', [0, 1], 2, false);

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(200, 'bullet', 100, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(200, 'enemyBullet', 100, false);
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        //  The bad guys
        aliens = game.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;

        // The setting button
        game.add.button(30,20, 'settingButton', this.showSettingMessageBox, this);
        settings = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        // The stage
        stageString = 'Stage: ';
        stageText = game.add.text(70, 10, stageString + stage, { font: '40px Arial', fill: '#fff' });
        // this.generatespeed_up();
        this.createAliens();

        //  The score
        scoreString = 'Score: ';
        scoreText = game.add.text(250, 10, scoreString + score, { font: '40px Arial', fill: '#fff' });

        //  Lives
        lives = game.add.group();
        for (var i = 2; i >= 0; i--) {
            var ship = lives.create(game.world.width - 150 + (60 * i), 60, 'ship');
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 0;
            ship.alpha = 0.4;
        }
        live_count = 3
        game.add.text(game.world.width - 100, 10, 'Health: ', { font: '24px Arial', fill: '#fff' });

        // hearts
        heart = game.add.group();
        heart.enableBody = true;
        heart.physicsBodyType = Phaser.Physics.ARCADE;

        // power_up
        power_up = game.add.group();
        power_up.enableBody = true;
        power_up.physicsBodyType = Phaser.Physics.ARCADE;


        //speed_up
        speed_up = game.add.group();
        speed_up.enableBody = true;
        speed_up.physicsBodyType = Phaser.Physics.ARCADE;

        // score_up_2
        score_up_2 = game.add.group();
        score_up_2.enableBody = true;
        score_up_2.physicsBodyType = Phaser.Physics.ARCADE;

        // score_up_3
        score_up_3 = game.add.group();
        score_up_3.enableBody = true;
        score_up_3.physicsBodyType = Phaser.Physics.ARCADE;


        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(200, 'kaboom', 100, false);
        explosions.forEach(this.setupInvader, this);

        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    update : function() {

        //  Scroll the background
        starfield.tilePosition.x -= 3;
        upper_mountain.tilePosition.x -= 1;
        lower_mountain.tilePosition.x -= 1;

        // Setting
        if (settings.isDown){
            music.stop();
            this.showSettingMessageBox();
            music.play();
        }

        if (player.alive) {
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(0, 0);

            if(cursors.left.isDown && (40 < player.x) && cursors.up.isDown && (40 < player.y)){
                player.body.velocity.x = -player_speed * Math.sqrt(2) / 2;
                player.body.velocity.y = -player_speed * Math.sqrt(2) / 2;
                player.animations.play('up');
            }

            else if(cursors.left.isDown && (40 < player.x) && cursors.down.isDown && (player.y < 560)){
                player.body.velocity.x = -player_speed  * Math.sqrt(2) / 2;
                player.body.velocity.y = player_speed  * Math.sqrt(2) / 2;
                player.animations.play('down');
            }
            else if(cursors.right.isDown && (player.x < 860) && cursors.up.isDown && (40 < player.y)){
                player.body.velocity.x = player_speed * Math.sqrt(2) / 2;
                player.body.velocity.y = -player_speed * Math.sqrt(2) / 2;
                player.animations.play('up');
            }
            else if(cursors.right.isDown && (player.x < 860) && cursors.down.isDown && (player.y) < 560){
                player.body.velocity.x = player_speed  * Math.sqrt(2) / 2;
                player.body.velocity.y = player_speed  * Math.sqrt(2) / 2;
                player.animations.play('down');
            }

            else if (cursors.left.isDown && (40 < player.x)) {
                player.body.velocity.x = -player_speed;
            }
            else if (cursors.right.isDown && (player.x < 860)) {
                player.body.velocity.x = player_speed;
            }

            // keyboard up/down
            else if (cursors.up.isDown && (40 < player.y)) {
                player.body.velocity.y = -player_speed;
                player.animations.play('up');
            }
            else if (cursors.down.isDown && (player.y < 560)) {
                player.body.velocity.y = player_speed;
                player.animations.play('down');
            }
            else {  // stand still
                player.animations.stop();
                player.frame = 2;
            }

            //  Firing?
            if (fireButton.isDown) {
                this.fireBullet();
            }

            if (game.time.now > firingTimer) {
                this.enemyFires();
            }

            //  Run collision
            game.physics.arcade.overlap(bullets, aliens, this.collisionHandler, null, this);
            if (bulletsCollision){
                game.physics.arcade.overlap(bullets, enemyBullets, this.playerBreakEnemyBullet, null, this);
            }
            game.physics.arcade.overlap(player, aliens, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(player, enemyBullets, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(bullets, heart, this.changeItem, null, this);
            game.physics.arcade.overlap(bullets, speed_up, this.changeItem, null, this);
            game.physics.arcade.overlap(bullets, power_up, this.changeItem, null, this);
            game.physics.arcade.overlap(bullets, score_up_2, this.changeItem, null, this);
            game.physics.arcade.overlap(bullets, score_up_3, this.changeItem, null, this);
            game.physics.arcade.overlap(player, heart, this.getHeart, null, this);
            game.physics.arcade.overlap(player, power_up, this.getPower_up, null, this);
            game.physics.arcade.overlap(player, speed_up, this.getspeed_up, null, this);
            game.physics.arcade.overlap(player, score_up_2, this.getScore_up_2, null, this);
            game.physics.arcade.overlap(player, score_up_3, this.getScore_up_3, null, this);
        }
    },

    createAliens : function() {

        

        for (var i = 0; i < 3 * stage; i++) {
            var movepoint_x = Math.random() * 600 + 300;
            var movepoint_y = Math.random() * 540 + 30;
            var alien = aliens.create(movepoint_x, movepoint_y, 'invader');
            while(game.physics.arcade.overlap(alien, aliens) || game.physics.arcade.overlap(alien, player)){
                alien.kill();
                movepoint_x = Math.random() * 600 + 300;
                movepoint_y = Math.random() * 540 + 30;
                alien = aliens.create(movepoint_x, movepoint_y, 'invader');
            }
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly'); 
            alien.body.moves = false;
            alien.body.setSize(24,32,0,0);

            var movestyle = Phaser.Easing;
            var style = Math.random();
            if (style < 0.2)
                movestyle = movestyle.Cubic;
            else if (style < 0.4)
                movestyle = movestyle.Back;
            else if (style < 0.6)
                movestyle = movestyle.Circular;
            else if (style < 0.8)
                movestyle = movestyle.Linear;
            style = Math.random();
            if (style < 0.33)
                movestyle = movestyle.In;
            else if (style < 0.66)
                movestyle = movestyle.InOut;
            else
                movestyle = movestyle.Out;
            
            if(movepoint_x < 600)
                movepoint_x = 700 + Math.random()*200;
            else
                movepoint_x = 300 + Math.random()*200;
            if(movepoint_y < 300)
                movepoint_y = 350 + Math.random()*190;
            else
                movepoint_y = 30 + Math.random()*190;

            var difficulty = stage;
            if (difficulty > 20)
                difficulty = 20;

            var tween = game.add.tween(alien).to( { x: movepoint_x }, 3000 - 1000*Math.random() - 50*difficulty*Math.random(), movestyle, true, 0, 20000, true);
            var tween = game.add.tween(alien).to( { y: movepoint_y }, 3000 - 1000*Math.random() - 50*difficulty*Math.random(), movestyle, true, 0, 20000, true);
        }

        //  Alien movements

            
            //var tween = game.add.tween(aliens).to( { y: 500 }, 2000, Phaser.Easing.Cubic.Out, true, 0, 0, true);


        //  When the tween loops it calls descend
        tween.onLoop.add(this.descend, this);

    },

    setupInvader : function(invader) {
        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    },

    descend : function() {
        aliens.x -= 10;
    },

    render : function() {
        // game.debug.body(player);
        // game.debug.spriteInfo(player);
        // game.debug.body(aliens.getFirstAlive());
    },

    fireBullet : function() {
        game.add.audio('sfx_fire');
        sfx_fire.volume = 0.2;

        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime) {

            //  Grab the first bullet we can from the pool
            for(var n = power_up_count; n > 0; n--){
                bullet = bullets.getFirstExists(false);

                if (bullet) {
                    sfx_fire.play();
                    //  And fire it
                    if (n%2 === 0) {
                        bullet.reset(player.x + 8, player.y + Math.pow(-1, n) * 7 * n);
                        bullet.body.velocity.x = 800;
                        bulletTime = game.time.now + 200;
                    }
                    else {
                        bullet.reset(player.x + 8, player.y + Math.pow(-1, n) * 7 * n);
                        bullet.body.velocity.x = 400;
                        bulletTime = game.time.now + 200;
                    }
                }
            }
        }
    },

    collisionHandler : function(bullet, alien) {

        if (debugFlag){
            this.debugCollisionMessage(bullet, alien);
        }
        //  When a bullet hits an alien we kill them both
        bullet.kill();

        if(Math.random() * 1000 < 20) {
            this.makeRandomItem(alien.body.x, alien.body.y, -200, (Math.random()*2-1)*200 );
        }
        alien.kill();

        game.add.audio('sfx_enemy_die');
        sfx_enemy_die.volume = 0.6;
        sfx_enemy_die.play();

        //  Increase the score
        if (score_2_switch === true && score_3_switch === false) {
            score += 40*live_count;
        }
        else if (score_2_switch === false && score_3_switch == true) {
            score += 60*live_count;
        }
        else if (score_2_switch === true && score_3_switch == true) {
            score += 120*live_count;
        }
        else {
        score += 20*live_count;
        }
        scoreText.text = scoreString + score;
        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
        /*setTimeout(function() { explosion.kill(); }, 750);*/

        if (aliens.countLiving() === 0) {
            aliens.removeAll();
            game.add.audio('stage_clear');
            sfx_stage_clear.volume = 2.0;
            sfx_stage_clear.play();

            this.createAliens();
            countstage++;
            stage++;
            stageText.text = stageString + stage;
            
            if(debugFlag){
                console.log("%c STAGE "+stage, 'background: #222; color: #bada55');
            }
            
        }
    },

    makeRandomItem : function(x, y, x_vel = 0, y_vel = 0){
        console.log(x,y,x_vel,y_vel);
        var random = Math.random();
        var item;
        if(random < 0.22){
            item = power_up.create(x, y,'power_up');
        }
        else if(random < 0.44){
            item = speed_up.create(x, y, 'speed_up');

        }
        else if(random < 0.66){
            item = score_up_2.create(x, y, 'score_up_2');

        }
        else if(random < 0.77){
            item = score_up_3.create(x, y, 'score_up_3');
        }
        else{
            item = heart.create(x, y, 'heart');
        }
        item.anchor.setTo(0.5, 0.5);
        if(x_vel != 0){
            item.body.velocity.x = x_vel;
        }
        if(y_vel != 0){
            item.body.velocity.y = y_vel;
        }
        return item;
    },

    changeItem : function(bullet, object){
        if(debugFlag){
            this.debugCollisionMessage(bullet, object);
        }
        var x_vel = object.body.velocity.x;
        var y_vel = object.body.velocity.y;
        var x = object.x;
        var y = object.y;
        object.kill();
        var item = this.makeRandomItem(x, y, x_vel, y_vel);
        bullet.kill();
    },

    playerBreakEnemyBullet : function(bullet, enemyBullet) {
        if(debugFlag){
            this.debugCollisionMessage(bullet, enemyBullet);
        }
        bullet.kill();
        enemyBullet.kill();

        game.add.audio('sfx_enemy_die');
        sfx_enemy_die.volume = 0.6;
        sfx_enemy_die.play();

        var explosion = explosions.getFirstExists(false);
        explosion.reset(enemyBullet.body.x, enemyBullet.body.y);
        explosion.play('kaboom', 30, false, true);
    },

    enemyHitsPlayer : function(player, object) {
        if(debugFlag){
            this.debugCollisionMessage(player, object);
        }
        if ((game.time.now < player.invincibleTime) || !aliens.countLiving()) return;
        game.add.audio('sfx_player_hit');
        sfx_player_hit.volume = 0.6;
        sfx_player_hit.play();
        object.kill();

        live = lives.getChildAt(max_live-live_count);
        live.alpha = 0;
        live_count--;

        // reset player's power & speed
        player_speed = 200;
        power_up_count = 1;

        player.invincibleTime = game.time.now + 1000;
        // blink player
        game.add.tween(player).to( { alpha : 0.2 }, 250, Phaser.Easing.Linear.None, true, 0, 1, true);

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);

        if (live_count < 1) {
            countstage = 1;
            this.finishGame();
        }

        if (aliens.countLiving() === 0) {
            game.add.audio('stage_clear');
            sfx_stage_clear.volume = 2.0;
            sfx_stage_clear.play();
            this.createAliens();
            countstage++;
            stage++;
            stageText.text = stageString + stage;

            if(debugFlag){
                console.log("%c STAGE "+stage, 'background: #222; color: #bada55');
            }

        }
        score_2_switch = false;
        score_3_switch = false;
    },

    getHeart: function(player, heart) {
        if(debugFlag){
            this.debugCollisionMessage(player, heart);
        }
        heart.kill();
      
        if (live_count < 3){
            live_count++;
            live = lives.getChildAt(max_live-live_count);
            live.alpha = 0.4;
        }
    },

     getPower_up: function(player, power_up){
        if(debugFlag){
            this.debugCollisionMessage(player, power_up);
        }
        power_up.kill();
        power_up_count++;
        if(power_up_count > 6) power_up_count = 6;
    },

    finishGame : function() {
        
        player.kill();

        music.stop();

        game.time.events.add(Phaser.Timer.SECOND, function() {
            enemyBullets.callAll('kill');
            //aliens.removeAll();
            this.state.start('ending');
        }, this);
    },

    enemyFires : function() {
        //  Grab the first bullet we can from the pool
        enemyBullet = enemyBullets.getFirstExists(false);

        livingEnemies.length = 0;

        aliens.forEachAlive(function(alien) {

            // put every living enemy in an array
            livingEnemies.push(alien);
        });

        if (enemyBullet && livingEnemies.length > 0) {

            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

            if(countstage >= 7) countstage -=1;
            game.physics.arcade.moveToObject(enemyBullet,player,100 + 20 * countstage);
            firingTimer = game.time.now + 2000 / countstage;
        }
    },

    resetBullet : function(bullet) {
        //  Called if the bullet goes out of the screen
        bullet.kill();
    },
  
    getScore_up_2 : function(player, score_up_2){
        if(debugFlag){
            this.debugCollisionMessage(player, score_up_2);
        }
        score_up_2.kill();
        //if(player_speed <340){
            //player_speed += 20;
        //}
        //score += 40*lives.countLiving();
        score_2_switch = true;
    },

    getScore_up_3 : function(player, score_up_3){
        if(debugFlag){
            this.debugCollisionMessage(player, score_up_3);
        }
        score_up_3.kill();
        //if(player_speed <340){
            //player_speed += 20;
        //}
        //score += 60*lives.countLiving();
        score_3_switch = true;
    },

    getspeed_up : function(player, speed_up){
        if(debugFlag){
            this.debugCollisionMessage(player, speed_up);
        }
        speed_up.kill();
        if(player_speed <340){
            player_speed += 20;
        }
    },

    showSettingMessageBox : function(){
        game.paused = true;

        if(this.msgBox){
            this.msgBox.destroy();
        }

        var textStyle = { fontSize: 19 };

        var msgBox = game.add.group();
        var back = game.add.sprite(0,0,'settingBack');
        var mainMenu = game.add.text(0, 0, 'MAIN MENU');
        var restartButton1 = game.add.text(0, 0, 'RESTART');
        var resumeButton = game.add.text(0, 0, 'RESUME');
        var musicOnButton = game.add.text(0,0, 'ON', textStyle);
        var musicOffButton = game.add.text(0,0,'OFF', textStyle);
        var backgroundMusicText = game.add.text(0,0, 'BackgroundMusic', textStyle);
        var dbgMsgText = game.add.text(0, 0, "Debug Message", textStyle);
        var dbgMsgOnButton = game.add.text(0,0, 'ON', textStyle);
        var dbgMsgOffButton = game.add.text(0,0,'OFF', textStyle);
        var bulletCollitionText = game.add.text(0, 0, 'Bullets Collision', textStyle);
        var bulletCollisionOnButton = game.add.text(0,0, 'ON', textStyle);
        var bulletCollisionOffButton = game.add.text(0,0, 'OFF', textStyle);

        msgBox.add(back);
        msgBox.add(mainMenu);
        msgBox.add(restartButton1);
        msgBox.add(resumeButton);
        msgBox.add(musicOnButton);
        msgBox.add(musicOffButton);
        msgBox.add(backgroundMusicText);
        msgBox.add(dbgMsgText);
        msgBox.add(dbgMsgOnButton);
        msgBox.add(dbgMsgOffButton);
        msgBox.add(bulletCollitionText);
        msgBox.add(bulletCollisionOffButton);
        msgBox.add(bulletCollisionOnButton);

        msgBox.x = game.width / 2 - msgBox.width / 2;
        msgBox.y = game.height / 2 - msgBox.height / 2;

        mainMenu.wordWrapWidth = back * 0.8;
        mainMenu.addColor("#ffffff", 0);
        mainMenu.x = msgBox.width / 2 - mainMenu.width / 2;
        mainMenu.y = msgBox.height - mainMenu.height*5;
        mainMenu.inputEnabled = true;
        mainMenu.events.onInputDown.add(this.goMenu,this);
        
        restartButton1.wordWrapWidth = back * 0.8;
        restartButton1.addColor("#ffffff", 0);
        restartButton1.x = msgBox.width / 2 - restartButton1.width / 2;
        restartButton1.y = msgBox.height - restartButton1.height*7.5;
        restartButton1.inputEnabled = true;
        restartButton1.events.onInputDown.add(this.startGame,this);

        resumeButton.wordWrapWidth = back * 0.8;
        resumeButton.addColor("#ffffff", 0);
        resumeButton.x = msgBox.width / 2 - resumeButton.width / 2;
        resumeButton.y = msgBox.height - resumeButton.height*2.5;
        resumeButton.inputEnabled = true;
        resumeButton.events.onInputDown.add(this.hideBox,this);

        backgroundMusicText.wordWrapWidth = back * 0.8;
        backgroundMusicText.x = msgBox.width / 2 - backgroundMusicText.width / 2;
        backgroundMusicText.y = msgBox.y - 40;
        backgroundMusicText.addColor("#ffffff", 0);

        musicOnButton.wordWrapWidth = back * 0.8;
        musicOnButton.addColor("#ffffff", 0);
        musicOnButton.x = msgBox.width / 2 - musicOnButton.width - 10;
        musicOnButton.y = msgBox.y + backgroundMusicText.height - 40;
        musicOnButton.inputEnabled = true;
        musicOnButton.events.onInputDown.add(this.turnOnMusic,this);

        musicOffButton.wordWrapWidth = back * 0.8;
        musicOffButton.addColor("#ffffff", 0);
        musicOffButton.x = msgBox.width / 2 + 10;
        musicOffButton.y = msgBox.y + backgroundMusicText.height - 40;
        musicOffButton.inputEnabled = true;
        musicOffButton.events.onInputDown.add(this.turnOffMusic,this);

        dbgMsgText.wordWrapWidth = back * 0.8;
        dbgMsgText.x = msgBox.width / 2 - dbgMsgText.width / 2;
        dbgMsgText.y = msgBox.y + 15;
        dbgMsgText.addColor("#ffffff", 0);

        dbgMsgOnButton.wordWrapWidth = back * 0.8;
        dbgMsgOnButton.addColor("#ffffff", 0);
        dbgMsgOnButton.x = msgBox.width / 2 - dbgMsgOnButton.width - 10;
        dbgMsgOnButton.y = msgBox.y + dbgMsgText.height + 15;
        dbgMsgOnButton.inputEnabled = true;
        dbgMsgOnButton.events.onInputDown.add(this.turnOnDbgMsg,this);

        dbgMsgOffButton.wordWrapWidth = back * 0.8;
        dbgMsgOffButton.addColor("#ffffff", 0);
        dbgMsgOffButton.x = msgBox.width / 2 + 10;
        dbgMsgOffButton.y = msgBox.y + dbgMsgText.height + 15;
        dbgMsgOffButton.inputEnabled = true;
        dbgMsgOffButton.events.onInputDown.add(this.turnOffDbgMsg,this);

        bulletCollitionText.wordWrapWidth = back * 0.8;
        bulletCollitionText.x = msgBox.width / 2 - bulletCollitionText.width / 2;
        bulletCollitionText.y = msgBox.y + 70;
        bulletCollitionText.addColor("#ffffff", 0);

        bulletCollisionOnButton.wordWrapWidth = back * 0.8;
        bulletCollisionOnButton.addColor("#ffffff", 0);
        bulletCollisionOnButton.x = msgBox.width / 2 - bulletCollisionOnButton.width - 10;
        bulletCollisionOnButton.y = msgBox.y + bulletCollitionText.height + 70;
        bulletCollisionOnButton.inputEnabled = true;
        bulletCollisionOnButton.events.onInputDown.add(this.turnOnBulletsCollision,this);

        bulletCollisionOffButton.wordWrapWidth = back * 0.8;
        bulletCollisionOffButton.addColor("#ffffff", 0);
        bulletCollisionOffButton.x = msgBox.width / 2 + 10;
        bulletCollisionOffButton.y = msgBox.y + bulletCollitionText.height + 70;
        bulletCollisionOffButton.inputEnabled = true;
        bulletCollisionOffButton.events.onInputDown.add(this.turnOffBulletsCollision,this);

        this.msgBox = msgBox;
    },

    goMenu : function() {
        this.msgBox.destroy();
        game.paused = false;
        music.stop();
        game.state.start('mainMenu');
    },
    startGame : function() {
        //this.Game.destroy();
        this.msgBox.destroy();
        game.paused = false;
        music.stop();
        game.state.start('Game');
    },
    hideBox : function(){
        this.msgBox.destroy();
        game.paused = false;
    },

    turnOnMusic : function(){
        music.play();
    },

    turnOffMusic : function(){
        music.stop();
    },

    turnOnDbgMsg : function(){
        debugFlag = true;
        console.log("debugFlag is now on");
    },
    
    turnOffDbgMsg : function(){
        debugFlag = false;
        console.log("debugFlag is now off");
    },

    turnOnBulletsCollision : function(){
        bulletsCollision = true;
        console.log("bulletsCollision is now on");
    },
    
    turnOffBulletsCollision : function(){
        bulletsCollision = false;
        console.log("bulletsCollision is now off");
    },
    
    debugCollisionMessage : function(object1, object2){
        
        if (object1.key.localeCompare("bullet") == 0){
            if (object2.key.localeCompare("invader") == 0){
                console.log("Collision occuered between %c"+object1.key+"( X:"+object1.centerX+", Y:"+object1.centerY+" )\n"+
                        "%c and %c"+object2.key+"( X:"+object2.centerX+", Y:"+object2.centerY+" )\n"+
                        "%c at ( X: "+(object1.centerX+object2.centerX)/2+"Y: "+(object1.centerY+object2.centerY)/2+" )",
                        "color:blue",
                        "color:black",
                        "color:red",
                        "color:black");
            }
            else if (object2.key.localeCompare("enemyBullet") == 0){
                console.log("Collision occuered between %c"+object1.key+"( X:"+object1.centerX+", Y:"+object1.centerY+" )\n"+
                        "%c and %c"+object2.key+"( X:"+object2.centerX+", Y:"+object2.centerY+" )\n"+
                        "%c at ( X: "+(object1.centerX+object2.centerX)/2+"Y: "+(object1.centerY+object2.centerY)/2+" )",
                        "color:blue",
                        "color:black",
                        "color:purple",
                        "color:black");
            }
            else{
                console.log("Collision occuered between %c"+object1.key+"( X:"+object1.centerX+", Y:"+object1.centerY+" )\n"+
                        "%c and %c"+object2.key+"( X:"+object2.centerX+", Y:"+object2.centerY+" )\n"+
                        "%c at ( X: "+(object1.centerX+object2.centerX)/2+"Y: "+(object1.centerY+object2.centerY)/2+" )",
                        "color:blue",
                        "color:black",
                        "color:green",
                        "color:black");
            }
        }
        else if (object1.key.localeCompare("ship") == 0){
            if (object2.key.localeCompare("invader") == 0){
                console.log("Collision occuered between %c"+object1.key+"( X:"+object1.centerX+", Y:"+object1.centerY+" )\n"+
                        "%c and %c"+object2.key+"( X:"+object2.centerX+", Y:"+object2.centerY+" )\n"+
                        "%c at ( X: "+(object1.centerX+object2.centerX)/2+"Y: "+(object1.centerY+object2.centerY)/2+" )",
                        "background:blue; color:white",
                        "color:black",
                        "color:red",
                        "color:black");
            }
            else if (object2.key.localeCompare("enemyBullet") == 0){
                console.log("Collision occuered between %c"+object1.key+"( X:"+object1.centerX+", Y:"+object1.centerY+" )\n"+
                        "%c and %c"+object2.key+"( X:"+object2.centerX+", Y:"+object2.centerY+" )\n"+
                        "%c at ( X: "+(object1.centerX+object2.centerX)/2+"Y: "+(object1.centerY+object2.centerY)/2+" )",
                        "background:blue; color:white",
                        "color:black",
                        "color:purple",
                        "color:black");
            }
            else{
                console.log("Collision occuered between %c"+object1.key+"( X:"+object1.centerX+", Y:"+object1.centerY+" )\n"+
                        "%c and %c"+object2.key+"( X:"+object2.centerX+", Y:"+object2.centerY+" )\n"+
                        "%c at ( X: "+(object1.centerX+object2.centerX)/2+"Y: "+(object1.centerY+object2.centerY)/2+" )",
                        "background:blue; color:white",
                        "color:black",
                        "color:green",
                        "color:black");
            }
        }
    }    
}
