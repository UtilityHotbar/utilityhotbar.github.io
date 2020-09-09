var day = 0;
var progress = 0;
var energy = 10;
var health = 20;
var max_health = 20;
var total_chores = 0;
var current_chores = 0;
var current_food = 0;
var current_entries = 0;
var curr_task = 'Milk cow';
var curr_hist = 'You milked a cow.';

var daydream_content = [
  ['Listen for rumours', 'Evil runs through the land.'],
  ['Listen for rumours', 'Fear and uncertainty abound.'],
  ['Ruminate on foreboding night visions', 'The world needs a hero.'],
  ['De-underestimate wise old bastards', 'I never realised that about them.'],
  ['Gather supplies', 'It\'s not much, but it will have to do.'],
  ['Fuel determination', 'I have to escape- there\'s no other option.'],
  ['Plot your escape', 'Time to go.']
]
var daydream_progress = 0;
var dreams = 0;
var log = [];

$('#sleep').hide();
$('#current-entries').hide();
$('#daydream').hide();
var showDaydream = false;
$('#chores-ui').hide();
var showChores = false;
$('#energy').hide();
var showEnergy = false;
$('#food').hide();
var showFood = false;
$('#work').click(()=>{
  if (energy > 0){
    energy -= 1;
    progress += 25;
  }else{
    warn('#energy');
  }
  update();
});

$('#food').click(()=>{
  if (current_chores > 0){
    current_chores -= 1;
    current_food += 1;
    energy += 3;
  }else{
    warn('#chores');
  }
  update();
})

$('#sleep').click(()=>{
  if (current_food < 1){
    log_hist('<li>You went to bed starving.</li>');
    health -= 3
  }else if (current_food < 2) {
    log_hist('<li>You went to bed hungry.</li>');
    health -= 1;
  }else{
    log_hist('<li>You went to bed.</li>');
    if (health < max_health){
      health += 1
    }
  }
  energy = 10;
  current_food = 0;
  current_chores = 0;
  day += 1;
  update();
})

$('#dream').click(()=>{
  if (energy > 0){
    energy -= 1;
    daydream_progress += parseInt(Math.random()*25)
    update();
  }else {
    warn('#energy');
  }
})

$('#tab2').click(()=>{
  $('#current-entries').hide();
  current_entries = 0;
})

$('#tab2').hover((e)=>{
  $('#current-entries').fadeTo("fast", 0.0);
  e.stopPropagation();
},(e)=>{
  $('#current-entries').fadeTo("fast", 0.75);
  e.stopPropagation();
})

function warn(id){
  $(id).toggleClass('shake shake-constant');
  setTimeout(function () {
    $(id).toggleClass('shake shake-constant');
  }, 500);
}

function log_hist(){
  var entry = [];
  for (var i=0;i<arguments.length;i++){
    entry.push(arguments[i]);
  }
  $('#history').prepend(entry.join(' '));
  current_entries += 1;
  update();
}

function log_raw(){ //log without updating to avoid loop
  var entry = [];
  for (var i=0;i<arguments.length;i++){
    entry.push(arguments[i]);
  }
  $('#history').prepend(entry.join(' '));
  current_entries += 1;
}

var warned5 = false;
var warned10 = false;
function update(){
  if (health <= 0){
    log_raw('<b>You died of hunger.</b>');
    $('#content1').html('<div class="alert alert-danger">You died of hunger. Daydreams do not sustenance make...</div>')
  }else if (health <= 5 && !warned5) {
    log_raw('<b>You are in dire health.</b>');
    warn('#history-tab');
    warned5=true;
  }else if (health <= 10 && !warned10) {
    log_raw('<b>You are in poor health.</b>');
    warn('#history-tab');
    warned10=true;
  }
  if (progress>100){
    total_chores += 1;
    current_chores += 1;
    progress = 0;
    log_hist('<li>'+curr_hist+'</li>')
    var new_chore = generate_text('chore').split('|');
    curr_task = new_chore[0];
    curr_hist = new_chore[1];
    $('#current-chore').html(curr_task);
  }
  $('#current-chores').html(current_chores);
  $('#total-chores').html(total_chores);
  $('#current-energy').html(energy);
  var curr_progress = $('#current-progress').attr('class').match(/w-\d+/g)[0];
  $('#current-progress').removeClass(curr_progress).addClass('w-'+progress);
  // Set energy levels
  if (energy < 8 && energy >= 4){
    $('#current-energy').removeClass('success danger').addClass('warning');
  }else if (energy < 4) {
    $('#current-energy').removeClass('warning success').addClass('danger');
  }else{
    $('#current-energy').removeClass('warning danger').addClass('success');
  }
  if (energy == 0){
    $('#sleep').show();
  }else{
    $('#sleep').hide();
  }
  // Set history badge
  if (current_entries > 0){
    $('#current-entries').show();
    $('#current-entries').html(current_entries);
  }
  // Set daydream progress
  if (daydream_progress>100){
    daydream_progress = 0;
    log_hist('<li><i>'+daydream_content[dreams][1]+'</i></li>');
    dreams += 1;
    if (dreams<daydream_content.length){
      $('#current-daydream').html(daydream_content[dreams][0]);
      console.log(dreams, daydream_content[dreams])
    }else{
      log_hist('<b>You escape into the wider unknown...</b>');
      $('#content1').html('<div class="alert alert-success">Packing what meagre supplies you have left, you escape into the wider unknown, into the dangers that await...</div>');
    }
  }
  var curr_day_progress = $('#daydream-progress').attr('class').match(/w-\d+/g)[0];
  $('#daydream-progress').removeClass(curr_day_progress).addClass('w-'+daydream_progress);
  // Gradually hide button
  $('#work').fadeTo('fast',1-0.2*dreams);
  if (1-0.2*dreams==0){
    $('#work').hide()
  }
  // Achievements for persistence
  if (day==30){
    log_raw('<li>You are congratulated for your hard work.</li>')
  }else if (day==60) {
    log_raw('<li>Your work has attracted local attention.</li>')
  }else if (day==90) {
    log_raw('<li>Your service has secured your marriage.</li>')
  }else if (day==150) {
    log_raw('<li>Your lord has granted you a small fief.</li>')
  }else if (day==200) {
    log_raw('<b>You retire after a dull and uneventful life of service.</b>')
    $('#content1').html('<div class="alert alert-success">After a long, hard life your arms have finally given out, and you can retire in peace as your children take over. You still wonder, however, what would have happened if you had indulged in those errant daydreams of your youth...</div>');
  }
  // Gradually unveil ui elements
  if (progress==25&&!showEnergy){
    $('#energy').show();
    showEnergy = true;
  }
  if (total_chores==1&&!showChores){
    $('#chores-ui').show();
    showChores = true;
  }
  if (energy<3&&!showFood){
    $('#food').show();
    showFood = true;
  }
  if (total_chores>=10&&!showDaydream) {
    $('#daydream').show();
    showDaydream = true;
  }
}
