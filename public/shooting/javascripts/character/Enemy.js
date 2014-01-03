var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, omega) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

        this.frame = 3;
        this.omega = omega;

        this.direction = 0;
        this.moveSpeed = 3;

        this.addEventListener('enterframe', function () {
            this.move();
            if(this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
               this.x < -this.width || this.y < -this.height) {
                this.remove();
            } else if(this.age % 10 == 0) {
//                var s = new DirectedBullet(this.x, this.y, Math.PI, 10);
                var s = new AimingBullet(this.x,
                                         this.y,
                                         logiOsciGame.player.x,
                                         logiOsciGame.player.y,
                                         10);
            }
        });
        logiOsciGame.game.rootScene.addChild(this);
    },
    move: function () {
        this.direction += this.omega;

        this.x -= this.moveSpeed * Math.cos(this.direction / 180 * Math.PI);
        this.y += this.moveSpeed * Math.sin(this.direction / 180 * Math.PI);
    },
    remove: function () {
        logiOsciGame.game.rootScene.removeChild(this);
        delete logiOsciGame.enemies[this.key];
    }
});

var ZigzagEnemy = enchant.Class.create(Enemy, {
    initialize: function (x, y, omega) {
        Enemy.call(this, x, y, omega);
        this.frame = 4;
        this.time = 0;
        this.v_direction = 1;
    },
    move: function() {
        this.x -= this.moveSpeed * Math.cos(this.direction / 180 * Math.PI);
        this.y += this.moveSpeed * this.v_direction;
        this.time++;
        if (this.time == 20) {
            this.v_direction *= -1;
            this.time = 0;
        }
    }
});

