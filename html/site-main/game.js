$(document).ready(function(){
console.log('Initialising');

var reference = {
  others: ['Caloric Fluid C', 'Caput Mortum 🝎'],
  primes: ['Hydragyrum ☿', 'Sulphuris 🜍', 'Salis 🜔'], // Mind, Soul, Body | Female, Male, Body | Metal, Combustion, Base Matter
  elements: ['Terra 🜃', 'Aqua 🜄', 'Aër 🜁', 'Ignis 🜂'], // Earth, Water, Air, Fire
  salts: ['Salis 🜔', 'Salis Primis 🜔\'', 'Salis Secundus 🜔\'\'', 'Salis Tertius 🜔\'\'\''],
  mundanes: ['Stibium ♁', 'Arsenicum 🜺', 'Bisemutum 🜘', 'Borium =', 'Lithium L', 'Magnesium ⊛', 'Phosphorus P', 'Platinum ☽☉', 'Kalium K', 'Sulphuris 🜍', 'Zincum Z'],
  metals: ['Plumbum ♄', 'Stannum ♃', 'Ferrum ♂', 'Cuprum ♀', 'Hydragyrum ☿', 'Argentum ☽', 'Aurum ☉'],
  highers : ['Quintessence 🜀', 'Aurum Potabile |☉|'] // Aether/Quintessence
};

var codex = {
  'Caloric': 'The essential fluid of all alchemical operations, containing concentrated heat.',
  'Caput Mortum': 'Translated directly as \'Dead Head\', <i>Caput Mortum</i> represent worthless alchmical dregs, accumulated in the process of the <i>magnum opus</i>.',
  'Terra': 'The elemental essence of Earth, passed down from Empedocles.',
  'Aqua': 'The elemental essence of Water, passed down from Empedocles.',
  'Aër': 'The elemental essence of Air, passed down from Empedocles.',
  'Ignis': 'The elemental essence of Fire, passed down from Empedocles.',

  'Hydragyrum': 'Mercury- One of the three alchemical primes. Known for its volatility and fluid nature, it is a liquid prime that contains a female, metallic essence often associated with the mind',
  'Sulphuris': 'Sulphur- One of the three alchemical primes. Known for its irascibility and inflammatory nature, it is a solid prime that represents the soul and a male, combustive essence.',
  'Salis': 'Salt- Most mundane of the three alchemical primes. Coarse matter that nevertheless ameliorates the extremes of the other primes, the purification and transubstantiation of salis mirrors the journey of the alchemist themselves as they seek the <i>magnum opus</i>. The purified forms of salis, being exhausted in operation, adds no mass to the final product, but changes the alchemical nature of it irrevocably.',

  'Salis Primis': 'The first elevation of salt. A white gleam shines through the now refined crystals. To be purified, salis must first be sifted: Combine salis with aër.',

  'Stibium': 'Antimony- Once used in distant Aegyptus for the decorating of eyes under the local <i>nom de plume</i> \'Kohl\', this lustrous metal shares a heritage with hydragyrum and terra.',
  'Arsenicum': 'Arsenic- A common poison valued widely for that purpose, the natural product of hydragyrum infused with aqua. Many an alchemist has suffered through the accidental  imbibement of this otherwise valued element',
  'Bisemutum': 'Bismuth- A radiant metal that comes from the blending of hydragyrum and terra, it is renowned for its stability and resistance to decay- indications of a superb moral character.',
  'Borium': 'Boron- Legends tell of the aethereal luminence of stars that first graced the earth with this strange material. It is now possible to alchemically synthesise such a material through the refinement of bismetum and aër, but certain alchemists hold that natural borium has a radiance all of its own.',
  'Lithium': 'Lithium- The lightest of the metals, lithium possesses a volatility and lustfulness that urges to flame at even the smallest of provocations. Hydragyrum and ignis combine to craft this delicate metal that may only be stored in oils.',
  'Magnesium': 'Magnesium- While in its raw alchemical form it rivals lithium in reactivity, exposure to air soon corrodes this delicate metal and it can often be found with a thin layer of impure dust from exposure to air. Combine lithium and ignis- and beware flames.',
  'Phosphorus': 'Phosphorus- The first of the artificial elements to be discovered via atomic alchemy, phosphorus in its natural state annihilates itself too swiftly to be harvested. The pale luminesence released by the mixture of magnesium and aër is an alluring sight.',
  'Platinum': 'Platinum- Brightest of the metals, with purity inviolate, the stalwart visage of this metal rivals even the sun and moon in intensity. Its steadfastness is inherited from Borium, although further enhanced with ignis.',
  'Kalium': 'Potassium- Having inherited her name from the late work of modern alchemists, kalium is a superbly ductile and malleable metal that spawns from the softening of lithium through aqua.',
  'Zincum': 'Zinc- The last of the mundane elements, it demonstrates a remarkable resemblance with and comity towards magnesium, being the product of it and terra and found abundantly beneath the soil.',

  'Salis Secundus': 'The second elevation of salt. The material is fine, as sand. Create with salis primis and magnesium.',
  'Plumbum': 'Lead- The domain of Saturnus, the final planet and the Roman protector of time. Formed through the elevation of the mundane in zincum via salis secundus.',
  'Stannum': 'Tin- Dominated by Jupiter Optimus Maximus and the planet for which he is named. Craft by imbibing plumbum with salis secundus.',
  'Ferrum': 'Iron- The product of Mars, god of war, whose bloodied domain extends to industry, spawned through the elevation of stannum and salis secundus',
  'Cuprum': 'Copper- Fertile gift of Venus and the domain of love, the last of the common planetary metals. Made via ferrum and salis secundus.',

  'Salis Tertius': 'The third and final refinement of salt, gateway to the final triad of planetary metals. Imbibe salis secundus with cuprum to produce.',
  'Argentum': 'Silver- Formed from the alchemical prime representing the domain of metal and the final, rarefied, teritary form of salis, it is the penultimate planetary metal, second only to aurum herself. It gleams with the purity only found in the cold rays of lunar light, which it represents.',
  'Aurum': 'Gold- Last and greatest of the planetary metals, embodiment of Sol herself, she gleams with a purity and lustre that earthly objects cannot hope to compare against. Here the  <i>magnum opus</i> approaches its apex and conclusion, heralding a world beyond the Aonian mounts of Man\'s imagination. Argentum and salis tertius combine to symbolise the miracle of alchemical unison and transubstantiation, a fusion of the divine order and the alchemist whose labours reveal it.',

  'Quintessence': 'Quintessence- Known to the Greeks as <i>aether</i>, this mysterious element is said to be the combination of all four elemental essences, and thus impossible to create due to the current limitations of atomic alchemy.',
  'Aurum Potabile': 'The combination of quintessence and gold, the final stage of the <i>Magnum Opus</i>. Only multiplication and projection remain.'
};

var ingredients = {
  others: ['Caloric', 'Caput Mortum'],
  primes: ['Hydragyrum', 'Sulphuris', 'Salis'], // Mind, Soul, Body | Female, Male, Body | Metal, Combustion, Base Matter
  elements: ['Terra', 'Aqua', 'Aër', 'Ignis'], // Earth, Water, Air, Fire
  salts: ['Salis', 'Salis Primis', 'Salis Secundus', 'Salis Tertius'], // Salt, First Salt, Second Salt, Third Salt
  mundanes: ['Stibium', 'Arsenicum', 'Bisemutum', 'Borium', 'Lithium', 'Magnesium', 'Phosphorus', 'Platinum', 'Kalum', 'Sulphuris', 'Zincum'], // Antimony, Arsenic, Bismuth, Boron, Lithium, Magnesium, Phosphorus, Platinum, Potassium, Sulphur, Zinc
  metals: ['Plumbum', 'Stannum', 'Ferrum', 'Cuprum', 'Hydragyrum', 'Argentum', 'Aurum'], // Lead, Tin, Iron, Copper, Mercury, Silver, Gold | Saturn, Jupiter, Mars, Venus, Mercury, Moon, Sun
  highers : ['Quintessence', 'Aurum Potabile'] // Aether/Quintessence
};

var recipes = {

  // [[INGREDIENTS], HEAT COST, [RESULTS], HEAT GENERATED]
  // ∴ Division
  'fission': [[{'Sulphuris':1},3,{'Caput Mortum':0.5},12],
              [{'Salis':1},3,{'Caput Mortum':0.5},6],
              [{'Hydragyrum':1},3,{'Caput Mortum':0.5},9],
              [{'Ignis':2},5,{'Sulphuris':2},10],
              [{'Aër':2},5,{'Sulphuris':1, 'Salis':1},10],
              [{'Aqua':2},5,{'Hydragyrum':2},10],
              [{'Terra':2},5,{'Hydragyrum':1, 'Salis':1},10],
              [{'Arsenicum':2},15, {'Hydragyrum':1, 'Aqua':1},45,],
              [{'Bismetum':2},15, {'Hydragyrum':1, 'Terra':1},45,],
              [{'Borium':2},18, {'Bismetum':1, 'Aër':1},54,],
              [{'Lithium':2},15, {'Hydragyrum':1, 'Ignis':1},45,],
              [{'Magnesium':2},18, {'Lithium':1, 'Ignis':1},52,],
              [{'Kalium':2},18, {'Lithium':1, 'Aqua':1},52,],
              [{'Phosphorus':2},21, {'Magnesium':1, 'Aër':1},63,],
              [{'Platinum':2},21, {'Borium':1, 'Ignis':1},63,],
              [{'Zincum':2},24, {'Magnesium':1, 'Terra':1},72,],
             ],

  // ∵ Unison
  'fusion': [[{'Caloric':40},0,{'Ignis':2},1],
             [{'Sulphuris':2},10,{'Ignis':2},1],
             [{'Sulphuris':1, 'Salis':1},10,{'Aër':2},1],
             [{'Hydragyrum':2},10,{'Aqua':2},1],
             [{'Hydragyrum':1, 'Salis':1},10,{'Terra':2},1],
             [{'Aër':1, 'Salis':1},10,{'Salis Primis':1},1],
             [{'Hydragyrum':1, 'Aqua':1},50,{'Arsenicum':2},5],
             [{'Hydragyrum':1, 'Terra':1},50,{'Bismetum':2},5],
             [{'Bismetum':1, 'Aër':1},60,{'Borium':2},6],
             [{'Hydragyrum':1, 'Ignis':1},50,{'Lithium':2},5],
             [{'Lithium':1, 'Ignis':1},60,{'Magnesium':2},6],
             [{'Lithium':1, 'Aqua':1},60,{'Kalium':2},6],
             [{'Magnesium':1, 'Aër':1},70,{'Phosphorus':2},7],
             [{'Borium':1, 'Ignis':1},70,{'Platinum':2},7],
             [{'Magnesium':1, 'Terra':1},80,{'Zincum':2},8],
             [{'Magnesium':1, 'Salis Primis':1},100,{'Salis Secundus':1},1],
             [{'Zincum':2, 'Salis Secundus':1},200,{'Plumbum':2},20],
             [{'Plumbum':2, 'Salis Secundus':1},400,{'Stannum':2},40],
             [{'Stannum':2, 'Salis Secundus':1},600,{'Ferrum':2},60],
             [{'Ferrum':2, 'Salis Secundus':1},800,{'Cuprum':2},80],
             [{'Cuprum':1, 'Salis Secundus':1},1000,{'Salis Tertius':1},1],
             [{'Hydragyrum':2, 'Salis Tertius':1},5000,{'Argentum':2},500],
             [{'Argentum':2, 'Salis Tertius':1},10000,{'Aurum':2},1],

             [{'Note': 1, 'Caloric':1},0,{'Charred Note': 1},0]
            ],
  // ♒︎ Multiplication
  'multiplication': [],
  // ♓︎ Projection
  'projection': [],
  // ♐︎ Ceration
  'ceration': [[['Platinum', 1],['Aqua', 2]],4,[['Plumbum', 1]],1],

};

var operations = {
  '∴': 'fission',
  '∵': 'fusion',
  '♒︎': 'multiplication',
  '♓︎': 'projection',
  '♐︎': 'ceration'
};

var symbol_index = {
  '∴': 'fission',
  '∵': 'fusion',
  '♒︎': 'multiplication',
  '♓︎': 'projection',
  '♐︎': 'ceration',
  'C': 'Caloric Fluid',
  '🝎': 'Caput Mortum',
  '☿': 'Hydragyrum',
  '🜍': 'Sulphuris',
  '🜔': 'Salis',
  '🜃': 'Terra',
  '🜄': 'Aqua',
  '🜁': 'Aër',
  '🜂': 'Ignis',
  '🜔': 'Salis',
  '🜔\'': 'Salis Primis',
  '🜔\'\'': 'Salis Secundus',
  '🜔\'\'\'': 'Salis Tertius',
  '♁': 'Stibium',
  '🜺': 'Arsenicum',
  '🜘': 'Bisemutum',
  '=': 'Borium',
  'L': 'Lithium',
  '⊛': 'Magnesium',
  'P': 'Phosphorus',
  '☽☉': 'Platinum',
  'K': 'Kalium',
  'Z': 'Zincum',
  '♄': 'Plumbum',
  '♃': 'Stannum',
  '♂': 'Ferrum',
  '♀': 'Cuprum',
  '☽': 'Argentum',
  '☉': 'Aurum',
  '🜀': 'Quintessence',
  '|☉|': 'Aurum Potabile',

  'Note': 'Note'
}

var time = 0;
var heatTimer = 0;
var heatWait = 5;

var updateList = ['fissionMenu', 'fusionMenu1', 'fusionMenu2'];

var jobList = {};

var limitList = [0,0,0];
var limitListDesig = ['Hydragyrum', 'Sulphuris', 'Salis'];
var limitListPrice = [6,6,3];

try{
  previous_save = window.localStorage.getItem('mass-defect-save');
}catch(DOMException){
  previous_save = null;
};

if (previous_save == null){
  console.log('Creating New Save')
  var Player = {
    discovered: {
      others : ['Caloric'],
      primes: ['Hydragyrum', 'Sulphuris', 'Salis'],
      elements: [],
      salts: ['Salis'],
      mundanes: [],
      metals: ['Aurum'],
      highers: []
    },
    stats : {
      'Caloric': [1000, 0],
      'Caput Mortum': [0, 0.25],
      'Note': [0,0],
      'Letter': [0,0],
      'Charred Note': [0,0],

      'Hydragyrum': [1, 0.1],
      'Sulphuris': [1, 0.1],
      'Salis': [1, 0.1],

      'Terra': [0, 0],
      'Aqua': [0, 0],
      'Aër': [0, 0],
      'Ignis': [0, 0],

      'Salis Primis': [0, 0.25],
      'Stibium': [0, 0.3],
      'Arsenicum': [0, 0.25],
      'Bisemutum': [0, 0.3],
      'Borium': [0, 0.3],
      'Lithium': [0, 0.3],
      'Magnesium': [0, 0.3],
      'Phosphorus': [0, 0.25],
      'Platinum': [0, 0.4],
      'Kalium': [0, 0.3],
      'Zincum': [0, 0.3],

      'Salis Secundus': [0, 0.5],
      'Plumbum': [0, 0.5],
      'Stannum': [0, 0.55],
      'Ferrum': [0, 0.6],
      'Cuprum': [0, 0.65],

      'Salis Tertius': [0, 0.75],
      'Argentum': [0, 0.8],
      'Aurum': [0, 0.9],

      'Quintessence': [0, 0],
      'Aurum Potabile': [0, 0]
    },
    states : ['New'],
  };

}else{
  console.log('Save Detected');
  var Player = JSON.parse(previous_save);
};
console.log(Player);

function AddItem(thing){
  isNew = false;
  Object.keys(ingredients).forEach((category, i) => {
    if (ingredients[category].includes(thing) && !Player.discovered[category].includes(thing)){
      Player.discovered[category].push(thing);
      if (!isNew){
        $('#newElement').html('<br><b>'+LookupItem(thing)+'</b>'+'<p>'+codex[thing]+'</p>')
        $('#newElementModal').modal('show')
      };
      isNew = true;
    };
  });
  return isNew;
};

function AddHeat(){
  console.log('Mining calories');
  Player.stats['Caloric'][0] += 1
  heatTimer = heatWait;
  // heatWait += 1 // Progressively increase wait time to discourage autoclicking
  $('#CollectCalories').attr('disabled', true);
  $('#caloricWait').html(heatTimer+'🝮 remaining');
  UpdateVisual();
};

function LookupItem(thing, mode='text'){
  for (let n=0; n<Object.keys(reference).length; n++) {
    category = Object.keys(reference)[n];
    for (let i=0; i<reference[category].length; i++){
      item = reference[category][i];
      if (mode=='text'){
        // Search using text, returning full name for display
        if (item.includes(thing)){
          return item;
        };
      }else{
        // Search using symbol, returns name of item ONLY
        var k = item.split(' ');
        if (k.slice(-1)==thing){
          return k.slice(0,-1).join(' ');
        };
      };
    };
  };
  return thing;
};

function LookupInventory(thing){
  for (let n=0; n<Object.keys(Player.discovered).length; n++) {
    category = Object.keys(Player.discovered)[n];
    if (Player.discovered[category].includes(thing)){
      return true;
    };
  };
  return false;
};

function LookupUnit(thing){
  if (thing=='Caloric'){
    return 'ℨ';
  }else{
    return '℈';
  };
};

function Buy(item, cost, amt=1, auto=false){
  if (item=='NULL'){
    return;
  };
  cost *= amt;
  console.log('Buying '+amt+item+' for '+cost);
  if (Player.stats['Caloric'][0]>=cost){
    console.log('Transaction successful');
    Player.stats['Caloric'][0] -= cost;
    console.log(Player.stats[item][0]);
    Player.stats[item][0] += amt;
    UpdateVisual();
  }else{
    if (!auto){
      $('#errorBuyModal').modal('show');
    }
  };
};

function UpdateVisual(){
  $('#time').html('<p><b>Memento Mori</b> '+time+'🝮</p>');
  curr_text = $('#stats').html();
  new_text = '';
  Object.keys(Player.stats).forEach((material, i) => {
    if (LookupInventory(material) || Player.stats[material][0]>0){
      new_text += '<p>'+LookupItem(material)+' <font size="-0.5">'+Player.stats[material][0]+LookupUnit(material)+'</font></p>';
      // $('#stats').html($('#stats').html()+'<a draggable=True>'+LookupItem(material)+' </a>'+Player.stats[material][0]+'<br>')
    };
  });
  if (!(new_text==curr_text)){
    $('#stats').html(new_text);
  };
};

function UpdateCycle(){
  time += 1;
  console.log(Player);
  console.log(jobList);
  if (heatTimer>0){
    heatTimer -= 1;
    $('#caloricWait').html(heatTimer+'🝮 remaining');
    if (heatTimer==0){
      $('#CollectCalories').attr('disabled', false);
      $('#caloricWait').html('');
    };
  };
  UpdateVisual();
  updateList.forEach((item, i) => {
    UpdateMenu(item);
  });
  Object.keys(jobList).forEach((item, i) => {
    if (jobList[item]>0){
      console.log('Doing job', item, jobList[item], 'times');
      times = jobList[item];
      item = item.split(' ');
      console.log(item);
      reactionType = operations[item[0]];
      reagents = item.slice(1).map((x)=>(LookupItem(x, 'symbol')));
      console.log(reactionType, reagents);
      for (let i=0; i<times; i++){
        console.log('reacting');
        reaction(reactionType, reagents, true);
      };
    };
  });

  limitList.forEach((item, i) => {
    if (item>0 && Player.stats[limitListDesig[i]][0]<5){
      console.log('Autobuying', limitListDesig[i])
      Buy(limitListDesig[i], limitListPrice[i], item, true);
    };
  });
  UpdateJournal();
  UpdateSave();
};

function UpdateMenu(menu){
  if (menu[0] != '#'){
    menu = '#'+menu;
  };
  console.log('Checking', menu);
  var curr_text = $(menu).html();
  var new_text = '<option value="NULL">---</option>';
  Object.keys(Player.stats).forEach((material, i) => {
    if (Player.stats[material][0] > 0){
      new_text += '<option value="'+menu+material+'">'+LookupItem(material).split(' ').slice(-1).pop()+'</option>';
    };
  });
  if (new_text != curr_text){
    console.log('Updating');
    $(menu).html(new_text);
  };
};

function UpdateSave(){
  try{
    window.localStorage.setItem('mass-defect-save', JSON.stringify(Player));
    console.log('Save done');
  }catch(DOMException){
    console.log('Save failed');
  };
}

function UpdateBuyer(){
  var h = parseInt($('#autoBuyHydragyrum').val().replace('autoBuyHydragyrum',''));
  var s = parseInt($('#autoBuySulphuris').val().replace('autoBuySulphuris',''));
  var a = parseInt($('#autoBuySalis').val().replace('autoBuySalis',''));
  limitList = [h,s,a];
}

function UpdateCrafter(){
  var f = $('#autoCraftFormula').val().replace('autoCraftFormula','');
  var a = parseInt($('#autoCraftAmount').val().replace('autoCraftAmount',''));
  console.log('Trying to make crafter for', f, a);
  if (isNaN(a)){
    $('#errorCrafterAmount').modal('show');
    return;
  }
  var failed = false;
  f.split(' ').forEach((item, i) => {
    if (symbol_index[item] == undefined){
      $('#errorCrafterFormula').modal('show');
      failed = true;
    }
  });

  if (failed){
    return;
  }

  var cost = a*100;
  if (Player.stats['Caloric'][0]>=cost){
    Player.stats['Caloric'][0] -= cost;
    if (jobList[f] === undefined){
      jobList[f] = a;
    }else{
      jobList[f] += a;
    };
  }else{
    $('#errorBuyModal').modal('show');
  };
};

function UpdateCrafterManager(){
  Object.keys(jobList).forEach((item, i) => {
    var k = item.split(' ');
    var label = 'autoCraft'+([operations[k[0]], k.slice(1).map((x)=>(LookupItem(x,'symbol'))).join('-')].join('-'));
    console.log ('LABELIS', label);
    var new_val = parseInt($('#'+label).val().replace(label,''));
    console.log('Changing autocrafter for', item, 'to', new_val);
    if (new_val > jobList[item]){
      addCost = (new_val-jobList[item])*100;
      if (Player.stats['Caloric'][0]>=addCost){
        console.log('Caloric cost passed');
        Player.stats['Caloric'][0] -= addCost;
        jobList[item] = new_val;
      }else{
        $('#errorBuyModal').modal('show');
      };
    }else{
      jobList[item] = new_val;
    };
  });
  UpdateCrafterManagerMenu();
};

function UpdateCrafterManagerMenu(){
  console.log('Update craft manager');
  var new_str = '';

  Object.keys(jobList).forEach((item, i) => {
    var k = item.split(' ');
    if (jobList[item]>0){
      var label = 'autoCraft'+([operations[k[0]], k.slice(1).map((x)=>(LookupItem(x,'symbol'))).join('-')].join('-'));
      console.log ('LABELIS', label);
      new_str += item+' <input id="'+label+'" type="number" min="0" placeholder="Amount" value="'+jobList[item]+'"><br>';
    };
  });
  $('#autoCraftManager').html(new_str);

};

var sections = {
  'Caloric': '<h6>Tier 1 (Primes & Fundamentals)</h6>',
  'Terra': '<h6>Tier 2 (1-10ℨ)</h6>',
  'Salis Primis': '<h6>Tier 3 (10-100ℨ)</h6>',
  'Salis Secundus': '<h6>Tier 4 (100-1000ℨ)</h6>',
  'Salis Tertius': '<h6>Tier 5 (1000-10000ℨ)</h6>',
};

function UpdateCodex(){
  var curr_str = $('#codexReagents').html();
  var codex_str = '';
  Object.keys(Player.stats).forEach((item, i) => {
    if (Object.keys(sections).includes(item)){
      codex_str += sections[item];
    }
    var looked = LookupItem(item);
    if (LookupInventory(item)){

      codex_str += '<p>'+(i+1)+'. <b>'+looked+'</b></p><p>'+codex[item]+'</p>';
    }else{
      codex_str += '<p>'+(i+1)+'. ??? '+looked.split(' ').slice(-1)+'</p><p><i>???</i></p>';
    };
  });
  if (curr_str!=codex_str){
    $('#codexReagents').html(codex_str);
  };
};

var curr_entry = 2;
var incomplete_entries = ['Ignis', 'Salis Primis', 'Lithium', 'Amaneuensis', 'King', 'Note'];

function UpdateJournal(){
  incomplete_entries.forEach((item, i) => {
    if (LookupInventory(item)){
      console.log('new entry', incomplete_entries);
      incomplete_entries.splice(i,1);
      $('#journal').html('<b>Entry '+curr_entry+'</b>'+$('#entry_'+item.replace(' ', '_')).html()+$('#journal').html()+'<br>');
      curr_entry += 1;
    }else if ((item=='Amaneuensis') && (Object.keys(jobList).length!=0)) {
      incomplete_entries.splice(i,1);
      $('#journal').html('<b>Entry '+curr_entry+'</b>'+$('#entry_Amaneuensis').html()+$('#journal').html()+'<br>');
      curr_entry += 1;
    }else if (item=='King'){
      if (LookupInventory('Salis Secundus')){
        incomplete_entries.splice(i,1);
        Player.stats['Letter'][0]+=1;
        Player.stats['Note'][0]+=1;
        $('#journal').html('<b>Entry '+curr_entry+'</b>'+$('#entry_King').html()+$('#journal').html()+'<br>');
        curr_entry += 1;
      };
    }else if (item=='Note'){
      if (Player.stats['Charred Note'][0]>0){
        incomplete_entries.splice(i,1);
        $('#secret').html('<b>The University and their benefactors know about your visitor from the confederation. Take this as a warning: whatever you do, do not accept his offer. <i>Nemo me impune lacessit.</i></b>');
        $('#secret_hint').html('');
      };
    };;
  });


}

function getMaterials(target,amts){
  console.log('Starting reaction with '+target);
  if (target[0] != '#'){
    target = '#'+target;
  };
  var reagents = [];
  if (amts==1){
    reagent = $(target+'Menu').children("option:selected").val().replace(target+'Menu','');
    console.log(reagent);
    reagents.push(reagent);
  }else{
    for (let i=0;i<amts;i++){
      reagent = $(target+'Menu'+(i+1)).children("option:selected").val().replace(target+'Menu'+(i+1),'');
      console.log(reagent);
      if (reagent != "NULL"&&!reagents.includes(reagent)){
        reagents.push(reagent);
      };
    };
  };
  reaction(target.replace('#',''), reagents);
};

function reaction(operation, materials, auto=false){
  if (materials[0] == materials[1]){
    materials = [materials[0]];
  };
  console.log('Reaction', operation, materials);
  possible = recipes[operation];
  materials = materials.sort();
  for (let i=0;i<possible.length;i++){
    var curr_test = possible[i];
    var needed = curr_test[0];
    var cost = curr_test[1];
    var result = curr_test[2];
    var refund = curr_test[3];
    var raw = Object.keys(needed).sort();
    if (JSON.stringify(raw) == JSON.stringify(materials)){
      if (Player.stats['Caloric'][0]>=cost){
        console.log('Caloric test passed');
        for (let i = 0; i < Object.keys(needed).length; i++) {
          if (Player.stats[Object.keys(needed)[i]][0] < needed[Object.keys(needed)[i]]){
            if (!auto){
              $('#errorReagentModal').modal('show');
            };
            console.log('Insufficient materials');
            return;
          };
        };
        Player.stats['Caloric'][0]-=cost;
        Object.keys(needed).forEach((item, i) => {
          Player.stats[item][0]-=needed[item];
        });
        Object.keys(result).forEach((item, i) => {
          AddItem(item);
          if (operation == 'fusion'){
            Player.stats[item][0]+=result[item]*(1-Player.stats[item][1]);
          }else{
            Player.stats[item][0]+=result[item];
          };
        });
        Player.stats['Caloric'][0] += refund;
        console.log('Operation completed successfully');
        break;
      }else{
        if (!auto){
          $('#errorFluidModal').modal('show');
        };
      };
    };
  };
  updateList.forEach((item, i) => {
    UpdateMenu(item);
  });
  UpdateVisual();
};

setInterval(UpdateCycle, 1000);

$('#CollectCalories').click(AddHeat);
$('#buy').click(() => {t=$('#buyMenu').children("option:selected").val().replace('buyMenu','').split('|'); Buy(t[0], parseInt(t[1]));});
$('#autoBuyButton').click(UpdateBuyer);
$('#autoCraftButton').click(UpdateCrafter);
$('#fission').click(() => {getMaterials('fission', 1)});
$('#fusion').click(() => {getMaterials('fusion', 2)});
$('#autoCraftModal').on('shown.bs.modal', UpdateCrafterManagerMenu);
$('#autoCraftManagerButton').click(UpdateCrafterManager);
$('#codexModal').on('show.bs.modal', UpdateCodex);

// DO NOT TOUCH BEYOND THIS LINE
}
)
