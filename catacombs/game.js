const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const skills = ['melee', 'ranged', 'defense', 'medicine', 'navigation', 'footing', 'perception', 'spellcasting'];
const phonemes = ['ker', 'ber', 'os', 'kar', 'san', 'dal', 'phon', 'tris', 'mes', 'gis', 'tus', 'ash', 'ur', 'ban', 'ip', 'al'];
const classes = {'fighter': {'name': 'Fighter', 'skill': 'melee'}, 'thief': {'name': 'Thief', 'skill': 'footing'}, 'magic_user': {'name': 'Neuromancer', 'skill': 'spellcasting'}};

const base_hero = {
    'name': 'You',
    'legacy': 1,
    'world': 1,
    'hp': 20,
    'max_hp': 20,
    'xp': 0,
    'max_xp': 30,
    'class': 'fighter',
    'class_levels': {'fighter': 0, 'magic_user': 0, 'thief': 0},
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

const base_monster = {
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
    9: [{'name': 'content-terminating wormhole', 'tough': 3}]
}

const base_spell_effects = ['lotus', 'flame', 'matrix', 'tensor',];

const base_spell = {
    'name': 'umm',
    'casting_time': 1000,
    'power': 1,
    'effect': 'lotus',
    'risk': 0,
    'cost': 0,
}

const base_upgrades = {
    'str': 'STR +1', 
    'dex': 'DEX +1', 
    'con': 'CON +1', 
    'int': 'INT +1', 
    'wis': 'WIS +1', 
    'cha': 'CHA +1', 
}

const tier2_upgrades = {
    'spell': 'Generate spell',
    'skill': '+5 to all skills',
    'bonus': '+30 HP',
}

const tier3_upgrades = {
    'wake': 'Wake up',
}

const base_game_state = {
    'curr_length': 18,
    'curr_level': 1,
    'curr_turn': 0,
    'player_dead': false,
    'player_casting': false,
    'player_fighting': false,
    'game_over': false,
    'paused': false,
    'hacking_revealed': false,
    'hack_killing': false,
    'current_character': null,
    'reincarnating': false,
}

game_state = {...base_game_state}

function reset_game_state(dead=true){
    // game_state['curr_length'] = 18;
    // game_state['curr_level'] = 1;
    // game_state['curr_turn'] = 0;
    // game_state['player_dead'] = false;
    // game_state['player_casting'] = false;
    // game_state['player_fighting'] = false;
    // game_state['game_over'] = false;
    // game_state['paused'] = false;
    // game_state['hacking_revealed'] = false;
    // game_state['hack_killing'] = false;
    if (game_state['paused'] || game_state['reincarnating']){
        return;
    }
    game_state['reincarnating'] = true;
    game_state['game_over'] = true;

    var highestTimeoutId = setTimeout(";");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i); 
    }

    update_indiv_element(['combat', 'hide']);
    update_indiv_element(['spells', 'clear']);
    update_indiv_element(['casting-bar', 'clear']);
    update_indiv_element(['inventory', 'clear']);
    update_indiv_element(['xp-bar', 'clear'])
    update_indiv_element(['upgrade-list', 'clear']);

    hack_reset();


    QUEUE = [];
    OTHER_ELEMENT_QUEUE = [];

    OFF_QUEUE = [];
    OFF_OTHER_ELEMENT_QUEUE = [];
    PRINTING = false;
    PRINT_DELAY = 750;

    var reset_elems = ['hp', 'max_hp', 'attacks', 'damage', 'ranged_attacks', 'ranged_damage', 'gold', 'inventory', 'spells', 'xp', 'max_xp']
    var curr_char = {...game_state['current_character']};

    reset_elems.forEach((elem)=>{
        curr_char[elem] = JSON.parse(JSON.stringify(base_hero[elem]));
    })

    if (dead){
        curr_char['legacy'] += 1;
        var cname = curr_char['name'].split(' ');
        var newname = cname[0]+' '+convertToRoman(curr_char['legacy']);
        curr_char['name'] = newname;
        skills.forEach((elem) => {
            curr_char['skills'][elem] = Math.round(curr_char['skills'][elem]/20);
        })
        stats.forEach((elem) => {
            curr_char['stats'][elem] = get_stat();
        })
    }else{
        curr_char['world'] += 1;
        skills.forEach((elem) => {
            curr_char['skills'][elem] = 0;
        })
    }

    game_state = {...base_game_state};
    game_state['game_over'] = false;
    game_state['player_dead'] = false;

    game_state['current_character'] = curr_char;
    print_term('[SYSTEM] New cycle initiated.<br><br><br>');

    print_term('Your family elder has died under mysterious circumstances. You inherit a partial memory backup, containing basic training and directions to a strange dungeon. Your adventure begins...');
    full_character_update();
    print_screen(['upgrade-list', 'show']);
    var start_bonus = get_spell(1);
    game_state['current_character']['spells'][start_bonus['name']] = start_bonus;
    print_screen(['spells', start_bonus['name']]);
    print_screen(['class-select', 'show'])
}

function full_character_update(){
    push_list = [];
    update_list = Object.keys(base_hero);
    update_list.splice(update_list.indexOf('stats'), 1);
    update_list.splice(update_list.indexOf('skills'), 1);
    update_list.splice(update_list.indexOf('inventory'), 1);
    update_list.splice(update_list.indexOf('spells'), 1);
    update_list.splice(update_list.indexOf('world'), 1);
    update_list.splice(update_list.indexOf('legacy'), 1);
    update_list.splice(update_list.indexOf('class_levels'), 1);
    update_list.splice(update_list.indexOf('class'), 1);
    update_list.splice(update_list.indexOf('xp'), 1);
    update_list.splice(update_list.indexOf('max_xp'), 1);
    update_list.forEach((elem)=>{
        push_list.push([elem, game_state['current_character'][elem]])
    });
    stats.forEach((elem)=>{
        push_list.push([elem, game_state['current_character']['stats'][elem]])
    })
    skills.forEach((elem)=>{
        push_list.push([elem, game_state['current_character']['skills'][elem]])
    })
    print_screen(push_list);
}

network_state = {
    'probe_level': 0,
    'alert_level': 0,
    'privilege_level': 0,
    'knowledge_level': 0,
    'programs': {
        './timedecel.sh': {'time': 1000, 'probe_level': 10, 'privilege_level': 5, 'code': 'timedecel'},
        './timeaccel.sh': {'time': 1000, 'probe_level': 10, 'privilege_level': 5, 'code': 'timeaccel'},
        './givespell.sh': {'time': 3000, 'probe_level': 30, 'privilege_level': 20, 'code': 'givespell'},
        './giveupgrade.sh': {'time': 5000, 'probe_level': 50, 'privilege_level': 30, 'code': 'giveupgrade'},
        './char_manage.sh --kill': {'time': 1000, 'probe_level': 75, 'privilege_level': 40, 'code': 'kill'},
        './char_manage.sh --force-revive': {'time': 10000, 'probe_level': 100, 'privilege_level': 50, 'code': 'revive'}
    },

    'commands': {
        'nmap': {'knowledge_level': 0, 'time': 1000, 'effect': {'probe_level': [3, 6], 'alert_level': [1, 6]}},
        'nmap -A': {'knowledge_level': 1, 'time': 1500, 'effect': {'probe_level': [3, 10, 3], 'alert_level': [3, 6]}},
        'login-brute': {'knowledge_level': 1, 'time': 3000, 'effect': {'privilege_level': [1, 3, -1], 'alert_level': [1, 6]}},
        'privesc': {'knowledge_level': 3, 'time': 3000, 'effect': {'privilege_level': [1, 6,], 'alert_level': [2, 6]}},
        'exploit_pro': {'knowledge_level': 5, 'time': 3500, 'effect': {'privilege_level': [2, 6], 'alert_level': [1, 6]}},
        'cleanup': {'knowledge_level': 3, 'time': 3000, 'effect': {'alert_level': [-3, 6]}},
    }
}

function hack_reset(){
    document.getElementById('hack-section').style.transition = 'height 0s';
    document.getElementById('hack-section').style.height = '0em';
    document.getElementById('hack-section').style.marginBottom = '0em';
    document.getElementById('hack-section').classList.remove('disabled');
    setTimeout(()=>{document.getElementById('hack-section').style.transition = 'height 3s'}, 10);
    game_state['hacking_revealed'] = false;
    game_state['hack_killing'] = false;
    print_term('[SYSTEM] Network interface reset complete.', true);
}

function hack_setup(){
    if (!game_state['hacking_revealed']){
        game_state['hacking_revealed'] = true;
        document.getElementById('hack-section').style.height = '25em';
        document.getElementById('hack-section').style.marginBottom = '1em';
    }

    document.getElementById('probe-level').innerHTML = network_state['probe_level'];
    document.getElementById('knowledge-level').innerHTML = network_state['knowledge_level'];
    document.getElementById('alert-level').innerHTML = network_state['alert_level'];
    document.getElementById('privilege-level').innerHTML = network_state['privilege_level'];

    progs = document.getElementById('hack-programs');
    progs.innerHTML = '';
    Object.keys(network_state['programs']).forEach((elem)=>{
        p = network_state['programs'][elem];
        if (network_state['probe_level'] >= p['probe_level']){
            progs.innerHTML += '<button onclick="run_program(\''+elem+'\')">'+elem+'</button>';
        }
    });

    cmds = document.getElementById('hack-commands');
    cmds.innerHTML = '';
    Object.keys(network_state['commands']).forEach((elem)=>{
        c = network_state['commands'][elem];
        if (network_state['knowledge_level'] >= c['knowledge_level']){
            cmds.innerHTML += '<button onclick="run_command(\''+elem+'\')">'+elem+'</button>';
        }
    });

    if (network_state['alert_level'] >= 100){
        print_term('[SYSTEM] ERROR. SYSTEM INSTABILITY DETECTED. INTRUDER DETECTED. SYSTEM INSTABILITY DETECTED. INTRUDER DETECTED. SYSTEM INSTABILITY DETECTED. INTRUDER DETECTED. SYSTEM INSTABILITY DETECTED. INTRUDER DETECTED. SYSTEM INSTABILITY DETECTED. INTRUDER DETECTED.', true);
        game_state['hack_killing'] = true;
        document.getElementById('hack-section').classList.add('disabled');
        setTimeout(()=>{wipe_screen(3000, hack_reset)}, 2000);
    }
}

function lockup(){
    progs = document.getElementById('hack-programs');
    cmds = document.getElementById('hack-commands');
    progs.innerHTML = '';
    cmds.innerHTML = '';
}

function wipe_screen(time, next){
    lockup();
    var loading_progress = 0;
    var e = setInterval(prog_load, time/10);

    function prog_load(){
        document.getElementById('hack-progress').style.height = `${loading_progress}em`;
        loading_progress += 2;
        if (loading_progress >= 27){
            document.getElementById('hack-progress').style.height = '0em';
            next();
            clearInterval(e);
        }
    }
}

function run_command(command){
    if (!game_state['paused'] && !game_state['game_over'] && !game_state['hack_killing']){
        var c = network_state['commands'][command];
        wipe_screen(c['time'], ()=>{finish_command(command);});
    }
}

function finish_command(command){
    var c = network_state['commands'][command];
    Object.keys(c['effect']).forEach((elem) => {
        var target = elem;
        var details = c['effect'][elem];
        var dice = details[0];
        var size = details[1];
        if (details.length == 3){
            var mod = details[2];
        }else{
            var mod = 0;
        }
        var mul = 1;
        if (dice < 0){
            dice *= -1;
            mul = -1;
        }

        network_state[target] += mul*(roll(dice, size)+mod);
        network_state['probe_level'] = smallest(network_state['probe_level'], 100);
        network_state['alert_level'] = smallest(network_state['alert_level'], 100);

    })
    network_state['knowledge_level'] += roll(1, 10)/10;
    network_state['knowledge_level'] = Math.round(network_state['knowledge_level']*10)/10
    hack_setup();
}

function run_program(program){
    if (!game_state['paused'] && !game_state['hack_killing']){
        var p = network_state['programs'][program];
        if (network_state['privilege_level'] < p['privilege_level']){
            document.getElementById('privilege-level').style.color = 'var(--hack-red)';
            setTimeout(()=>{document.getElementById('privilege-level').style.color = 'var(--hack-green)';}, 1000)
            return false
        }else{
            wipe_screen(p['time'], ()=>{finish_program(program)});
        }
    }
}

function finish_program(program){
    var p = network_state['programs'][program];
    network_state['privilege_level'] -= p['privilege_level'];
    if (p['code'] == 'timeaccel'){
        PRINT_DELAY -= 100;
        clamp(PRINT_DELAY, 150, 3050);
    }else if (p['code'] == 'timedecel'){
        PRINT_DELAY += 100;
        clamp(PRINT_DELAY, 150, 3050);
    }else if (p['code'] == 'givespell'){
        spell_bonus = get_spell(game_state['curr_level']);
        game_state['current_character']['spells'][spell_bonus['name']] = spell_bonus;
        off_print_screen(['spells', spell_bonus['name']]);
    }else if (p['code'] == 'giveupgrade'){
        off_print_screen(['upgrade-list', 'fill']);
    }else if (p['code'] == 'kill'){
        hurt(game_state['current_character'], 1000000);
    }else if (p['code'] == 'revive'){
        if (game_state['current_character']['hp'] <= 0){
            print_term('[SYSTEM] Somewhere out there someone is singing...', true);
            game_state['current_character']['hp'] = game_state['current_character']['max_hp'];
            if (game_state['current_character']['hp'] > 0){
                off_print_screen(['hp', game_state['current_character']['hp']]);
                game_state['game_over'] = false;
                game_state['player_dead'] = false;
                out_done();
            }
        }
    }
    hack_setup();
}

QUEUE = [];
OTHER_ELEMENT_QUEUE = [];

OFF_QUEUE = [];
OFF_OTHER_ELEMENT_QUEUE = [];
PRINTING = false;
PRINT_DELAY = 750;
const UPDATE_KEYWORD = '%UPDATE%'

function print_term(ts, now=false, l='mainterm', ) {  // push string or list of strings to print queue
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
            QUEUE = QUEUE.concat(ts);
        }
    }
    if (QUEUE.length > 0 && !PRINTING){
        PRINTING = true;
        window.setTimeout(()=>{out(l=l)}, PRINT_DELAY);
    }
    console.log(QUEUE);
}

function off_print_term(ts){
    if (typeof ts === 'string'){
        OFF_QUEUE.push(ts);
    }else if (typeof ts === 'object'){
        OFF_QUEUE = OFF_QUEUE.concat(ts);
    }
}

function off_print_screen(changes){
    OFF_OTHER_ELEMENT_QUEUE.push(changes);
    OFF_QUEUE.push(UPDATE_KEYWORD);
}

function out(elem='mainterm'){  // Grabs top line in queue and pushes it to webpage, then calls itself again after a timeout if there are lines remaining in queue
    t = QUEUE[0];
    QUEUE = QUEUE.slice(1);
    while (t == UPDATE_KEYWORD){
        k = update_other_elements();
        t = QUEUE[0];
        QUEUE = QUEUE.slice(1);
        if (t == UPDATE_KEYWORD && QUEUE.length == 0){
            out_done(elem);
        }
    }
    if (typeof t !== 'undefined'){
        tl = t + '<br>';
        i = document.getElementById(elem)
        i.innerHTML += tl;
        i.scrollTop = i.scrollHeight;
    }


    if (QUEUE.length > 0){
        window.setTimeout(()=>{out(elem)}, PRINT_DELAY);
    }else{
        out_done(elem);
    }
}

function out_done(e){
    if (OFF_QUEUE.length == 0){
        PRINTING = false;
        if (!game_state['player_dead'] && !game_state['game_over'] && !game_state['paused']){
            setTimeout(()=>{loop_step()}, 0);
        }            
        return;
    }else{
        console.log('handling batched outputs.')
        QUEUE = QUEUE.concat(OFF_QUEUE);
        OTHER_ELEMENT_QUEUE = OTHER_ELEMENT_QUEUE.concat(OFF_OTHER_ELEMENT_QUEUE);
        OFF_QUEUE = [];
        OFF_OTHER_ELEMENT_QUEUE = [];
        window.setTimeout(()=>{out(e)}, PRINT_DELAY);
    }
}

function print_screen(changes, now=false){
    if (now){
        console.log('changes applied now', changes);
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
            update_indiv_element(item);
        });
    }else{
        update_indiv_element(t);
    }
}

function update_indiv_element(thing){
    elem_name = thing[0];
    elem_new_val = thing[1];
    if (elem_name == 'combat'){
        console.log('handling combat')
        if (elem_new_val == 'show'){
            document.getElementById('spells').style.display = 'none';
            document.getElementById('nospell').style.display = 'block';
            document.getElementById('upgrade-list').style.display = 'none';
            document.getElementById('noupgrade').style.display = 'block';

            document.getElementById('combat-table').classList.remove('hidden');
            document.getElementById('combat-table').style.opacity = '100%';
        }else if (elem_new_val == 'hide'){
            for (i=-6; i<=6; i++){
                document.getElementById('edge'+i).style.backgroundColor = 'inherit';
            }
            document.getElementById('spells').style.display = 'block';
            document.getElementById('nospell').style.display = 'none';
            document.getElementById('upgrade-list').style.display = 'block';
            document.getElementById('noupgrade').style.display = 'none';

            document.getElementById('combat-table').style.opacity = '0%';
            document.getElementById('combat-table').classList.add('hidden');

        }
    }else if (elem_name == 'edge'){
        for (i=-6; i<=6; i++){
            document.getElementById('edge'+i).style.backgroundColor = 'inherit';
        }
        document.getElementById('edge'+elem_new_val).style.backgroundColor = 'antiquewhite';
    }else if (elem_name == 'inventory'){
        if (elem_new_val == 'clear'){
            document.getElementById('inventory').innerHTML = '';
        }else{
            document.getElementById('inventory').innerHTML += '* '+elem_new_val+'<br>'

        }
    }else if (elem_name == 'spells'){
        if (elem_new_val == 'clear'){
            document.getElementById('spells').innerHTML = ''
        }else{
            document.getElementById('spells').innerHTML += '<div id="spell_'+elem_new_val+'"><button onclick="cast(\''+elem_new_val+'\')">'+elem_new_val+'</button> <button class="important" onclick="destroy_spell(\''+elem_new_val+'\')">[X]</button><br><br></div>'
        }
    }else if (elem_name == 'casting-bar'){
        if (elem_new_val == 'clear'){
            document.getElementById('casting-progress').style.width = '0%'
        }else{
            var id = setInterval(load, elem_new_val/100);
            var w = 1;
            function load(){
                if (w > 100 || game_state['player_fighting']){
                    document.getElementById('casting-progress').style.width = '0%'
                    clearInterval(id);
                }else{
                    w++;
                    document.getElementById('casting-progress').style.width = w+'%';
                }
            }
        }
    }else if (elem_name == 'upgrade-list') {
        if (elem_new_val == 'clear'){
            document.getElementById('upgrade-list-1').innerHTML = '';
            document.getElementById('upgrade-list-2').innerHTML = '';
            document.getElementById('upgrade-list-3').innerHTML = '';
        }else{
            if (document.getElementById('upgrade-list-1').innerHTML == ''){
                print_term('[UPGRADE] Tier I upgrades now available...', true);
                Object.keys(base_upgrades).forEach((elem) => {
                    document.getElementById('upgrade-list-1').innerHTML += '<button onclick="grant_upgrade(\''+elem+'\')">'+base_upgrades[elem]+'</button> ';
                });
            }else if (document.getElementById('upgrade-list-2').innerHTML == ''){
                print_term('[UPGRADE] Tier II upgrades now available...', true);
                Object.keys(tier2_upgrades).forEach((elem) => {
                    document.getElementById('upgrade-list-2').innerHTML += '<button onclick="grant_upgrade(\''+elem+'\')">'+tier2_upgrades[elem]+'</button> ';
                });
            }else if (document.getElementById('upgrade-list-3').innerHTML == '' && !game_state['hacking_revealed']){
                print_term('[UPGRADE] Tier III upgrades now available...', true);
                Object.keys(tier3_upgrades).forEach((elem) => {
                    document.getElementById('upgrade-list-3').innerHTML += '<button onclick="grant_upgrade(\''+elem+'\')">'+tier3_upgrades[elem]+'</button> ';
                });
            }else{
                print_term('[UPGRADE] No more upgrades available! Use upgrades to get more.', true)
            };
        }


    }else if (elem_name == 'hack-section'){
        hack_setup();
    }else if (elem_name == 'xp-bar'){
        if (elem_new_val == 'clear'){
            document.getElementById('xp-progress').style.width = '0%';
        }else if (elem_new_val == 'ding'){
            document.getElementById('xp-progress').style.width = '100%';
            document.getElementById('xp-progress').classList.add('ding');
            setTimeout(()=>{document.getElementById('xp-progress').classList.remove('ding');}, 500);
        }else{
            document.getElementById('xp-progress').style.width = elem_new_val+'%';
        }
    }else if (elem_name == 'class-select'){
        if (elem_new_val == 'hide'){
            document.getElementById('class-select').innerHTML = '';
        }else if (elem_new_val == 'show'){
            document.getElementById('class-select').innerHTML = '<br>Choose a class:<br>';
            Object.keys(classes).forEach((elem)=>{
                document.getElementById('class-select').innerHTML += `<button onclick="choose_class('${elem}')">${classes[elem]['name']}</button>`
            })
            document.getElementById('class-select').innerHTML += '<br><br>';
        }
    }else{
        document.getElementById(elem_name).innerHTML = elem_new_val;
    } 
}

function pause(){
    if (!game_state['paused']){
        print_term('[PAUSE] Pausing at the end of this turn...', true);
        document.getElementById('pause-button').innerHTML = '[Unpause]';
        document.getElementById('pause-button').classList.add('important');
        game_state['paused'] = true;
    }else{
        print_term('[PAUSE] Unpausing...', true);
        document.getElementById('pause-button').innerHTML = '[Pause]';
        document.getElementById('pause-button').classList.remove('important');
        game_state['paused'] = false;
        if (!PRINTING){
            out_done();

        }
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

// https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript

function convertToRoman(num) {
    var roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };
    var str = '';
  
    for (var i of Object.keys(roman)) {
      var q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }
  
    return str;
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
            print_screen([skill, character['skills'][skill]]);
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

function add_xp(target, amt){
    print_term(`You gain ${amt} XP!`);
    target['xp'] += amt;
    if (target['xp'] >= target['max_xp']){
        print_screen(['xp-bar', 'ding']);
        print_screen(['class-select', 'hide']);
        var local_class = 'None';
        while (target['xp'] > target['max_xp']){
            target['class_levels'][target['class']] += 1;
            target['xp'] -= target['max_xp'];
            target['max_xp'] *= 2;
            var tname = classes[target['class']]['name'];
            var tskill = classes[target['class']]['skill'];
            target['skills'][tskill] += 5;
            print_term(`[CLASS] You level up as a ${tname} and gain more ${tskill} skill!`);
            print_screen(['class', tname.substring(0, 5)]);
            print_screen(['class_level', target['class_levels'][target['class']]]);
            print_screen([tskill, target['skills'][tskill]]);

        }
    }
    print_screen(['xp-bar', Math.round((target['xp']/target['max_xp'])*100)]);
}

function choose_class(class_name){
    game_state['current_character']['class'] = class_name;
    update_indiv_element(['class', classes[class_name]['name'].substring(0, 5)]);
    update_indiv_element(['class_level', 0]);
    update_indiv_element(['class-select', 'hide']);
}

function get_name(){
    var name_length = roll(1, 4)+2;
    var name = '';
    for (let i=0; i<name_length; i++){
        name += pick(phonemes);
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function get_stat(){
    return smallest(roll(3, 6) + 2, 18);
}

function get_bonus(person, stat){
    return smallest((person['stats'][stat]-10)/2)
}

function get_monster(level){
    target = monster_index[level][roll(1, monster_index[level].length)-1];
    base = {...base_monster};
    hp = roll(level+1, 6);
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
    if (Object.keys(game_state['current_character']['spells']).length >= 10){
        off_print_term('[SPELL] Spell limit reached!');
        return;
    }
    done = false;
    while (!done){
        curr_spell = {...base_spell};
        spell_power = roll(1, 10);
        if (spell_power < 5){
            curr_spell['name'] = 'Minor ';
            curr_spell['power'] = 1;
        }else if (spell_power < 8){
            curr_spell['name'] = 'Major ';
            curr_spell['power'] = 2;
        }else if (spell_power < 9){
            curr_spell['name'] = 'Anagrammatised ';
            curr_spell['power'] = 3;
        }else {
            curr_spell['name'] = 'Heofonlich ';
            curr_spell['power'] = 5;
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
        if (!Object.keys(game_state['current_character']['spells']).includes(curr_spell['name'])){
            done = true;
        }
    }

    return curr_spell
}

function get_melee_weapon(level){
    n = '';
    if (level < 3){
        n += pick(['Rusty ', 'Old ', 'Worn ']);
    }else if (level < 5){
        n += pick(['Industrial ', 'Standard ', 'Small ']);
    }else if (level < 7){
        n += pick(['Cyber', 'Great ', 'Combat '])
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
        print_screen([[tskill, hero['skills'][tskill]], ['inventory', 'Skill Manual ('+tskill+')']])
    }else if (result == 8){
        print_term('You find a spell!');
        new_spell = get_spell(level);
        hero['spells'][new_spell['name']] = new_spell;
        print_screen(['spells', new_spell['name']]);
    }
}

function cast(name){
    if (game_state['player_casting']){
        print_term('[SPELL] You are already casting a spell!', true);
        return false;
    }else if (game_state['player_dead'] || game_state['game_over'] || game_state['paused']){
        return false;
    }else{
        if (game_state['current_character']['spells'].hasOwnProperty(name)){
            if (game_state['current_character']['stats']['cha'] >= game_state['current_character']['spells'][name]['cost']){
                game_state['player_casting'] = true;
                print_term('[SPELL] Now casting '+name+'...', true);
                print_screen(['casting-bar', game_state['current_character']['spells'][name]['casting_time']], true);
                target_spell = {...game_state['current_character']['spells'][name]};
                delete game_state['current_character']['spells'][name];
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
    if (game_state['player_fighting']){ // Delay effects of spell until combat finishes
        setTimeout(()=>{finish_cast(spell)}, 500);
        return;
    }
    game_state['player_casting'] = false;
    outstrings = [];
    outupdates = [];
    if (skill_check(game_state['current_character'], 'int', 'spellcasting', spell['power']-game_state['current_character']['class_levels']['magic_user'])){
        off_print_term('[SPELL] Casting succeeded!');
        game_state['current_character']['stats']['cha'] -= spell['cost'];
        //lotus flame matrix tensor
        if (spell['effect'] == 'lotus'){
            health_bonus = roll(spell['power'], 10)+3;
            off_print_term('[SPELL] You feel rejuvenated and gain '+health_bonus+' HP + '+spell['power']*3+' CHA!');
            heal(game_state['current_character'], health_bonus);
            game_state['current_character']['stats']['cha'] += spell['power']*3;
            off_print_screen(['hp', game_state['current_character']['hp']])
        }else if (spell['effect'] == 'tensor'){
            off_print_term('[SPELL] Your attacks are imbued with a strange, external force tensor...');
            game_state['current_character']['ranged_attacks'] += spell['power'];
            game_state['current_character']['attacks'] += spell['power'];
            off_print_screen([['ranged_attacks', game_state['current_character']['ranged_attacks']], ['attacks', game_state['current_character']['attacks']]]);
        }else if (spell['effect'] == 'matrix'){
            off_print_term('[SPELL] You download information from the matrix...');
            tskill = pick(skills);
            game_state['current_character']['skills'][tskill] += 12*spell['power'];
            off_print_screen([tskill, game_state['current_character']['skills'][tskill]]);
        }else if (spell['effect'] == 'flame'){
            off_print_term('[SPELL] You are wreathed in flame...');
            game_state['current_character']['damage'] += spell['power'];
            off_print_screen(['damage', game_state['current_character']['damage']]);
        }

    }else{
        off_print_term('[SPELL] The spell backfires, harming you but giving you extra experience!');
        game_state['current_character']['stats']['cha'] -= spell['cost'];
        game_state['current_character']['skills']['spellcasting'] += 5
        backfire = roll(spell['risk'], 6);
        print_term('[SPELL] Residual spell energy scorches you for '+backfire+' damage!')
        hurt(game_state['current_character'], backfire);
        off_print_screen(['spellcasting', game_state['current_character']['skills']['spellcasting']])
    }
    off_print_screen(['cha', game_state['current_character']['stats']['cha']]);
    // console.log(outupdates, 'UPDATES')
    // print_term(outstrings,);
    // print_screen(outupdates,);
}

function destroy_spell(spell){
    if (game_state['player_fighting']){ // no destroying spells mid combat
        setTimeout(()=>{destroy_spell(spell)}, 500);
        return;
    }
    if (game_state['player_dead'] || game_state['game_over'] || game_state['paused']){
        return false;
    }
    if (game_state['current_character']['spells'].hasOwnProperty(spell)){
        print_term('[SPELL] Your mind rejects the '+spell+' ideoform...', true);
        hp_return = game_state['current_character']['spells'][spell]['power']*3;
        exp_gain = game_state['current_character']['spells'][spell]['power']*2;
        cha_gain = Math.ceil(game_state['current_character']['spells'][spell]['power']/2);
        off_print_term(`[SPELL] Destroyed ${spell} for ${hp_return} bonus HP, ${exp_gain}% Spellcasting skill, and ${cha_gain} CHA!`);
        game_state['current_character']['hp'] += hp_return;
        game_state['current_character']['skills']['spellcasting'] += exp_gain;
        game_state['current_character']['stats']['cha'] += cha_gain
        off_print_screen([['hp', game_state['current_character']['hp']], ['spellcasting', game_state['current_character']['skills']['spellcasting']], ['cha', game_state['current_character']['stats']['cha']]]);
        delete game_state['current_character']['spells'][spell];
        e = document.getElementById('spell_'+spell);
        e.parentNode.removeChild(e);
    }else{
        print_term('[SPELL] 404 No Such Spell', true)
    }
}

function grant_upgrade(upgrade){
    if (game_state['player_dead'] || game_state['game_over'] || game_state['paused']){
        return false;
    }
    console.log(upgrade);
    print_term('[UPGRADE] A strange power builds within you...', true);
    document.getElementById('upgrade-list-1').innerHTML = '';
    document.getElementById('upgrade-list-2').innerHTML = '';
    document.getElementById('upgrade-list-3').innerHTML = '';

    if (stats.includes(upgrade)){
        off_print_term('[UPGRADE] Your '+upgrade.toUpperCase()+' increases by 1.');
        game_state['current_character']['stats'][upgrade] += 1;
        off_print_screen([upgrade, game_state['current_character']['stats'][upgrade]]);
    }else if (upgrade == 'spell'){
        off_print_term('[UPGRADE] Your mind generates a new spell-thought.');
        level_bonus = get_spell(game_state['curr_level']);
        game_state['current_character']['spells'][level_bonus['name']] = level_bonus;
        off_print_screen(['spells', level_bonus['name']]);
    }else if (upgrade == 'skill'){
        off_print_term('[UPGRADE] Your skills are enhanced by countless micro-adjustments attuned to the matrix.');
        skills.forEach((elem)=>{
            game_state['current_character']['skills'][elem] += 5;
            off_print_screen([elem, game_state['current_character']['skills'][elem]]);
        })
    }else if (upgrade == 'bonus'){
        off_print_term('[UPGRADE] A hyperdimensional god-entity blesses you from a rimward plane of existence.');
        game_state['current_character']['hp'] += 30;
        game_state['current_character']['max_hp'] += 30;
        off_print_screen([['hp', game_state['current_character']['hp']], ['max_hp', game_state['current_character']['max_hp']]]);
    }else if (upgrade == 'wake'){
        off_print_term('[UPGRADE] A series of psychological and technical revelations shake your mind. You realise the simulated nature of reality at a higher level than ever thought possible...');
        off_print_screen(['hack-section', 'show']);
    }
    console.log(OFF_QUEUE);
}

function loop_step(){
    if (game_state['game_over']){
        return
    }
    main_character = game_state['current_character'];
    if (game_state['curr_level'] > 9){
        console.log('out1')
        print_term('You win!');
        game_end_function(main_character);
        return;
    }
    console.log(main_character)
    game_state['curr_turn'] += 1;
    print_term('[SYSTEM] Turn '+game_state['curr_turn']);
    res = encounter_roll(main_character, game_state['curr_level']);
    if (!res || is_dead(main_character)){
        game_state['player_dead'] = true;
        game_end_function(main_character);
        return false;
    }
    if (skill_check(main_character, 'int', 'navigation', game_state['curr_level'])){
        print_term('You progress further into the dungeon...');
        game_state['curr_length'] -= greatest(0, roll(1, 3) + get_bonus(main_character, 'int'));
    }
    if (game_state['curr_length'] <= 0){
        print_term('You find the stairs to the next floor...');
        game_state['curr_level'] += 1;
        game_state['curr_length'] = roll(3, 6)+3+game_state['curr_level'];
        bump = roll (2, 6);
        main_character['max_hp'] += bump;
        main_character['hp'] += bump;
        print_term('[LEVEL UP]');
        print_term('You gain '+bump+' HP.');
        print_screen(['upgrade-list', 'fill']);
        print_screen([['level', game_state['curr_level']], ['max_hp', main_character['max_hp']], ['hp', main_character['hp']]]);
    }
}

function game_end_function(hero){
    if (!game_state['game_over']){
        game_state['game_over'] = true;
        print_term('Your final score was '+(hero['gold']+game_state['curr_turn']+(game_state['curr_level']*10))+'. Reincarnate or reload to start a new character.');
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
        add_xp(current_hero, amt);
    }else if (enc == 5){
        print_term('You look around for anything interesting...');
        if (roll(1,greatest(4, 10-clevel)) < 7){
            print_term('You find some treasure!');
            roll_treasure(current_hero, clevel);
        };
    }else if (enc == 6){
        print_term('You take a breather...');
        if (current_hero['hp'] < current_hero['max_hp']/3){
            print_term('You try to rest!');
            heal(current_hero, roll(1,6)+clevel);
        }else if (you['class_levels']['magic_user'] >= 1){
            print_term('[CLASS] You try to think of an original thought...');
            if (skill_check(game_state['current_character'], 'cha', 'spellcasting', -Math.round(game_state['curr_level']/3))){
                print_term('A new spell-thought manifests in the void of your mind spontaneously!');
                spell_bonus = get_spell(game_state['curr_level']);
                game_state['current_character']['spells'][spell_bonus['name']] = spell_bonus;
                print_screen(['spells', spell_bonus['name']]);
            }else{
                print_term('But nothing came to mind.')
            }
        }
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
    print_term('En garde...')
    print_term('===COMBAT LOG===')
    print_screen(['combat', 'show'])
    game_state['player_fighting'] = true;

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
                    game_state['player_fighting'] = false;

                    print_screen(['combat', 'hide']);
                    print_term('The '+enemy['name']+' died!');
                    print_term('===END COMBAT LOG===');
                    add_xp(you, roll(game_state['curr_level'], 6))
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
        if (you['class_levels']['thief'] >= 2 && skill_check(you, 'dex', 'footing', enemy['tactic'])){
            var sneak_dmg = roll(you['class_levels']['thief'], 6) + get_bonus(you, 'dex'); 
            print_term(`[CLASS] You surprise the ${enemy['name']} and deal ${sneak_dmg} surprise damage!`);
            edge = 6;
            hurt(enemy, sneak_dmg, false);
            if (is_dead(enemy)){
                game_state['player_fighting'] = false;

                print_screen(['combat', 'hide']);
                print_term('The '+enemy['name']+' died!');
                print_term('===END COMBAT LOG===');
                add_xp(you, roll(game_state['curr_level'], 6))
                return true;
            }
        }else{
            print_term('You are surprised by the '+enemy['name']+'!');
        }
    }

    print_term('You enter melee combat...')
    fled = false;
    max_rounds = 100;
    // Melee phase (until someone is dead or flees)
    while (!fled){
        max_rounds -= 1;
        if (max_rounds <= 0){
            print_term('Tiebreak!');
            game_state['player_fighting'] = false;

            print_screen(['combat', 'hide']);
            return true;
        }else if (you['class_levels']['thief'] >= 1 && (you['hp']/you['max_hp'] >= 0.25)){
            print_term('[CLASS] Wounded, you try to escape...');
            if (skill_check(you, 'dex', 'navigation', enemy['speed'])){
                print_term('[CLASS] You flee successfully!');
                game_state['player_fighting'] = false;
                print_screen(['combat', 'hide']);
                return true;
            }else{
                print_term('[CLASS] But the monster catches up...');
            }
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
            dmg = Math.round(roll(you['attacks'], greatest(you['damage'] - enemy['tough'], 2)) + get_bonus(you, 'str') + you['class_levels']['fighter']);
            if (skill_check(you, 'int', 'perception', enemy['strange'] - edge)){
                print_term('Critical hit!');
                dmg *= 2;
            }
            if (you['class_levels']['fighter'] >= 1 && skill_check(you, 'str', 'melee', enemy['strange'] - edge)){
                print_term('[CLASS] Brutal attack!')
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
            game_state['player_fighting'] = false;
            print_term('You died!');
            print_screen(['combat', 'hide']);

            return false;
        }else if (is_dead(enemy)){
            game_state['player_fighting'] = false;

            print_term('The '+enemy['name']+' died!');
            print_screen(['combat', 'hide']);
            print_term('===END COMBAT LOG===');
            add_xp(you, roll(game_state['curr_level'], 6))
            return true;
        }

    }
    return true;
}

function start_game(){
    game_state['current_character'] = JSON.parse(JSON.stringify(base_hero));
    game_state['current_character']['name'] = get_name();
    stats.forEach(element => {
        start_val = get_stat();
        game_state['current_character']['stats'][element] = start_val;
    });
    start_bonus = get_spell(1);
    game_state['current_character']['spells'][start_bonus['name']] = start_bonus;
    console.log(game_state['current_character']);
    full_character_update();
    print_screen(['upgrade-list', 'show']);

    print_screen(['spells', start_bonus['name']]);

    print_screen(['class-select', 'show']);

    print_term('You begin your adventure...');
    loop_step();
}

start_game();
