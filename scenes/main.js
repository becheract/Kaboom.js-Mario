//ui layer 
layer(['obj', 'ui'], 'obj')

//the actual map
const map = [
  '                                                   o                                            o                             ',
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
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
]
//configure the map 
const levelConfig = {
  width:20,
  height:20,
  '=' : [sprite('block'), solid()],
  'o' : [sprite('clouds')],
  'x' : [sprite('brick'), solid()],
  '$' : [sprite('coin')],
  '%' : [sprite('question'), 'coin-surprise', solid()],
  '*' : [sprite('question'), 'mushroom-surprise', solid()],
  '}' : [sprite('unboxed')],
  '(' : [sprite('pipe-left'), scale(0.5), solid()],
  ')' : [sprite('pipe-right'), scale(0.5), solid()],
  '-' : [sprite('pipe-top-left-side'), scale(0.5), solid()],
  '+' : [sprite('pipe-top-right-side'), scale(0.5), solid()],
  '^' : [sprite('evil-shroom-1'), solid()],
  '#' : [sprite('mushroom'), 'mushroom', body()],
}
//make level
const gameLevel = addLevel(map, levelConfig)
 //add score
 const scoreLabel = add([
   text('0'),
   pos(30,6),
   layer('ui'),
   {
     value: '0',
   }
 ])

 add([text('level ' + '0'), pos(40,6)])

  function big(){
    let timer = 0 
    let isBig = false
    return {
      update() {
        if(isBig){
          timer -=dt()
          if(timer <= 0) {
            this.smallify()
          }
        }
      },
      isBig(){
        return isBig
      },
      smallify() {
        this.scale = vec2(1)
        timer = 0
        isBig = false
      },
      biggify() {
        this.scale = vec2(2)
        timer = time
        isBig = true
      }
    }
  }

//mario
const player = add([sprite('mario-standing'),
 pos (30,30),
 body()
 big()
 ])

const moveX = 120
const jumpY = 360 
//player movement 
//jump
keyPress('up', () => {
  if(player.grounded()){
  player.jump(jumpY)
  }
})
//jump
keyPress('space', () => {
  if(player.grounded()){
  player.jump(jumpY)
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

action('mushroom', (m) => {
m.move(20,0)
})

player.collides('mushroom', (m) => {
  player.biggify(6)
  destroy(m)
})