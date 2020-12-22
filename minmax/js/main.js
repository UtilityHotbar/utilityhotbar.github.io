const clone = new rfdc();

var updatevar = null;

// Define core variables
var player = {
  'name':'test',
  'level':1,
  'levelCap':26,
  'power':1,
  'factor':0.0001,
  'xp':0,
  'threshold':100,
  'gold':0,
}

var village = {
  'drunk':0,
  'retired':0,
  'trainer':0,
  'hireling':0,
  'fighter':0,
  'battlemaster':0,
  'pop':0,
  'maxpop':50
}

var costs = {
  'drunk':10,
  'retired':100,
  'trainer':1000,
  'hireling':250,
  'fighter':5000,
  'battlemaster':100000
}

//Setup code
var mode = 'fight';
var fight_term = new Terminal();
var village_term = new Terminal();
$('#fightConsole').append(fight_term.html)
$('#villageConsole').append(village_term.html)
$('#village').hide();

function toggle() {
  if (mode=='fight'){
    mode = 'train';
    $('#village').show();
    $('#dungeon').hide();
    clearInterval(updatevar);
    updatevar = setInterval(intervalPower,1000);
  }else{
    mode = 'fight';
    $('#dungeon').show();
    $('#village').hide();
    clearInterval(updatevar);
    updatevar = setInterval(intervalKills,1000);
  }

}

function updateStats() {
  Object.keys(player).forEach((item, i) => {
    curr = player[item]
    if (item == 'power'){
      curr = curr.toFixed(4)
    }
    $('#'+item).html(curr)
  });
}

function updateVillage() {
  Object.keys(village).forEach((item, i) => {
    curr = village[item]
    $('#'+item).html(curr)
  });
}

function runEncounter (name, p, isPlayer = true){
  data = monster_data[player.level];
  m = data[Math.floor(Math.random() * data.length)];
  suffix = m[m.length-1] == 's' ? '' : 's'
  if (isPlayer){ // Only players earn xp for kills
    xp = Math.ceil(Math.random() * 10*player.level)*p;
  }else{
    xp = 0;
  }
  g = Math.floor(Math.random() * player.level)*p;
  if (p == 1){
    fight_term.print(name+' defeated a '+m+' for '+xp+' xp and '+g+' gold.');
  }else{
    fight_term.print(name+' defeated '+p+' '+m+suffix+' for '+xp+' xp and '+g+' gold.');
  }

  player.xp += xp;
  player.gold += g;
  if (player.xp > player.threshold){
    if (player.level < player.levelCap) {
      player.xp -= player.threshold;
      player.threshold = player.threshold * 7;
      player.level += 1;
      fight_term.print(player.name+' levelled up!');
    }
  }
  updateStats();
}

function buy(item, cost){
  if (player.gold>cost){
    if (village.pop<village.maxpop){
      player.gold -= cost;
      village[item]+=1
      village.pop+=1
      village_term.print('You hired a '+item+' for '+cost+' gold.')
    }else{
      village_term.print('Not enough population space!')
    }
  }else{
    village_term.print('Not enough gold!')
  }
  updateStats();
  updateVillage();
}

function intervalKills(){
  console.log (village.hireling)
  if (village.hireling > 0){
    runEncounter('Your hirelings', village.hireling, false)
  }
  if (village.fighter > 0){
    runEncounter('Your fighters', village.fighter*10, false)
  }
  if (village.battlemaster > 0){
    runEncounter('Your battlemasters', village.battlemaster*100, false)
  }
  updateStats()
}

function intervalPower(){
  player.power+=village.drunk*1*player.factor
  player.power+=village.retired*15*player.factor
  player.power+=village.trainer*200*player.factor
  updateStats()
}

function changeName(){
  n = prompt('Enter new name');
  player.name = n;
  updateStats();
}

$('#makeRoom').click(() => {runEncounter(player.name, Math.floor(player.power))});
$('#returnVillage').click(toggle);
$('#returnDungeon').click(toggle);
$('#changeName').click(changeName);

Object.keys(costs).forEach((item, i) => {
  $('#buy_'+item).click(() => {buy(item, costs[item])})
});


updateStats();
updateVillage();
console.log('game set up done');

// Projects

function makeProject(name, callback, cost){
  $('#projects').append('<button id=project_"'+name+'">'+name+'</button> ('+cost+')');
  $('#project_'+name).click(callback);
}

function clearProject(){
  $('#projects').empty();
}

function buyProject(name, cost, costType='gold'){
  if (costType == 'gold') {
    if (player.gold >= cost){
      player.gold -= cost
      village_term.print('You brought the improvement '+name+' for '+cost+' gold.')
      return true
    }else{
      village_term.print('Not enough gold!')
      return false
    }
  }
  else if (costType.startsWith('village')) {
    costStr = costType.split('_')[1]
    if (village[costType] >= cost){
      village[costType] -= cost
      village_term.print('You achieved the improvement '+name+' with '+cost+' '+costStr+'s.')
      return true
    }else{
      village_term.print('Not enough '+costStr+'s!')
      return false
    }
  }
}
$('#projectButton').click(expandTavern)

function expandTavern() {
  if (buyProject('expand tavern', 1000)){
    clearProject();
    village.maxpop += 50;
    makeProject('Improve Village', improveVillage, '10000 gold');
    updateVillage();
  }
}

function improveVillage() {
  if (buyProject('improve village', 10000)){
    clearProject();
    village.maxpop += 100;
    makeProject('Reform Drunks', reformDrunks, '50 drunks');
    updateVillage();
  }
}

function reformDrunks() {
  if (buyProject('reform drunks', 50, 'village_drunks')){
    clearProject();
    village.hireling += 50;
    village_term.print('Now reformed, the drunks have been employed to a better use as loyal hirelings.');
    updateVillage();
  }
}
