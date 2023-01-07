const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const skills = ['melee', 'ranged', 'defense', 'medicine', 'navigation', 'footing', 'perception']

base_hero = {
    'name': 'You',
    'hp': 20,
    'max_hp': 20,
    'attacks': 1,
    'damage': 6,
    'gold': 0,
    'ranged_attacks': 0,
    'ranged_damage': 4,
    'stats': {
        'str': 18,
        'dex': 18,
        'con': 18,
        'int': 18,
        'wis': 18,
        'cha': 18,
    },
    'skills': {
        'melee': 0,
        'ranged': 0,
        'defense': 0,
        'medicine': 0,
        'navigation': 0,
        'footing': 0,
        'perception': 0,
        'spellcasting': 0,
    },
    'inventory': [],
    'spells': {},
}

base_monster = {
    'name': 'Nameless',
    'hp': 10,
    'max_hp': 10,
    'attacks': 1,
    'damage': 6,
    'speed': 0,
    'tactic': 0,
    'strange': 0,
    'tough': 0,
}

monster_index = {
    1: [{'name': 'goblin', 'tactic': 1}, {'name': 'dire wolf', 'speed': 1}, {'name': 'rogue drone', 'damage': 8}],
    2: [{'name': 'smartgel slime consumer', 'speed': -2, 'tactic': -1, 'strange': 1}, {'name': 'hostile obelisk', 'strange': 2, 'tough': 1}],
    3: [{'name': 'partially defective terminator', 'tactic': 1, 'strange': -1}, {'name': 'acolyte wizard', 'speed': -1, 'damage': 10}, {'name': 'analytic philosopher', 'tactic': 2, 'strange': 1, 'damage': 4}, {'name': 'acceleration fiend', 'speed': 3},],
    4: [{'name': 'smartgel slime controller', 'speed': -2, 'strange': 1, 'damage': 8}, {'name': 'catacomb warden', 'tactic': 2, 'attacks': 2}],
    5: [{'name': 'rogue joke', 'strange': 3}, {'name': 'dire dire wolf', 'speed': 3}, {'name': 'awakened microcontroller fabricator', 'speed': -1, 'tactic': -1, 'tough': 2}],
    6: [{'name': 'active terminator', 'tactic': 2, 'speed': 1, 'strange': -1, 'damage': 8}],
    7: [{'name': 'mechadragon', 'speed': -1, 'damage': 12, 'tough': 3},],
    8: [{'name': 'optimised clone', 'speed': 2, 'tactic': 2, 'strange': -2, 'damage': 10}, {'name': 'dangerously competent bounty hunter', 'tactic': 4}, {'name':'glitch in spacetime', 'speed': 4, 'tough': 1}],
    9: [{'name': 'content-terminating wormhole'}]
}

base_spell_effects = ['lotus', 'flame', 'matrix', 'tensor',];

base_spell = {
    'name': 'umm',
    'casting_time': 1000,
    'power': 1,
    'effect': 'lotus',
    'risk': 0,
    'cost': 0,
}

curr_length = 18;
curr_level = 1;
curr_turn = 10;
player_dead = false;
player_casting = false;
player_fighting = false;
game_over = false;

QUEUE = [];
OTHER_ELEMENT_QUEUE = [];
PRINTING = false;
const UPDATE_KEYWORD = '%UPDATE%'

function print_term(ts, now=false, d=550, l='mainterm', ) {  // push string or list of strings to print queue
    console.log([ts])
    if (typeof ts === 'string'){
        if (now){
            QUEUE.splice(0, 0, ts)
        }else{
            QUEUE.push(ts);
        }
    }else if (typeof ts === 'object'){
        if (now){
            QUEUE = ts.concat(QUEUE);
        }else{
            QUEUE.push.apply(QUEUE, ts);
        }
    }
    if (QUEUE.length > 0 && !PRINTING){
        PRINTING = true;
        window.setTimeout(()=>{out(d=d, l=l)}, d);
    }
    console.log(QUEUE);
}

function out(delay, elem){  // Grabs top line in queue and pushes it to webpage, then calls itself again after a timeout if there are lines remaining in queue
    t = QUEUE[0];
    QUEUE = QUEUE.slice(1);
    while (t == UPDATE_KEYWORD){
        update_other_elements();
        t = QUEUE[0];
        QUEUE = QUEUE.slice(1);
        if (t == UPDATE_KEYWORD && QUEUE.length == 0){
            PRINTING = false;
            console.log('cont1')
            if (!player_dead){
                loop_step();
            }            
            return;
        }
    }
    if (typeof t !== 'undefined'){
        tl = t + '<br>';
        i = document.getElementById(elem)
        i.innerHTML += tl;
        i.scrollTop = i.scrollHeight;
    }


    if (QUEUE.length > 0){
        window.setTimeout(()=>{out(delay=delay, elem=elem)}, delay);
    }else{
        console.log('cont2')
        PRINTING = false;
        if (!player_dead){
            loop_step();
        }
        return
    }
}

function print_screen(changes, now=false){
    if (now){
        OTHER_ELEMENT_QUEUE.splice(0, 0, changes);
        QUEUE.splice(0, 0, UPDATE_KEYWORD);
    }else{
        OTHER_ELEMENT_QUEUE.push(changes);
        QUEUE.push(UPDATE_KEYWORD);
    }

}

function update_other_elements(){
    t = OTHER_ELEMENT_QUEUE[0];
    OTHER_ELEMENT_QUEUE = OTHER_ELEMENT_QUEUE.slice(1);
    if (typeof t[0] === "object"){
        t.forEach(item => {
            update_indiv_element(item)
        });
    }else{
        update_indiv_element(t)
    }
}

function update_indiv_element(thing){
    elem_name = thing[0];
    elem_new_val = thing[1];
    if (elem_name == 'combat'){
        if (elem_new_val == 'show'){
            document.getElementById('spells').style.display = 'none';
            document.getElementById('nospell').style.display = 'block';

            document.getElementById('combat-table').style.display = 'block';
        }else if (elem_new_val == 'hide'){
            for (i=-6; i<=6; i++){
                document.getElementById('edge'+i).style.backgroundColor = 'inherit';
            }
            document.getElementById('spells').style.display = 'block';
            document.getElementById('nospell').style.display = 'none';
            document.getElementById('combat-table').style.display = 'none';
        }
    }else if (elem_name == 'edge'){
        for (i=-6; i<=6; i++){
            document.getElementById('edge'+i).style.backgroundColor = 'inherit';
        }
        document.getElementById('edge'+elem_new_val).style.backgroundColor = 'antiquewhite';
    }else if (elem_name == 'inventory'){
        document.getElementById('inventory').innerHTML += '* '+elem_new_val+'<br>'
    }else if (elem_name == 'spells'){
        document.getElementById('spells').innerHTML += '<a id="spell_'+elem_new_val+'" href="javascript:cast(\''+elem_new_val+'\')">'+elem_new_val+'</a><br>'
    }else if (elem_name == 'casting-bar'){
        var id = setInterval(load, elem_new_val/100);
        var w = 1;
        function load(){
            if (w > 100 || player_fighting){
                document.getElementById('casting-progress').style.width = '0%'
                clearInterval(id);
            }else{
                w++;
                document.getElementById('casting-progress').style.width = w+'%';
            }
        }
    }else{
        document.getElementById(elem_name).innerHTML = elem_new_val;
    } 
}


function clamp(num, min, max){
    if (num < min){
        return min;
    }else if (num > max){
        return max;
    }else{
        return num;
    }
}

function smallest(){
    s = 'no smallest';
    for (var i = 0; i < arguments.length; i++) {
        curr = arguments[i]
        if (s == 'no smallest'){
            s = curr;
        }else{
            if (curr < s){
                s = curr;
            }
        }
    }
    return s;
}

function greatest(){
    g = 'no greatest';
    for (var i = 0; i < arguments.length; i++) {
        curr = arguments[i]
        if (g == 'no greatest'){
            g = curr;
        }else{
            if (curr > g){
                g = curr;
            }
        }
    }
    return g;
}

function pick(l){
    return l[Math.floor(Math.random()*l.length)]
}

function roll(x, y, return_list=false){  // roll xdy
    results = [];
    total = 0;
    for (i=0; i<x; i++){
        r = Math.floor(Math.random()*y)+1;
        total += r;
        results.push(r);
    }
    if (return_list){
        return results;
    }else{
        return total;
    }
}

function roll_under_stat(stat, diff=0, skill=0){
    if (roll(1, 100) <= (stat*(5-Math.round(diff/2)))+skill){
        return true;
    }else{
        return false;
    }
}

function skill_check(character, stat, skill, diff=0){
    console.log(character)
    console.log(character['stats'])
    local_stat = character['stats'][stat];
    local_skill = character['skills'][skill];
    if (roll_under_stat(local_stat, diff, local_skill)){
        return true;
    }
    else{
        if (character['skills'][skill] < 50){
            character['skills'][skill] += 1; // Failing a skill check improves it by 1% to a maximum of 50%
            print_term('Your '+skill+' skill increased by 1%.')
            print_screen([skill, character['skills'][skill]])
        }
        return false;
    }
}

function hurt(char, dmg, is_player=true){
    final = greatest(0, dmg);
    char['hp'] -= final;
    if (is_player){
        print_term('You now have '+char['hp']+' hp.');
        print_screen(['hp', char['hp']]);
    }else{
        print_term('The enemy now has '+char['hp']+' hp.');
        print_screen(['enemy-hp', char['hp']]);
    }
}

function heal(char, amt, is_player=true){
    char['hp'] = smallest(char['max_hp'], char['hp']+amt);
    if (is_player){
        print_term('You now have '+char['hp']+' hp.');
        print_screen(['hp', char['hp']]);
    }else{
        print_term('The enemy now has '+char['hp']+' hp.');
        print_screen(['enemy-hp', char['hp']]);
    }

}

function is_dead(target){
    if (target['hp'] <= 0){
        return true;
    }else{
        return false;
    }
}

function get_bonus(person, stat){
    return smallest((person['stats'][stat]-10)/2)
}

function get_monster(level){
    console.log(level)
    target = monster_index[level][roll(1, monster_index[level].length)-1];
    base = {...base_monster};
    hp = roll(level, 6);
    base['hp'] = hp;
    base['max_hp'] = hp;
    base['attacks'] = smallest(7, level);
    if (level > 7){
        base['damage'] = level-1;
    }
    Object.keys(target).forEach(element => {
        base[element] = target[element];
    });
    update_listing = [];
    Object.keys(base).forEach(element => {
        update_listing.push(['enemy-'+element, base[element]]);
    })
    update_listing.push(['enemy-name', base['name'].charAt(0).toUpperCase() + base['name'].slice(1)]);
    print_screen(update_listing);
    return base;
}

function get_spell(level){
    curr_spell = {...base_spell};
    spell_power = roll(1, 8);
    if (spell_power < 5){
        curr_spell['name'] = 'Minor ';
        curr_spell['power'] = 1;
    }else if (spell_power < 8){
        curr_spell['name'] = 'Major ';
        curr_spell['power'] = 2;
    }else{
        curr_spell['name'] = 'Anagrammatised ';
        curr_spell['power'] = 3;
    }
    curr_spell['power'] += Math.floor(level/3);
    spell_cost = roll(1, 6);
    if (spell_cost < 3){
        curr_spell['name'] += 'Transcendental ';
        curr_spell['cost'] = 1;
    }else if (spell_cost < 5){
        curr_spell['name'] += 'Ethereal ';
        curr_spell['cost'] = 2;   
    }else{
        curr_spell['name'] += 'Reified ';
        curr_spell['cost'] = 3;   
    }
    spell_risk = roll(1, 6);
    if (spell_cost < 3){
        curr_spell['name'] += 'Lawful ';
        curr_spell['risk'] = 1;
    }else if (spell_cost < 5){
        curr_spell['name'] += 'Neutral ';
        curr_spell['risk'] = 2;   
    }else{
        curr_spell['name'] += 'Chaotic ';
        curr_spell['risk'] = 3;   
    }
    spell_speed = roll(1, 7);
    if (spell_cost < 3){
        curr_spell['name'] += 'Optimised ';
        curr_spell['casting_time'] = 1000;
    }else if (spell_cost < 5){
        curr_spell['name'] += 'Compiled ';
        curr_spell['casting_time'] = 3000;   
    }else{
        curr_spell['name'] += 'Interpreted ';
        curr_spell['casting_time'] = 5000;   
    }
    curr_effect = pick(base_spell_effects);
    curr_spell['name'] += curr_effect.toUpperCase();
    curr_spell['effect'] = curr_effect;
    return curr_spell
}

function get_melee_weapon(level){
    n = '';
    if (level < 3){
        n += pick(['Rusty ', 'Old ', 'Worn ']);
    }else if (level < 5){
        n += pick(['Industrial ', 'Standard ', 'Small ']);
    }else if (level < 7){
        n += pick(['Cyber', 'Great', 'Combat '])
    }else {
        n += pick(['Optimised ', 'Psychic ', 'Legendary '])
    }
    n += pick(['Blade', 'Sword', 'Spear', 'Staff', 'Axe'])
    return n;
}

function get_ranged_weapon(level){
    n = '';
    if (level < 3){
        n += pick(['Rusty ', 'Old ', 'Printed ', 'Degraded ']);
    }else if (level < 5){
        n += pick(['Civilian ', 'Standard ', 'Portable ']);
    }else if (level < 7){
        n += pick(['Cyber', 'Automatic ', 'Smart '])
    }else {
        n += pick(['Fully Automatic ', 'Psychic ', 'Legendary '])
    }
    n += pick(['Pistol', 'Crossbow', 'Longbow', 'Tracker-drone', 'Dart'])
    return n;
}

function get_armour(level){
    n = '';
    if (level < 3){
        n += pick(['Plastic ', 'Damaged ', 'Printed ', 'Degraded ']);
    }else if (level < 5){
        n += pick(['Civilian ', 'Standard ', 'Light ']);
    }else if (level < 7){
        n += pick(['Reinforced ', 'Carbon Fibre ', 'Combat '])
    }else {
        n += pick(['Mechsuit ', 'Titanium Alloy ', 'Fairweather Ceramic '])
    }
    n += 'Armour';
    return n;
}

function roll_treasure(hero, level){
    result = roll(1, 8);
    if (result == 1){
        print_term('You find a better melee weapon!');
        hero['damage'] += level;
        print_screen([['damage', hero['damage']], ['inventory', get_melee_weapon(level)]])
    }else if (result == 2){
        print_term('You find a better ranged weapon!');
        hero['ranged_damage'] += level;
        if (hero['ranged_attacks'] == 0){
            hero['ranged_attacks'] = 1;
        }
        print_screen([['ranged_attacks', hero['ranged_attacks']], ['ranged_damage', hero['damage']], ['inventory', get_ranged_weapon(level)]])
    }else if (result == 3){
        print_term('You find a patch of armour!');
        amt = roll(1, 6)+level;
        hero['max_hp'] += amt;
        hero['hp'] += amt;
        print_screen([['max_hp', hero['max_hp']], ['hp', hero['hp']], ['inventory', get_armour(level)]])
    }else if (result == 4){
        print_term('You find an Amulet of Titanic Strength!');
        hero['attacks'] += 1;
        print_screen([['attacks', hero['attacks']], ['inventory', 'Amulet of Titanic Strength']])
    }else if (result == 5){
        print_term('You find an Amulet of Ambulatory Dextrousness!');
        hero['ranged_attacks'] += 1;
        print_screen([['ranged_attacks', hero['ranged_attacks']], ['inventory', 'Amulet of Ambulatory Dextrousness']])
    }else if (result == 6){
        print_term('You find an Object of Cybernetic Power!');
        tstat = stats[roll(1, stats.length)-1];
        print_term('You feel your '+tstat+' increase...')
        hero['stats'][tstat] += 1;
        print_screen([[tstat, hero['stats'][tstat]], ['inventory', 'Object of Cybernetic Power ('+tstat+')']])
    }else if (result == 7){
        print_term('You find a Skill Implant!');
        tskill = skills[roll(1, skills.length)-1];
        print_term('You feel your '+tskill+' skill increase...');
        hero['skills'][tskill] += level;
        print_screen([[tskill, hero['skills'][tskill]], ['inventory', 'Skill Manual ('+tstat+')']])
    }else if (result == 8){
        print_term('You find a spell!');
        new_spell = get_spell(level);
        hero['spells'][new_spell['name']] = new_spell;
        print_screen(['spells', new_spell['name']]);
    }
}

function cast(name){
    if (player_casting){
        print_term('[SPELL] You are already casting a spell!', true);
        return false;
    }else if (player_dead){
        return false;
    }else{
        player_casting = true;
        if (myhero['spells'].hasOwnProperty(name)){
            if (myhero['stats']['cha'] >= myhero['spells'][name]['cost']){
                print_term('[SPELL] Now casting '+name+'...', true);
                print_screen(['casting-bar', myhero['spells'][name]['casting_time']], true);
                target_spell = {...myhero['spells'][name]};
                delete myhero['spells'][name];
                e = document.getElementById('spell_'+name);
                e.parentNode.removeChild(e);
                window.setTimeout(()=>{finish_cast(target_spell)}, target_spell['casting_time']);
                
            }else{
                print_term('[SPELL] Insufficient CHA. Casting aborted.', true)
            }
        }else{
            print_term('[SPELL] 404 No Such Spell', true)
        }
    }
}

function finish_cast(spell){
    player_casting = false;
    outstrings = [];
    outupdates = [];
    if (skill_check(myhero, 'cha', 'spellcasting', spell['power'])){
        outstrings.push('[SPELL] Casting succeeded!');
        myhero['stats']['cha'] -= spell['cost'];
        //lotus flame matrix tensor
        if (spell['effect'] == 'lotus'){
            health_bonus = roll(spell['power'], 6)+3;
            outstrings.push('[SPELL] You feel rejuvenated and gain '+health_bonus+' HP + '+spell['power']*3+' CHA!');
            heal(myhero, health_bonus);
            myhero['stats']['cha'] += spell['power']*3;
            outupdates.push(['hp', myhero['hp']])
        }else if (spell['effect'] == 'tensor'){
            outstrings.push('[SPELL] Your attacks are imbued with a strange, external force tensor...');
            myhero['ranged_attacks'] += spell['power'];
            myhero['attacks'] += spell['power'];
            outupdates.push.apply([['ranged_attacks', myhero['ranged_attacks']], ['attacks', myhero['attacks']]]);
        }else if (spell['effect'] == 'matrix'){
            outstrings.push('[SPELL] You download information from the matrix...');
            tskill = pick(skills);
            myhero['skills'][tskill] += 3*spell['power'];
            outupdates.push([tskill, myhero['skills'][tskill]]);
        }else if (spell['effect'] == 'flame'){
            outstrings.push('[SPELL] You are wreathed in flame...');
            myhero['damage'] += spell['power'];
            outupdates.push(['damage', myhero['damage']]);
        }

    }else{
        outstrings.push('[SPELL] The spell backfires, harming you!');
        myhero['stats']['cha'] -= spell['cost'];
        myhero['skills']['spellcasting'] += 5
        backfire = roll(spell['risk'], 6);
        outstrings.push('[SPELL] Residual spell energy scorches you for '+backfire+' damage!')
        hurt(myhero, backfire);
        outupdates.push(['spellcasting', myhero['skills']['spellcasting']])
    }
    outupdates.push(['cha', myhero['stats']['cha']]);
    print_term(outstrings, true);
    print_screen(outupdates, true);
}

function loop_step(){
    main_character = myhero;
    if (curr_level > 9){
        console.log('out1')
        print_term('You win!');
        game_end_function(main_character);
        return;
    }
    console.log(main_character)
    curr_turn += 1;
    res = encounter_roll(main_character, curr_level);
    if (!res || is_dead(main_character)){
        player_dead = true;
        game_end_function(main_character);
        return false;
    }
    if (skill_check(main_character, 'int', 'navigation', curr_level)){
        print_term('You progress further into the dungeon...');
        curr_length -= roll(1, 3) + get_bonus(main_character, 'int');
    }
    if (curr_length <= 0){
        print_term('You find the stairs to the next floor...');
        curr_level += 1;
        curr_length = roll(3, 6)+3+curr_level;
        bump = roll (2, 6);
        main_character['max_hp'] += bump;
        main_character['hp'] += bump;
        print_term('===LEVEL UP===');
        print_term('You gain '+bump+' HP.');
        print_screen([['level', curr_level], ['max_hp', main_character['max_hp']], ['hp', main_character['hp']]]);
    }
    // if (!player_dead){
    //     setTimeout(()=>{loop_step(main_character)}, 300);
    // }
}

function game_end_function(hero){
    if (!game_over){
        game_over = true;
        print_term('Your final score was '+(hero['gold']+curr_turn+(curr_level*10)));
        console.log('printed final score');
    }

};

function encounter_roll(current_hero, clevel){
    console.log(current_hero);
    if (is_dead(current_hero)){
        return false;
    }
    enc = roll(1, 6);
    if (enc == 1){ // surprised by enemy
        print_term('You encounter a monster!')
        return run_fight(current_hero, get_monster(clevel), true)
    }else if (enc == 2){ // can engage enemy at range first
        print_term('You encounter a monster!')
        return run_fight(current_hero, get_monster(clevel), false)
    }else if (enc == 3){
        print_term('You find a trap!');
        if (!skill_check(current_hero, 'dex', 'footing')){
            print_term('It hurts!')
            hurt(current_hero, roll(1, 6)+clevel);
        }else{
            print_term('You dodge out of the way!')
        };
    }else if (enc == 4){
        amt = roll(clevel, 6)
        print_term('You find '+amt+' gold!');
        current_hero['gold'] += amt;
        print_screen(['gold', current_hero['gold']]);
    }else if (enc == 5){
        print_term('You look around for anything interesting...');
        if (roll(1,greatest(4, 10-clevel)) < 7){
            print_term('You find some treasure!');
            roll_treasure(current_hero, clevel);
        };
    }else if (enc == 6){
        print_term('You take a breather...');
        heal(current_hero, roll(1,6)+clevel);
    }
    // Natural healing if you didn't have an encounter this turn
    if (enc > 2 && current_hero['hp'] < current_hero['max_hp'] && skill_check(current_hero, 'wis', 'medicine', -get_bonus(current_hero, 'con'))){
        print_term('You try and address your wounds...');
        amt = roll(1, 6)+greatest(get_bonus(current_hero, 'con'), -1);
        print_term('You recover '+amt+' health!');
        heal(current_hero, amt);
    }
    if (is_dead(current_hero)){
        print_term('You are dead!');
        return false;
    }else{
        return true;
    }
}

function run_fight(you, enemy, surprised=false){
    player_fighting = true;
    print_screen(['combat', 'show'])

    // Combat advantage determination
    if (surprised){
        edge = get_bonus(you, 'int')-roll(1, 6)-enemy['tactic'];
    }else{
        edge = get_bonus(you, 'int')-enemy['tactic'];
    }

    // Ranged phase (only if they are not surprised, until distance is closed)
    if (!surprised){
        print_term('You see the '+enemy['name']+' approaching...');
        if (you['ranged_attacks'] >= 1){
            closed = false;
            while (!closed){
                // Check if you land a hit
                if (skill_check(you, 'wis', 'ranged', enemy['tactic'])){
                    print_term('You land a hit as they attempt to close!');
                    dmg = roll(you['ranged_attacks'], you['ranged_damage']) + get_bonus(you, 'dex');
                    if (skill_check(you, 'int', 'perception', enemy['strange'])){
                        print_term('Critical hit!');
                        dmg *= 2;
                    }
                    hurt(enemy, dmg, is_player=false);
                    edge += 1;
                }

                // Death check
                if (is_dead(enemy)){
                    player_fighting = false;

                    print_screen(['combat', 'hide'])

                    print_term('The '+enemy['name']+' died!');
                    return true;
                }

                // Check to prevent closing the distance
                if (skill_check(you, 'dex', 'footing', enemy['speed'])){
                    print_term('You prevent them from closing the distance!');
                }else{
                    print_term('They close the distance to you!')
                    closed = true;
                    break;
                }
            }
        }else{
            print_term('You have no ranged weapons to attack...');
        }

    }else{
        print_term('You are surprised by the '+enemy['name']+'!');
    }

    print_term('You enter melee combat...')
    fled = false;
    max_rounds = 100;
    // Melee phase (until someone is dead or flees)
    while (!fled){
        max_rounds -= 1;
        if (max_rounds <= 0){
            print_term('Tiebreak!');
            break;
        }
        // Edge display (to player)
        edge = Math.round(clamp(edge, -6, 6));
        print_screen(['edge', edge])
        if (edge > 0){
            print_term('You think you have the edge right now...');
        }else if (edge < 0){
            print_term('You think the enemy has the edge right now...');
        }else{
            print_term('You think nobody has an edge right now.');
        }
        // Footing check (Modify edge value)
        if (skill_check(you, 'dex', 'footing', enemy['speed'])){
            print_term('You ready your footing...');
            edge += roll(1, 3);
        }else{
            print_term('The '+enemy['name']+' disrupts your footing...');
            edge -= roll(1, 3);
        }

        edge = Math.round(clamp(edge, -6, 6));


        // Struggle check (Who hits, modified by edge)
        print_term('Both of you struggle to land a strike...')
        if (skill_check(you, 'wis', 'melee', enemy['tactic']-edge)){
            print_term('You hit!');
            hits = true;
        }else{
            print_term('The '+enemy['name']+' hits!')
            hits = false;
        }

        // Damage roll (Modified by edge and strength)
        if (hits){
            dmg = Math.round(roll(you['attacks'], greatest(you['damage'] - enemy['tough'], 2)) + get_bonus(you, 'str'));
            if (skill_check(you, 'int', 'perception', enemy['strange'] - edge)){
                print_term('Critical hit!');
                dmg *= 2;
            }
            if (skill_check(you, 'str', 'melee', enemy['strange'] - edge)){
                print_term('Brutal attack!')
                dmg += roll(1, 3)+get_bonus(you, 'str');
            }
            print_term('You deal '+dmg+' damage to the '+enemy['name']+'!');
            hurt(enemy, dmg, is_player=false);
        }else{
            dmg = Math.round(roll(enemy['attacks'], enemy['damage']));
            if (roll(1, 20) == 20){
                print_term('Critical hit!')
                dmg *= 2;
            }
            if (skill_check(you, 'dex', 'defense', enemy['tactic'] - edge)){
                print_term('You block the blow, partially!')
                dmg = Math.round(dmg*((100-smallest(you['skills']['defense'], 50))/100))
                dmg -= roll(1, 6);
            }
            print_term('The '+enemy['name']+' deals '+dmg+' damage to you!');
            hurt(you, dmg);
        }

        // Death check
        if (is_dead(you)){
            player_fighting = false;

            print_term('You died!');
            print_screen(['combat', 'hide'])
            return false;
        }else if (is_dead(enemy)){
            player_fighting = false;

            print_term('The '+enemy['name']+' died!');
            print_screen(['combat', 'hide'])
            return true;
        }

    }
}

function start_game(){
    myhero = {...base_hero};
    update_list = []
    stats.forEach(element => {
        start_val =  smallest(roll(3, 6) + 2, 18)
        myhero['stats'][element] = start_val;
        update_list.push([element, start_val])
    });
    start_bonus = get_spell(1);
    myhero['spells'][start_bonus['name']] = start_bonus;
    update_list.push(['spells', start_bonus['name']])
    print_screen(update_list);
    console.log(myhero);

    print_term('You begin your adventure...');
    loop_step();
}

start_game();
