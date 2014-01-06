var SpaceBg = enchant.Class.create(enchant.Sprite, {
    initialize: function(width, height) {
        enchant.Sprite.call(this, width, height);
        this.stars = [];
        this.bgSurface = new Surface(width, height);
        this.image = this.bgSurface;
        this.width = width;
        this.height = height;
    },
    COLORS: ['white', 'red', 'blue', 'green', 'yellow'],
    createStar: function() {
        this.stars.push({
            x: this.width,
            y: rand(this.height),
            size: rand(3),
            speed: rand(3),
            colorIndex: rand(3)
        });
    },
    scroll: function(frame) {
        if (!(frame % 10)) {
            this.createStar();
        }
        for (var i = this.stars.length - 1; i > 0; i--) {
            var s = this.stars[i];
            this.bgSurface.context.fillStyle = this.COLORS[s.colorIndex];
            this.bgSurface.context.clearRect(s.x, s.y, s.size, s.size);
            s.x -= s.speed;
            this.bgSurface.context.fillRect(s.x, s.y, s.size, s.size);
            if (s.x < 0) {
                this.stars.splice(i, 1);
            }
        }
    }
});
