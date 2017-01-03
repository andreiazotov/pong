;(function() {

    function Game(fieldId) {
        this.canvas = document.getElementById(fieldId);
        this.field = this.canvas.getContext("2d");
        this.gameSize = {
            width: this.field.canvas.width,
            height: this.field.canvas.height
        };
        this.bodies = [new Bat(this.gameSize, "left"), new Bat(this.gameSize, "right"), new Ball(this.gameSize)];
        var game = this;
        function tick() {
            game.update(game.bodies[0], game.bodies[1], game.bodies[2]);
            game.draw(game.bodies[0], game.bodies[1], game.bodies[2]);
            requestAnimationFrame(tick);
        }
        tick();
    }

    Game.prototype.update = function(leftBat, rightBat, ball) {
        leftBat.move(ball, this.gameSize);
        rightBat.move(ball, this.gameSize);
        ball.move(leftBat, rightBat, this.gameSize);
        document.getElementById("leftBat").innerHTML = leftBat.score;
        document.getElementById("rightBat").innerHTML = rightBat.score ;
    };

    Game.prototype.draw = function(leftBat, rightBat, ball) {
        this.field.clearRect(0, 0, this.gameSize.width, this.gameSize.height);
        this.field.fillStyle = "#df740c";
        this.field.fillRect(leftBat.position.x, leftBat.position.y, leftBat.size.width, leftBat.size.height);
        this.field.fillRect(rightBat.position.x, rightBat.position.y, rightBat.size.width, rightBat.size.height);
        this.field.fillRect(ball.position.x, ball.position.y, ball.size.width, ball.size.height);
        this.field.fillRect(this.gameSize.width / 2 - 1, 0, 2, this.gameSize.height);
    };

    function Bat(gameSize, type) {
        this.size = {
            width: 10,
            height: 90
        };
        this.position = {};
        this.position.x = type === "left" ? 0 : gameSize.width - this.size.width;
        this.position.y = (gameSize.height - this.size.height) / 2;
        this.score = 0;
        this[type] = true;
    }

    Bat.prototype.move = function(ball, gameSize) {
        if (this.right) {
            this.position.y = ball.position.y - (this.size.height - ball.size.height) / 2;
        } else {
            var bat = this;
            window.onkeydown = function(e) {
                if (e.keyCode === 87) bat.position.y -= 10; // "W" key
                if (e.keyCode === 83) bat.position.y += 10; // "S" key
            };
        }
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.y > gameSize.height - this.size.height) this.position.y = gameSize.height - this.size.height;
    };

    function Ball(gameSize) {
        this.size = {
            width: 10,
            height: 10
        };
        this.position = {
            x: gameSize.width / 2 - this.size.width / 2,
            y: gameSize.height / 2 - this.size.height / 2
        };
        this.velocity = {
            dx: 4,
            dy: 0
        };
    }

    Ball.prototype.move = function(leftBat, rightBat, gameSize) {
        if (this.position.x < 0 || this.position.x > gameSize.width) {
            if (this.position.x < 0) {
                rightBat.score++;
            } else {
                leftBat.score++;
            }
            this.position.x = (gameSize.width - this.size.width) / 2;
            this.position.y = (gameSize.height - this.size.height) / 2;
            this.velocity.dx *= -1;
            this.velocity.dy = 0;
            leftBat.position.y = (gameSize.height - leftBat.size.height) / 2;
        }
        if (this.position.y < 0 || this.position.y > gameSize.height - this.size.height) {
            this.velocity.dy *= -1;
        }
        if (this.position.x < leftBat.position.x + leftBat.size.width && this.position.y >= leftBat.position.y && this.position.y + this.size.height <= leftBat.position.y + leftBat.size.height) {
            this.velocity.dx *= -1;
            this.velocity.dy = (leftBat.position.y + leftBat.size.height / 2 - this.position.y - this.size.height / 2) / -10;
        }
        if (this.position.x > gameSize.width - 2 * rightBat.size.width) {
            this.velocity.dx *= -1;
        }
        this.position.x += this.velocity.dx;
        this.position.y += this.velocity.dy;
    };

    window.onload = function() {
        new Game("field-for-pong");
    };

})();
