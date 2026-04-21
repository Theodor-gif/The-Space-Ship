class enemy{
    constructor(){
        this.top = 0;
        this.left = Math.floor(Math.random() * 600) + 1;
        this.height = 100;
        this.width = 100;
        this.enemy = document.createElement("img");
        this.enemy.src = ("./Images/planet.png");
    }
    drawEnemy(){
        this.enemy.setAttribute("style" ,
            `display:none; width:${this.width}px; height:${this.height}px; 
             position:absolute; top:${this.top}px; left:${this.left}px; `);
        return this.enemy;
    }
    positionEnemy(){
        this.enemy.style.top = this.top + "px";
        this.enemy.style.left = this.left + "px";
    }
    update(){
        this.top += 15;
        this.positionEnemy();
        if(this.top > 600){
            this.top = 0;
            this.left = Math.floor(Math.random() * 600) + 1;
            this.positionEnemy();
        }
    }
}