const canvas = document.querySelector('canvas');
const tela = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

tela.fillRect(0, 0, canvas.width, canvas.height);

const gravidade = 0.5

class sprite {
    constructor({position, velocidade, color = 'blue', offset }){
        this.position = position
        this.velocidade = velocidade
        this.width = 50
        this.height = 150
        this.lastkey
        this.attack_Box ={
            position:{
              x: this.position.x,
              y: this.position.y
            },
            offset,
            width: 100,
            height: 50
            },  
        this.color = color
        this.atacando
        this.health = 100
    }
    
    desenho(){
        //personagem
        tela.fillStyle = this.color
        tela.fillRect(this.position.x, this.position.y, this.width, this.height)
        
        //Attack box
        if(this.atacando){
        tela.fillStyle = 'green'
        tela.fillRect
        (
        this.attack_Box.position.x,
        this.attack_Box.position.y,
        this.attack_Box.width,
        this.attack_Box.height
        )
    }
    }

    update(){
        this.desenho()

        this.attack_Box.position.x = this.position.x + this.attack_Box.offset.x
        this.attack_Box.position.y = this.position.y

        this.position.x += this.velocidade.x
        this.position.y += this.velocidade.y

        if (this.position.y + this.height + this.velocidade.y >= canvas.height){
            this.velocidade.y = 0
        } else this.velocidade.y += gravidade
    }
    attack(){
        this.atacando = true
        setTimeout(() => {
            this.atacando = false
        }, 100);
    }
}

const player = new sprite({
    position: {
        x:0,
        y:0
    },
    velocidade:{
        x:0,
        y:0
    },
    offset:{
        x: 0,
        y: 0
    },
})


const enemy = new sprite({
    position:{
        x: 400,
        y: 100
    },
    velocidade:{
        x: 0,
        y: 0
    },
    color: 'red',
    offset:{
        x: -50,
        y: 0
    },
})

console.log(player);

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function colisaoRetangulo({ retangulo1, retangulo2 }){
    return (
    retangulo1.attack_Box.position.x + retangulo1.attack_Box.width >= retangulo2.position.x &&
    retangulo1.attack_Box.position.x <= retangulo2.position.x + retangulo2.width &&
    retangulo1.attack_Box.position.y + retangulo1.attack_Box.height >= retangulo2.position.y && 
    retangulo1.attack_Box.position.y <= retangulo2.position.y + retangulo2.height
    )
}

function vencedor({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }

}

let timer = 60
let timerId
function cronometro(){
    if (timer > 0) {
        timerId = setTimeout(cronometro, 1000)
        timer-- 
        document.querySelector('#timer').innerHTML = timer
    }
    
    if(timer === 0){
        vencedor({player, enemy, timerId})

        if (player.health === enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Tie'
        } else if (player.health > enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
        } else if (player.health < enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}
}

cronometro();

function animacao() {
    window.requestAnimationFrame(animacao)
    tela.fillStyle = 'black'
    tela.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocidade.x = 0
    enemy.velocidade.x = 0

    //Movimentação player
    if(keys.a.pressed && player.lastkey === 'a'){
        player.velocidade.x = -5
    }else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocidade.x = 5
    }

    //Movimentação inimiga
    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocidade.x = -5
    }else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocidade.x = 5
    }

    //Colisão
    if (
        colisaoRetangulo({
            retangulo1: player,
            retangulo2: enemy
    }) &&
    player.atacando
    ){
     player.atacando = false
     enemy.health -= 20
     document.querySelector('#vidaInimigo').style.width = enemy.health + '%'
     console.log('colisao')
    }
    if (
        colisaoRetangulo({
            retangulo1: enemy,
            retangulo2: player
    }) &&
    enemy.atacando
    ){
     enemy.atacando = false
     player.health -= 20
     document.querySelector('#vidaPlayer').style.width = player.health + '%'
     console.log('colisao inimiga')
    }

    // gameOver pela vida
    
    if(enemy.health <=0 || player.health<= 0){
        vencedor({player, enemy, timerId})
    }

}

animacao();

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
        break;
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
        break;
        case 'w':
            player.velocidade.y = -17
        break;
        case ' ':
            player.attack()
        break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
        break;
        case 'ArrowUp':
            enemy.velocidade.y = -17
        break;
        case 'ArrowDown':
            enemy.attack()
        break;
    }
    
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
        break;
        case 'a':
            keys.a.pressed = false
        break;
    }
    //movimentação inimiga
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break;
    }
})