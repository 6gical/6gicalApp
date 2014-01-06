var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

	this.shoots = [];

        this.frame = 0;

        logiOsciGame.game.rootScene.addEventListener('touchstart', function (e) {
            logiOsciGame.player.x = e.x;
            logiOsciGame.player.y = e.y;
            logiOsciGame.game.touched = true;
        });
        logiOsciGame.game.rootScene.addEventListener('touchmove', function (e) {
            logiOsciGame.player.x = e.x;
            logiOsciGame.player.y = e.y;
        });
        logiOsciGame.game.rootScene.addEventListener('touchend', function (e) {
            logiOsciGame.player.x = e.x;
            logiOsciGame.player.y = e.y;
            logiOsciGame.game.touched = false;
        });

        this.addEventListener('enterframe', function () {
            if (logiOsciGame.game.touched && logiOsciGame.game.frame % 3 == 0 &&
		this.shoots.length < logiOsciGame.PLAYER_SHOOT_MAX) {
                var s = new PlayerShoot(this.x, this.y, this);
		this.shoots.push(s);
            }
        });

        logiOsciGame.game.rootScene.addChild(this);
    }
});

var PlayerShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y, owner) {
        Shoot.call(this, x, y, 0);
	this.owner = owner;
        this.addEventListener('enterframe', function () {
            for (var i in logiOsciGame.enemies) {
                if(logiOsciGame.enemies[i].intersect(this)) {
                    this.remove();
                    logiOsciGame.enemies[i].remove();
                    logiOsciGame.game.score += 100;
                }
            }
        });
    },
    remove: function() {
	var self = this;
	this.owner.shoots.some(function(v, i){
	    if (v == self) {
		self.owner.shoots.splice(i, 1);
	    }
	});
	Shoot.prototype.remove.call(this);
    }
});
