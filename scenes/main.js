const moveX = 120
const jumpY = 360 
const bigJumpY = 550
let currentJumpForce = jumpY
const enemySpeed = 25
let isJumping = true
const fall_death = 600
//ui layer 
layer(['obj', 'ui'], 'obj')
const maps = [[  '                                                   o                                            o                             ',
  '         o                                                                   o                                        o       ',
  '                             o                                                                       o                        ',
  '                                                          o                                                             o     ',
  '                                                                                                       ^   ^                  ',
  '           %                                                                                          ===========             ',
  '                                                                                                                              ',
  '       %  =*=%=                                        -+         -+       *                      =*=                         ',
  '                                             -+        ()         ()                                                          ',
  '                               -+            ()        ()         ()                                                          ',
  '                 ^    ^        ()            () ^      ()  ^ ^    ()                                                          ',
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',], 
   [
    '!                                          !',
    '!                                          !',
    '!                                          !',
    '!                                          !',
    '!                                          !',
    '!                                          !',
    '!                                          !',
    '!                                          !',
    '!                                          !',
    '!                                 s        !',
    '!         77777                 s s        !',
    '!                             s s s        !',
    '!                     e     s s s s    -+  !',
    '!                         s s s s s    ()  !',
    'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  ] ]
//the actual map

//configure the map 
const levelConfig = {
  width:20,
  height:20,
  //1st Level
  '=' : [sprite('block'), solid()],
  'o' : [sprite('clouds')],
  'x' : [sprite('brick'), solid()],
  '$' : [sprite('coin'), 'coin'],
  '%' : [sprite('question'), 'coin-surprise', solid()],
  '*' : [sprite('question'), 'mushroom-surprise', solid()],
  '}' : [sprite('unboxed'), solid()],
  '(' : [sprite('pipe-left'),'pipe-l' ,scale(0.5), solid()],
  ')' : [sprite('pipe-right'), 'pipe-r' ,scale(0.5), solid()],
  '-' : [sprite('pipe-top-left-side'), 'pipe' ,scale(0.5), solid()],
  '+' : [sprite('pipe-top-right-side'),'pipe' ,scale(0.5), solid()],
  '^' : [sprite('evil-shroom-1'),'dangerous' ,solid(), body()],
  '#' : [sprite('mushroom'), 'mushroom', body()],
  //2nd Level 
  '!' : [sprite('blue-brick'), 'blue-brick', solid(),scale(0.5)],
  'z' : [sprite('blue-block'), 'blue-block', solid(),scale(0.5)],
  's' : [sprite('blue-steel'), 'blue-steel', solid(),scale(0.5)],
  'e' : [sprite('blue-evil-shroom'),'dangerous' ,solid(), body()],
  '7' : [sprite('blue-surprise'),'coin-surprise',solid(),scale(0.5)],
}
const levelIndx = args.level ?? 0
//make level
const gameLevel = addLevel(maps[levelIndx], levelConfig)

const scoreGlobal = args.score ?? 0
 //add score
 const scoreLabel = add([
   text(scoreGlobal),
   pos(30,6),
   layer('ui'),
   {
     value: scoreGlobal,
   }
 ])

 add([text('level ' + parseInt(levelIndx + 1)), pos(40,6)])



function big() {
  let timer = 0
  let isBig = false
  return {
    update() {
      if (isBig) {
        timer -=dt()
        if (timer <=0) {
          this.smallify()
        }
      }
    },
    isBig() {
      return isBig
    },
    smallify() {
      this.scale = vec2(1)
      timer = 0
      isBig = false
      currentJumpForce = jumpY
    },
    biggify(time) {
      this.scale = vec2(2)
      timer = time
      isBig = true
      currentJumpForce = bigJumpY
    }
  }
}

//mario
const player = add([sprite('mario-standing'),
 pos (30,30),
 body(),
 big(),
 origin('bot')
 ])

 //when player collides with enemy
player.collides('dangerous', (d) => {
  if(isJumping) {
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
    destroy(d)
  }else{
  go('lose', {score: scoreLabel.value})
  }
})

//player camera 
player.action(() => {
camPos(player.pos) 
if(player.pos.y >= fall_death){
  go('lose', {score: scoreLabel.value})
}
})

//check if player is grounded then change to isJumping equals false
player.action(() => {
  if(player.grounded()){
    isJumping = false
  }
})

//player movement 
//jump
keyPress('up', () => {
  if(player.grounded()){
  isJumping = true
  player.jump(currentJumpForce)
  }
})
//jump
keyPress('space', () => {
  if(player.grounded()){
  isJumping = true
  player.jump(currentJumpForce)
  }
})



//move left
keyDown('left', () => {
  player.move(-moveX,0)
  
})
//move right
keyDown('right', () => {
  player.move(moveX,0)
})

player.on('headbump', (obj) => {
  if(obj.is('coin-surprise')){
    gameLevel.spawn('$', obj.gridPos.sub(0,1))
    destroy(obj)
    gameLevel.spawn('}', obj.gridPos.sub(0,0))
  }
  if(obj.is('mushroom-surprise')){
    gameLevel.spawn('#', obj.gridPos.sub(0,1))
    destroy(obj)
    gameLevel.spawn('}', obj.gridPos.sub(0,0)) 
  }
})
//mushroom movement
action('mushroom', (m) => {
m.move(20,0)
})

//when player collides with mushroom
player.collides('mushroom', (m) => {
  player.biggify(6)
  destroy(m)
})
//when player collides with coin
player.collides('coin', (c) => {
  scoreLabel.value++
  scoreLabel.text = scoreLabel.value
  destroy(c)
})

//enemy movement
action('dangerous', (d) => {
d.move(-enemySpeed,0)
})

player.collides('pipe', () => {
  keyPress('down', () => {
       go('main',  {
       level: (levelIndx + 1) % maps.length,
       score: scoreLabel.value
   })
  })
})

