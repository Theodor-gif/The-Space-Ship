class player{
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.move = new control();
        this.player = document.createElement("img");
        this.player.src = "./Images/player-spaceShip.png";
        
    }
    playerDraw(){
        this.player.setAttribute("style", `position:absolute; width:${this.width}px; height:${this.height}px; top:${this.y}px; left:${this.x}px;`);
        return this.player;
    }
    playerPosition(){
        this.player.style.top = this.y + "px";
        this.player.style.left = this.x + "px";
    }
    playerMove(){
        const drive = this.move;
        if(drive.top){
            this.y -= 5;
        }
        if(drive.down){
            this.y += 5;
        }
        if(drive.left){
            this.x -= 5;
        }
        if(drive.right){
            this.x += 5;
        }

       


        this.playerPosition();
    }
}