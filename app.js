document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isGameOver = false;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight =false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;
    let fallTimeout = 30;
    
    function createDoodler(){
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    class Platform {
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }
    function createPlatforms(){
        for( let i = 0; i < platformCount; i++){
            let platformgap = 600 / platformCount;
            let newPlatformBottom = 100 + i * platformgap;
            let newPlatfrom = new Platform(newPlatformBottom)
            platforms.push(newPlatfrom)
        }
    }
    
    function movePlatforms(){
        if (doodlerBottomSpace > 0){
            platforms.forEach(platform =>{
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';
             
                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();

                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                    score++;
                    
                    if(score>25 && score <= 50)
                        fallTimeout =25;
                    else if (score > 50 && score <=75)
                        fallTimeout =20;
                    else if (score > 75 && score <=100){
                        fallTimeout =15;
                        platformCount = 4;
                    }
                    else if (score > 100 ){
                        fallTimeout =15;
                        platformCount = 3;
                    }
                }
            })
        }
    }
    function jump() {
        clearInterval(downTimerId)
        isJumping = true;
        upTimerId = setInterval( () => {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if(doodlerBottomSpace > startPoint + 200){
                fall();
            }
        },30)
    }
    function fall(){
     clearInterval(upTimerId)
     isJumping = false;
     downTimerId = setInterval( () => {
         doodlerBottomSpace -= 5;
         doodler.style.bottom = doodlerBottomSpace + 'px';
         if(doodlerBottomSpace <= 0){
             gameOver();
        }
        platforms.forEach(platform =>{
            if(
                (doodlerBottomSpace >= platform.bottom) &&
                (doodlerBottomSpace <= platform.bottom + 15) &&
                ((doodlerLeftSpace +60) >= platform.left) &&
                (doodlerLeftSpace <= (platform.left + 85)) &&
                !isJumping
            ){
                startPoint = doodlerBottomSpace;
                jump();
            }

        })
     },fallTimeout)
    }
    
    function gameOver(){
        console.log('gameOver');
        isGameOver =  true;
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId)
    }

    function control(event){
        if (event.key === "ArrowLeft"){
            moveLeft();
        }
        else if(event.key === "ArrowRight"){
            moveRight();
        }
        else if(event.key === "ArrowUp"){
            moveStraight();
        }
    }
  

    function moveLeft(){
        clearInterval(leftTimerId)
        if(isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            }
            else{
                moveRight();
                clearInterval(leftTimerId);

            }
        },30)
    }

    function moveRight(){
        clearInterval(rightTimerId);
        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false;
        }
        isGoingRight = true;

        rightTimerId = setInterval(function(){
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            }
            else {
                moveLeft();
                clearInterval(rightTimerId)

            }
        },30)
    }

    function moveStraight(){
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
        isGoingLeft = false;
        isGoingRight = false;
    }
    function start(){
        if(!isGameOver){
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keyup', control)
        }
    }
    start();

})