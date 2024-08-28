"use strict";

const CONFIG = {
    editor_size: 10,
    editor_width: 55,
    editor_id: 'editor-body',
    editor_output: 'editor-output',
    editor_key_config: {
        UP : 'ArrowUp',
        DOWN: 'ArrowDown',
        RETURN: 'Enter',
        BACKSPACE: 'Backspace',
        TAB: 'Tab',
    }
}

const BIGINT = 999999999999

const wrap = (s, w) => s.replace(
    new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);

function editorMultilinePasteManager(e){
    e.preventDefault();
    var text = e.clipboardData.getData('text');
    if (text){
        var line_id = document.activeElement.id
        var line_num = parseInt(line_id.split('editor-line-')[1])
        if (line_num !== undefined){
            editorSetContent(line_num, text, 'x')
        }
    }
}

function editorCreateLine(i){
    let di = document.createElement('th')
    di.innerHTML = i
    di.classList.add('editor-linenum')
    di.id = 'editor-linenum-'+i

    let d = document.createElement('textarea')
    d.classList.add('editor-line')
    d.rows = 1
    d.cols = CONFIG.editor_width
    // d.contentEditable = true
    d.id = 'editor-line-'+i
    
    let tr = document.createElement('tr')
    tr.appendChild(di)
    tr.appendChild(d)
    document.getElementById(CONFIG.editor_id).appendChild(tr)
}

function editorInit(){
    for (let i=0;i<CONFIG.editor_size;i++){
        editorCreateLine(i)
    }

    let editor = document.getElementById(CONFIG.editor_id)
    editor.onkeydown = (e) => {editorKeyHandler(e)}
    editor.onkeyup = (e) => {editorLineWrapHandler('current')}
    // document.oncopy = (e) => {
    //     var userSelection;
    //     if (window.getSelection) {
    //         userSelection = window.getSelection();
    //     } else if (document.selection) {
    //         userSelection = document.selection.createRange();
    //     }
    //     var selectedText = userSelection;
    //     if (userSelection.text) {
    //         selectedText = userSelection.text;
    //     }
    //     e.clipboardData.setData('text', selectedText);
    // }

}

function editorLineWrapHandler(elem){
    if (elem == 'current'){
        var d = document.activeElement
    }else{
        var d = document.getElementById('editor-line-'+elem);
    }
    var line = d.value
    line = wrap(line, CONFIG.editor_width)
    let newlines = line.split(/\r\n|\r|\n/).length
    d.rows = newlines
}

function editorMigrate(start_line, distance, special = null){
    var all_content = []
    for (let i=start_line;i<CONFIG.editor_size;i++){
        let e = document.getElementById('editor-line-'+i);
        all_content.push(e.value)
        e.value = ''
        e.rows = 1
    }
    console.log(all_content)

    // s = strict newline
    if (special !== 's'){
        for (let k = 0; k<all_content.length; k++){
            if (all_content[all_content.length-k-1].length > 0){
                all_content = all_content.slice(0, all_content.length-k)
                console.log(all_content)
                break
            }
        }
    
    }
    // c = collapse extra newlines
    if (special == 'c'){
        var new_content = []
        for (let k = 0; k<all_content.length; k++){
            if (all_content[k].length > 0){
                new_content.push(all_content[k])
            }else if (new_content[new_content.length-1] !== ''){
                new_content.push('')
            }
        }
        if (new_content[0] == ''){
            new_content.shift()
        }
        all_content = new_content
    
    }

    var new_start_line = start_line+distance
    for (let j=0; j<all_content.length;j++){
        let corr_num = (j+new_start_line)
        if (corr_num >= CONFIG.editor_size){
            CONFIG.editor_size += 1
            editorCreateLine(corr_num)
        }
        editorSetContent(corr_num, all_content[j])
    }

}

function editorGetContent(line_num){
    return document.getElementById('editor-line-'+line_num).value
}

function editorSetContent(line_num, content, mode='r'){
    var cline = document.getElementById('editor-line-'+line_num)
    // Replace
    if (mode == 'r'){
        cline.value = content
    // Append
    }else if (mode == 'a'){
        cline.value += content
    //prepend
    }else if (mode == 'p'){
        cline.value = content + cline.value
    // Expand
    }else if (mode == 'x'){
        content = content.split('\n')
        console.log(content)
        editorMigrate(line_num+1, content.length-1, 's')
        for (let i=0; i<content.length; i++){
            editorSetContent(line_num+i, content[i].trimStart())
        }
    }
    editorLineWrapHandler(line_num)
}

function editorSetFocus(line_num, pos=-1, pos_end=-1){
    var newelem = document.getElementById('editor-line-'+line_num)
    if (pos!==-1){

        var rangeStart = pos
        var rangeEnd = pos

        var cutoff = newelem.value.length
        if (pos_end !== -1){
            rangeEnd = pos_end
        }

        if (0 > rangeStart || rangeStart > cutoff){
            rangeStart = Math.max(Math.min(cutoff, rangeStart), 0)
        }
        if (0 > rangeEnd || rangeEnd > cutoff){
            rangeEnd = Math.max(Math.min(cutoff, rangeEnd), 0)
        }
        newelem.setSelectionRange(rangeStart, rangeEnd)
    }
    newelem.focus()
}

function editorCompile(){
    var compiled_content = ''
    for (let i=0; i<CONFIG.editor_size; i++){
        compiled_content += editorGetContent(i)+'\n'
    }
    document.getElementById(CONFIG.editor_output).innerHTML = compiled_content.trim()
}

function editorKeyHandler(e){
    var line_id = document.activeElement.id

    var line_num = parseInt(line_id.split('editor-line-')[1])
    var caret = document.activeElement.selectionStart
    var line = document.activeElement.value
    if (line_num === undefined){
        return
    }
    if (e.key == CONFIG.editor_key_config.TAB){
        e.preventDefault();
        let prev_line = line.substring(0, caret)
        let rest_of_line = line.substring(caret)
        editorSetContent(line_num, prev_line+'\t'+rest_of_line)
        editorSetFocus(line_num, caret+1)
    }
    else if (e.ctrlKey && (e.key == CONFIG.editor_key_config.UP || e.key == CONFIG.editor_key_config.DOWN)){
        var new_line_num = line_num;
        if (e.shiftKey && e.key == CONFIG.editor_key_config.UP){
            e.preventDefault();
            console.log('Collapsing')
            editorMigrate(line_num+1, 0, 'c')
        }else if (e.key == CONFIG.editor_key_config.UP){
            e.preventDefault();
            new_line_num = Math.max(0, line_num-1)
        }else if (e.key == CONFIG.editor_key_config.DOWN){
            e.preventDefault();
            new_line_num = Math.min(CONFIG.editor_size, line_num+1)
        }
    
        if (new_line_num !== line_num){
            editorSetFocus(new_line_num, BIGINT)
        }
    }
    else if (e.ctrlKey && e.key == CONFIG.editor_key_config.RETURN){
        e.preventDefault();
        if (e.shiftKey){
            editorSetContent(line_num, '')
            editorSetContent(line_num, line, 'x')
        }else if (caret == line.length-1){
            editorMigrate(line_num+1, 1)
            editorSetFocus(line_num+1)
        }else if (caret == 0){
            editorMigrate(line_num, 1)
            editorSetFocus(line_num+1, 0)
        }else{
            editorMigrate(line_num+1, 1)
            let prev_line = line.substring(0, caret)
            let rest_of_line = line.substring(caret)
            editorSetContent(line_num, prev_line)
            editorSetContent(line_num+1, rest_of_line)
            editorSetFocus(line_num+1, 0)
        }
    }else if (e.ctrlKey && e.key == CONFIG.editor_key_config.BACKSPACE){
        if (e.shiftKey){
            e.preventDefault()
            var range_to_shift = []
            var j = 0
            for (var i=line_num+1; i<CONFIG.editor_size; i++){
                var c = editorGetContent(i)
                if (c.length == 0){
                    break
                }else{
                    range_to_shift.push(c)
                    editorSetContent(i, '')
                    j += 1
                }
            }
            editorSetContent(line_num, '\n'+(range_to_shift.join('\n')), 'a')
            editorMigrate(i, -j)
        }else if (caret == 0){
            e.preventDefault()
            let last_ln = document.getElementById('editor-line-'+(line_num-1))
            let last_ln_len = last_ln.value.length
            document.activeElement.value = ''
            last_ln.value += line
    
            editorSetFocus(line_num-1, last_ln_len)
            editorMigrate(line_num+1, -1)
        }
        
    }else if (e.key == CONFIG.editor_key_config.RETURN){
        document.activeElement.rows += 1
    }else if (e.ctrlKey && e.key == 's'){
        e.preventDefault();
        editorCompile();
    }

}
