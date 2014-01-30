var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, omega, itemType) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.isAlive = true;
        this.x = x;
        this.y = y;

        this.frame = 3;
        this.omega = omega;
        this.itemType = itemType;
        this.direction = 0;
        this.moveSpeed = 3;
        this.addEventListener('enterframe', function () {
            this.move();
            if (this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
               this.x < -this.width || this.y < -this.height) {
                this.remove();
            } else if(this.age % 25 == 0) {
                this.shot();
            }
        });
        logiOsciGame.game.rootScene.addChild(this);
    },
    shot: function() {
        //                var s = new DirectedBullet(this.x, this.y, Math.PI, Enemy.BULLET_SPEED);
        var s = new AimingBullet(this.x,
                                 this.y,
                                 logiOsciGame.player.x,
                                 logiOsciGame.player.y,
                                 Enemy.BULLET_SPEED);
    },
    move: function () {
        this.direction += this.omega;

        this.x -= ~~(this.moveSpeed * Math.cos(this.direction / 180 * Math.PI));
        this.y += ~~(this.moveSpeed * Math.sin(this.direction / 180 * Math.PI));
    },
    remove: function () {
        logiOsciGame.game.rootScene.removeChild(this);
        delete logiOsciGame.enemies[this.key];
    },
    killed: function() {
        if (this.itemType != null) {
            var item = new Item(this.x, this.y, this.moveSpeed / 2, this.itemType);
            item.key = item.frame;
            logiOsciGame.items.push(item);
            logiOsciGame.game.rootScene.addChild(item);
        }
        this.remove();
        this.isAlive = false;
    }
});

var ZigzagEnemy = enchant.Class.create(Enemy, {
    initialize: function (x, y, omega, itemType) {
        Enemy.call(this, x, y, omega, itemType);
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


var NWayEnemy = enchant.Class.create(Enemy, {
    shot: function() {
        var s = new AimingBullet(this.x,
                                 this.y,
                                 logiOsciGame.player.x,
                                 logiOsciGame.player.y,
                                 Enemy.BULLET_SPEED);
    }
});
Enemy.BULLET_SPEED = 7;
var EnemyType = {
    NORMAL: Enemy,
    ZIGZAG: ZigzagEnemy,
    NWAY: NWayEnemy
};
