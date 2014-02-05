var Boss = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        var width = 200;
        var height = 200;
        enchant.Sprite.call(this, width, height);

        this.surface = new Surface(width, height);
        this.surface.context.fillStyle = 'brown';
        this.surface.context.fillRect(0, 0, width, height);
        this.image = this.surface;
        logiOsciGame.game.rootScene.addChild(this);
        var x = logiOsciGame.screenWidth - this.width * 1.1;
        var y = (logiOsciGame.screenHeight - this.height) / 2;
        this.moveTo(x, y);

        var partLife = 50;

        var eyeWidth = 20;
        var eyeHeight = 30;

        this.leftEye = new Enemy(eyeWidth, eyeHeight, partLife);
        this.leftEye.shot = function() {
            var s = new AimingBullet(this.x,
                                     this.y,
                                     logiOsciGame.player.x,
                                     logiOsciGame.player.y,
                                     Enemy.BULLET_SPEED);
        };

        this.leftEye.surface = new Surface(eyeWidth, eyeHeight);
        this.leftEye.surface.context.fillStyle = 'blue';
        this.leftEye.surface.context.fillRect(0, 0, eyeWidth, eyeHeight);
        this.leftEye.image = this.leftEye.surface;

        this.leftEye.moveTo(x + 60, y + 50);

        this.rightEye = new Enemy(eyeWidth, eyeHeight, partLife);
        this.rightEye.shot = function() {
            var s = new AimingBullet(this.x, this.y,
                                     logiOsciGame.player.x,
                                     logiOsciGame.player.y,
                                     Enemy.BULLET_SPEED);
        };

        this.rightEye.surface = new Surface(eyeWidth, eyeHeight);
        this.rightEye.surface.context.fillStyle = 'green';
        this.rightEye.surface.context.fillRect(0, 0, eyeWidth, eyeHeight);
        this.rightEye.image = this.rightEye.surface;

        this.rightEye.moveTo(x + this.width - eyeWidth - 60, y + 50);
        logiOsciGame.game.rootScene.addChild(this.rightEye);

        var noseWidth = 20;
        var noseHeight = 30;
        this.nose = new Enemy(noseWidth, noseHeight, partLife);
        this.nose.attackInterval = 50;
        this.nose.shot = function() {
            var s = new NWayBullets(this.x, this.y,
                                    -5, 0,
                                    30,
                                    5);
        };

        this.nose.surface = new Surface(noseWidth, noseHeight);
        this.nose.surface.context.fillStyle = 'gold';
        this.nose.surface.context.fillRect(0, 0, noseWidth, noseHeight);
        this.nose.image = this.nose.surface;

        this.nose.moveTo(x + (this.width - noseWidth) / 2, y + 105);
        logiOsciGame.game.rootScene.addChild(this.nose);

        var mouthWidth = 60;
        this.mouth = new Enemy(mouthWidth, 10, partLife);
        this.mouth.shot = function() {
            var s = new DirectedBullet(this.x, this.y, Math.PI, Enemy.BULLET_SPEED);
        };


        this.mouth.surface = new Surface(width, height);
        this.mouth.surface.context.fillStyle = 'purple';
        this.mouth.surface.context.fillRect(0, 0, mouthWidth, 10);
        this.mouth.image = this.mouth.surface;

        this.mouth.moveTo(x + (this.width - mouthWidth) / 2, y + 155);

        this.addEventListener('enterframe', function () {
            if (!this.leftEye.isAlive && !this.rightEye.isAlive &&
                !this.nose.isAlive && !this.mouth.isAlive) {
                this.remove();
                logiOsciGame.game.onclear();
            }
        });

        logiOsciGame.game.rootScene.addChild(this.mouth);

        var animation = function(node) {
            var h = 120;
            var w = 350;
            var low = 50;
            var high = 25;
            node.tl
                .moveBy(0, h, low)
                .moveBy(0, -h, low)
                .moveBy(0, -h, low)
                .moveBy(0, h, low)
                .moveBy(-w, 0, high)
                .moveBy(w, 0, high)
                .moveBy(0, h, low)
                .moveBy(0, -h, low)
                .moveBy(0, -h, low)
                .moveBy(-w, 0, high)
                .moveBy(w, 0, high)
                .moveBy(0, h, low)
            .then(function() {
                animation(node);
            });
        };
        animation(this);
        animation(this.leftEye);
        animation(this.rightEye);
        animation(this.nose);
        animation(this.mouth);
    },
    attack: function() {
    }
});
