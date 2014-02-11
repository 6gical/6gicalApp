var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function (game, width, height, life) {
        enchant.Sprite.call(this, width, height);
        this.game = game;
        this.isAlive = true;
        this.life = life;
        this.attackInterval = 25;
        this.addEventListener('enterframe', function () {
            this.move();
            if (this.y > game.height || this.x > game.width ||
               this.x < -this.width || this.y < -this.height) {
                this.remove();
            } else if(this.age % this.attackInterval == 0) {
                this.shot();
            }
        });
        game.enemies.push(this);
        game.rootScene.addChild(this);
    },
    shot: function() {
    },
    move: function () {
    },
    remove: function () {
        var list =  this.game.enemies;
        var l = list.length;
        this.game.rootScene.removeChild(this);
        for (var i = 0; i < l; i++) {
            if (list[l - 1 -i] === this) {
                list.splice(l - 1 - i, 1);
            }
        }
    },
    damaged: function() {
        this.life--;
        if (this.life > 0) return;
        if (this.itemType != null) {
            var item = new Item(this.game,
                                this.x, this.y,
                                this.moveSpeed / 2,
                                this.itemType);
            item.key = item.frame;
            this.game.items.push(item);
            this.game.rootScene.addChild(item);
        }
        this.remove();
        this.isAlive = false;
    }
});

var NormalEnemy = enchant.Class.create(Enemy, {
    initialize: function (game, x, y, omega, itemType) {
        Enemy.call(this, game, 16, 16, 1);
        this.image = this.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

        this.frame = 3;
        this.omega = omega;
        this.itemType = itemType;
        this.direction = 0;
        this.moveSpeed = 3;
    },
    shot: function() {
        //                var s = new DirectedBullet(this.game, this.x, this.y, Math.PI, Enemy.BULLET_SPEED);
        var s = new AimingBullet(this.game,
                                 this.x, this.y,
                                 this.game.player.x, this.game.player.y,
                                 Enemy.BULLET_SPEED);
    },
    move: function () {
        this.direction += this.omega;

        this.x -= ~~(this.moveSpeed * Math.cos(this.direction / 180 * Math.PI));
        this.y += ~~(this.moveSpeed * Math.sin(this.direction / 180 * Math.PI));
    }
});


var ZigzagEnemy = enchant.Class.create(NormalEnemy, {
    initialize: function (x, y, omega, itemType) {
        NormalEnemy.call(this, x, y, omega, itemType);
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


var NWayEnemy = enchant.Class.create(NormalEnemy, {
    shot: function() {
        var s = new NWayBullets(this.game,
                                this.x, this.y,
                                -5, 0,
                                30,
                                5);
    }
});
Enemy.BULLET_SPEED = 7;
var EnemyType = {
    NORMAL: NormalEnemy,
    ZIGZAG: ZigzagEnemy,
    NWAY: NWayEnemy
};
