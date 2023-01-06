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
    },
    'inventory': []
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
}

monster_index = {
    1: [{'name': 'goblin', 'tactic': 1}, {'name': 'dire wolf', 'speed': 1}, {'name': 'rogue drone', 'damage': 8}],
    2: [{'name': 'smartgel slime consumer', 'speed': -2, 'tactic': -1, 'strange': 1}],
    3: [{'name': 'partially defective terminator', 'tactic': 1, 'strange': -1}, {'name': 'acolyte wizard', 'speed': -1, 'damage': 10}, {'name': 'analytic philosopher', 'tactic': 2, 'strange': 1, 'damage': 4}],
    4: [{'name': 'smartgel slime controller', 'speed': -2, 'strange': 1, 'damage': 8}],
    5: [{'name': 'rogue joke', 'strange': 3}, {'name': 'dire dire wolf', 'speed': 3}],
    6: [{'name': 'active terminator', 'tactic': 3, 'speed': 1, 'strange': -1, 'damage': 8}],
    7: [{'name': 'mechadragon', 'speed': -1, 'damage': 12}]
}

curr_length = 0;
curr_level = 1;
curr_turn = 10;
player_dead = false;

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
            print_term('Your '+skill+' skill increased to +'+character['skills'][skill]+'%.')
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
    base['attacks'] = level;
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

function roll_treasure(hero, level){
    result = roll(1, 10);
    if (result == 1){
        print_term('You find a better melee weapon!');
        hero['damage'] += level;
        print_screen(['damage', hero['damage']])
    }else if (result == 2){
        print_term('You find a better ranged weapon!');
        hero['ranged_damage'] += level;
        if (hero['ranged_attacks'] == 0){
            hero['ranged_attacks'] = 1;
        }
        print_screen([['ranged_attacks', hero['ranged_attacks']], ['ranged_damage', hero['damage']]])
    }else if (result == 3){
        print_term('You find a patch of armour!');
        amt = roll(1, 6)+level;
        hero['max_hp'] += amt;
        hero['hp'] += amt;
        print_screen([['max_hp', hero['max_hp']], ['hp', hero['hp']]])
    }else if (result == 4){
        print_term('You find an Amulet of Titanic Strength!');
        hero['attacks'] += 1;
        print_screen(['attacks', hero['attacks']])
    }else if (result == 5){
        print_term('You find an Amulet of Ambulatory Dextrousness!');
        hero['ranged_attacks'] += 1;
        print_screen(['ranged_attacks', hero['ranged_attacks']])
    }else if (result == 6){
        print_term('You find an Object of Cybernetic Power!');
        tstat = stats[roll(1, stats.length)-1];
        print_term('You feel your '+tstat+' increase...')
        hero['stats'][tstat] += 1;
        print_screen([tstat, hero['stats'][tstat]])
    }else if (result == 7){
        print_term('You find a Skill Implant!');
        tskill = skills[roll(1, skills.length)-1];
        print_term('You feel your '+tskill+' skill increase...');
        hero['skills'][tskill] += level;
        print_screen([tskill, hero['skills'][tskill]])
    }else if (result == 8){
        print_term('You find a hoard of gold!');
        hero['gold'] += roll(level*5, 6);
        print_screen(['gold', hero['gold']])
    }
}

function loop_step(main_character){
    if (curr_level > 7){
        print_term('You win!');
        game_end_function(main_character);
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
        print_term('You gain '+bump+' HP.');
        print_screen([['level', curr_level], ['max_hp', main_character['max_hp']], ['hp', main_character['hp']]]);
    }
    if (curr_level < 8 && !player_dead){
        setTimeout(()=>{loop_step(main_character)}, 300);
    }
}

function game_end_function(hero){
    print_term('Your final score was '+(hero['gold']+curr_turn+(curr_level*10)));
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
                if (is_dead(you)){
                    print_screen(['combat', 'hide'])

                    print_term('You died!');
                    return false;
                }else if (is_dead(enemy)){
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

        edge = clamp(edge, -6, 6);

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
            dmg = Math.round(roll(you['attacks'], you['damage']) + get_bonus(you, 'str'));
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
            print_term('You died!');
            print_screen(['combat', 'hide'])
            return false;
        }else if (is_dead(enemy)){
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
        start_val =  roll(2, 6) + 3
        myhero['stats'][element] = start_val;
        update_list.push([element, start_val])
    });
    print_screen(update_list);
    console.log(myhero);

    print_term('You begin your adventure...');
    loop_step(myhero);
}

start_game();
