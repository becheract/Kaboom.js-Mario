const map = [
  '                                                                                                                              ',
  '                                                                                                                              ',
  '                                                                                                                              ',
  '                                                                                                                              ',
  '                                                                                                       ^   ^                  ',
  '           %                                                                                          ===========             ',
  '                                                                                                                              ',
  '       %  =*=%=                                        -+         -+       *                      =*=                         ',
  '                                             -+        ()         ()                                                          ',
  '                               -+            ()        ()         ()                                                          ',
  '                 ^    ^        ()            () ^      ()  ^ ^    ()                                                          ',
  '=======================================================================================  =====================================',
  '=======================================================================================  =====================================',
]

const levelConfig = {
  width:20,
  height:20,
  '=' : [sprite('block')],
  'x' : [sprite('brick')],
  '$' : [sprite('coin')],
  '%' : [sprite('question'), 'coin-surpirse'],
  '*' : [sprite('question'), 'mushroom-surpirse'],
  '}' : [sprite('unboxed')],
  '(' : [sprite('pipe-left'), scale(0.5)],
  ')' : [sprite('pipe-right'), scale(0.5)],
  '-' : [sprite('pipe-top-left-side'), scale(0.5)],
  '+' : [sprite('pipe-top-right-side'), scale(0.5)],
  '^' : [sprite('evil-shroom-1')],
  '#' : [sprite('mushroom')],
}

addLevel(map, levelConfig)