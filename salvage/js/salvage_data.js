strengths = [
  'Tech-head',
  'Strong',
  'Evasive',
  'Hardy',
  'Precise',
  'Experienced',
  'Observant',
  'Cold',
  'Tactical',
  'Well-connected'
]

weaknesses = [
  'Tech-fearing',
  'Weak',
  'Slow',
  'Frail',
  'Clumsy',
  'Novice',
  'Careless',
  'Empathic',
  'Hot-headed',
  'Hated'
]

equipment = [
  'Diagnostic kit',
  'Grappling hook',
  'Motion tracker',
  'Thermal visor',
  'Multitool',
  'Medkit (1 Wound)',
  'Distress beacon',
  'Microgenerator (d8)',
  'Lost keycard (1 use)',
  'Suit repair kit (d4)'
]

roll = (d) => {return Math.ceil(Math.random()*d)};

function createChar() {
  s = roll(10)-1
  w = roll(10)-1
  while (w == s){
    console.log('clash')
    w = roll(10)-1
  }
  e = roll(10)-1
  console.log(w,s,e)
  document.write('<ul><li><b>Strength: </b>'+strengths[s]+'</li><li><b>Weakness: </b>'+weaknesses[w]+'</li><li><b>Equipment: </b>'+equipment[e]+'</li></ul>')
}
