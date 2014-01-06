var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, direction) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.direction = direction;
        this.moveSpeed = 10;
        this.addEventListener('enterframe', this.move);
        logiOsciGame.game.rootScene.addChild(this);
    },
    move: function() {
        this.x += this.moveSpeed * Math.cos(this.direction);
        this.y += this.moveSpeed * Math.sin(this.direction);
        if (this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
           this.x < -this.width || this.y < -this.height) {
            this.remove();
        }
    },
    remove: function () {
        logiOsciGame.game.rootScene.removeChild(this);
        delete this;
    }
});
