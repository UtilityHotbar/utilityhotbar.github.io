QUEUE = [];
OTHER_ELEMENT_QUEUE = [];
PRINTING = false;
const UPDATE_KEYWORD = '%UPDATE%'

function print_term(ts, d=550, l='mainterm') {  // push string or list of strings to print queue
    if (typeof ts === 'string'){
        QUEUE.push(ts);
    }else if (typeof ts === 'object'){
        QUEUE.push.apply(QUEUE, ts);
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
        if (QUEUE.length == 0){
            PRINTING = false;
            return;
        }
    }
    tl = t + '<br>';
    i = document.getElementById(elem)
    i.innerHTML += tl;
    i.scrollTop = i.scrollHeight;


    if (QUEUE.length > 0){
        window.setTimeout(()=>{out(delay=delay, elem=elem)}, delay);
    }else{
        PRINTING = false;
    }
}

function print_screen(changes){
    OTHER_ELEMENT_QUEUE.push(changes);
    QUEUE.push(UPDATE_KEYWORD);
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
            document.getElementById('combat-table').style.opacity = '100%';
        }else if (elem_new_val == 'hide'){
            document.getElementById('combat-table').style.opacity = '0%';
        }
    }else if (elem_name == 'edge'){
        for (i=-6; i<=6; i++){
            document.getElementById('edge'+i).style.backgroundColor = 'inherit';
        }
        console.log([elem_new_val])
        document.getElementById('edge'+elem_new_val).style.backgroundColor = 'antiquewhite';
    }else{
        document.getElementById(elem_name).innerHTML = elem_new_val;
    } 
}

