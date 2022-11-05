const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 570
canvas.height = 320

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.jpg'
})

const shop = new Sprite({
  position: {
    x: 340,
    y: 93
  },
  imageSrc: './img/shop.png',
  scale: 1.4,
  framesMax: 6
})

const player = new Fighter({
  position: {
  x: 0,
  y: 0
},
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 8,
  scale: 1.4,
  offset: {
    x: 107,
    y: 90
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/kenji/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 80,
      y: 20
    },
    width: 80,
    height: 30
  }
})

const enemy = new Fighter({
  position: {
  x: 400,
  y: 100
},
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle_1.png',
  framesMax: 4,
  scale: 1.4,
  offset: {
    x: 107,
    y: 100
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle_1.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/samuraiMack/Run_1.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump_1.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall_1.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1_1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take hit_1.png',
      framesMax: 3
    },
    death: {
      imageSrc: './Sprites/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -80,
      y: 20
    },
    width: 80,
    height: 30
  }
})

console.log(player)

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  c.fillStyle = 'rgba(255,255,255,0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  shop.update()
  player.update()
 enemy.update()
  
  // detect for collision & enemy gets hit
  if (
rectangularCollision({
   rectangle1: player,
   rectangle2: enemy
}) &&
    player.isAttacking && player.framesCurrent === 4
    ) {
      enemy.takeHit()
      player.isAttacking = false 
      gsap.to('#enemyHealth', {
        width: enemy.health + '%'
      }) 
    }
    
  // if player misses
if (player.isAttacking && player.framesCurrent === 4) {
  player.isAttacking = false 
}

// this is where our player gets hit
   if (
rectangularCollision({
   rectangle1: enemy,
   rectangle2: player
}) &&
    enemy.isAttacking && enemy.framesCurrent === 2
    ) {
      player.takeHit()
      enemy.isAttacking = false 
      gsap.to('#playerHealth', {
        width: player.health + '%'
      }) 
    }
    
      // if enemy misses
if (enemy.isAttacking && enemy.framesCurrent === 2) {
  enemy.isAttacking = false 
}
    
 // end game based on health 
 if (enemy.health <= 0 || player.health <= 0) determineWinner({ player, enemy, timerId })
 {
  
 }
 // jumping 
 if (player.velocity.y < 0) {
   player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
   player.switchSprite('fall')
 } 
 
 if (player.velocity.x < 0) {
   player.switchSprite('run')
 } else if (player.velocity.x > 0) {
   player.switchSprite('run')
 } else {
   player.switchSprite('idle')
 }
 
 
 if (enemy.velocity.y < 0) {
   enemy.switchSprite('jump')
 } else if (enemy.velocity.y > 0) {
   enemy.switchSprite('fall')
 } 
 
 if (enemy.velocity.x < 0) {
   enemy.switchSprite('run')
 } else if (enemy.velocity.x > 0) {
   enemy.switchSprite('run')
 } else {
   enemy.switchSprite('idle')
 }
}

animate()

    let down = document.getElementById('btnh');
    let left = document.getElementById('btna');
    let right = document.getElementById('btn');
    
    let attack = document.getElementById('btni');
    let back = document.getElementById('btne');
    let front = document.getElementById('btnc');

    down.ontouchstart = function() { player.attack();}
    left.ontouchstart = function() { player.velocity.x = -5;}
    right.ontouchstart = function() { player.velocity.x = 5;}

    down.ontouchend = function() { player.velocity.x = 0;}
    left.ontouchend = function() { player.velocity.x = 0;}
    right.ontouchend = function() { player.velocity.x = 0;}

    attack.ontouchstart = function() { enemy.attack();}
    back.ontouchstart = function() { enemy.velocity.x = -5;}
    front.ontouchstart = function() { enemy.velocity.x = 5;}

    attack.ontouchend = function() { enemy.velocity.x = 0;}
    back.ontouchend = function() { enemy.velocity.x = 0;}
    front.ontouchend = function() { enemy.velocity.x = 0;}
    
    document.getElementById('btnb').addEventListener("click", function() {
      if (btnb) {
        player.velocity.y = -20
      }
    });

document.getElementById('btnf').addEventListener("click", function() {
      if (btnf) {
        enemy.velocity.y = -20
      }
    });
