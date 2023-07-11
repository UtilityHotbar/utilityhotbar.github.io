"use strict";

class WebApplet{
    constructor(elemScript = '', elemCSS = ''){
        this.elemScript = elemScript;
        this.elemCSS = elemCSS;
        this.pages = {0: new Page()};
    }
}

class Page{
    constructor(){
        this.hierarchy = [];
    }

    order_all_elems(){
        for (let i=0; i<this.hierarchy.length; i++){
            var obj = this.hierarchy[i];
            obj.css('z-index', i);
        }
    }

    shift(key, amt){
        var obj = this.hierarchy[key];
        this.hierarchy.splice(key, 1);
        var new_amt = key+amt;
        if (new_amt < 0){
            new_amt = 0;
        }else if (new_amt > this.hierarchy.length ){
            new_amt = this.hierarchy.length;
        }
        this.hierarchy.splice(new_amt, 0, obj);
        this.order_all_elems();
    }

    kill(item){
        this.hierarchy.splice(item.css('z-index'), 1);
        item.remove();
    }

    load_for_editing(){
        this.hierarchy.forEach(function (elem, i){
            $('#display-area').append(elem);
            setupInteractive(elem);
        })
        this.order_all_elems();
    }

    display(){
        this.hierarchy.forEach(function (elem, i){
            document.getElementById('display-area').appendChild(elem[0]);
        })
        this.order_all_elems();
    }

    render(){
        var screen = $('<div>');
        this.hierarchy.forEach(function (elem, i){
            screen.append(elem);
        });
        var result = screen.prop('outerHTML');
        return result;
    }
}

var DO_NOT_INTERRUPT = false;
var ID_COUNT = 0;
var CURR_PAGE = 0;
var PAGE_COUNT = 1;
var APPLET = new WebApplet();
// var old_project = window.localStorage.getValue('saved-project');
// if (old_project){
//     APPLET = set_up_old_project(old_project);
// }
var SETTINGS_SHOWN = false;
var MD = window.markdownit({linkify: true, breaks: true});

$('body').data('selectedItem', null);

// UNFINISHED
// function set_up_old_project(old_project){
//     var PROJECT_APPLET = new WebApplet();
//     old_applet_data = old_project['applet'];
//     PROJECT_APPLET.elemCSS = old_applet_data['css'];
//     PROJECT_APPLET.elemScript = old_applet_data['script'];
//     Object.keys(old_project).forEach((elem, i)=>{
//         if (elem == 'applet'){
//             return;
//         }
//         var old_page_hierarchy = old_project[elem];

//     })

// }
function setupInteractive(thing){
    thing.draggable({containment: "#display-area", grid: [10, 10]}).resizable({containment: "#display-area", handles: "all", grid: [10, 10], stop: function (event, ui) {thing.css('height', Math.round(thing.height()/10)*10+'px');thing.css('width', Math.round(thing.width()/10)*10+'px')}});
    thing.on('click', function (e){
        pickMe(thing);
    });
}

function addImage(resource_url){
    var image = $('<img>');
    var image_container = $('<div>');

    image.attr('src', resource_url);
    image.css('width', '100%');
    image.css('height', '100%');
    image.appendTo(image_container);

    image.on('load', function(){
        image_container.css('width', '100px');
        image_container.css('height', Math.round(($(this).height()/$(this).width())*100/10)*10+'px');    
    })
    
    image_container.attr('id', ID_COUNT);
    image_container.css('z-index', '0');
    image_container.addClass('working-obj');

    setupInteractive(image_container);

    $('#display-area').prepend(image_container);
    

    APPLET.pages[CURR_PAGE].hierarchy.push(image_container);
    APPLET.pages[CURR_PAGE].order_all_elems();
    ID_COUNT += 1;
}

function addText(text){
    var text_container = $('<div>');

    var inner_text = $('<div>');

    inner_text.html(text);
    text_container.append(inner_text);

    text_container.attr('id', ID_COUNT);
    text_container.css('z-index', 0);
    text_container.addClass('working-obj');
    text_container.addClass('working-text');

    setupInteractive(text_container);

    $('#display-area').prepend(text_container);

    APPLET.pages[CURR_PAGE].hierarchy.push(text_container);
    APPLET.pages[CURR_PAGE].order_all_elems();
    ID_COUNT += 1;
}

function addYoutube(link){
    var video_id = link.split('watch?v=')[1];
    var video_container = $('<div>');

    var inner_video = $('<iframe id="ytplayer" type="text/html" frameborder="0"></iframe>');
    inner_video.css('width', '100%');
    inner_video.css('height', '100%');
    inner_video.css('pointer-events', 'none');
    inner_video.attr('src', 'https://www.youtube.com/embed/'+video_id)
    video_container.append(inner_video);

    video_container.attr('id', ID_COUNT);
    video_container.css('z-index', 0);
    video_container.addClass('working-obj');

    setupInteractive(video_container);

    $('#display-area').prepend(video_container);

    APPLET.pages[CURR_PAGE].hierarchy.push(video_container);
    APPLET.pages[CURR_PAGE].order_all_elems();
    ID_COUNT += 1;
}

function addButton(button_text){
    var button = $('<button>');
    var button_container = $('<div>');

    button.html(button_text);
    button.css('width', '100%');
    button.css('height', '100%');
    button.appendTo(button_container);

    button_container.attr('id', ID_COUNT);
    button_container.css('z-index', '0');
    button_container.addClass('working-obj');
    button_container.addClass('working-button');

    setupInteractive(button_container);

    $('#display-area').prepend(button_container);
    

    APPLET.pages[CURR_PAGE].hierarchy.push(button_container);
    APPLET.pages[CURR_PAGE].order_all_elems();
    ID_COUNT += 1;
}

function fetch_resource(){
    var resource_string = $('#additionurl').val();
    var resource_type = $('#additiontype').val();
    console.log('firing', resource_string, resource_type);
    if (!resource_string){
        return false;
    }
    if (resource_type == 'img'){
        addImage(resource_string);
    }else if (resource_type == 'text'){
        addText(resource_string);
    }else if (resource_type == 'youtube'){
        addYoutube(resource_string);
    }else if (resource_type == 'button'){
        addButton(resource_string);
    }
}

function setupData(item){
    item.data('setup-script', '');
    item.data('onclick-script', '');
    item.data('player-character', false);
}

function pickMe(item){
    if ($('body').data('selectedItem')){
        $('body').data('selectedItem').removeClass('selected');
    }
    $('body').data('selectedItem', item);
    item.addClass('selected');
    inspectProperties(item);
}

function unpick(){
    if ($('body').data('selectedItem')){
        $('body').data('selectedItem').removeClass('selected');
        $('body').data('selectedItem', null);
        $('#inspector-pane').html('NOTHING SELECTED YET');
    }
}

function inspectProperties(item){
    var item_id = item.attr('id');
    item = item.children();
    $('#inspector-pane').html('');
    var item_type = item.prop('nodeName').toLowerCase();
    $('#inspector-pane').append('<h2>'+item_type+' #'+item_id+'</h2>');
    var up = $('<button class="control-button">⬆️</button>');
    var down = $('<button class="control-button">⬇️</button>');
    var remove = $('<button class="control-button">❌</button>');
    var deselect = $('<button class="control-button">🚫</button>');
    var settings = $('<button class="control-button">⚙️</button>');
    var settings_exposed = false;

    up.click(function (){
        APPLET.pages[CURR_PAGE].shift(item.parent().css('z-index'), 1)
    })
    down.click(function (){
        APPLET.pages[CURR_PAGE].shift(item.parent().css('z-index'), -1)
    })
    remove.click(function(){
        APPLET.pages[CURR_PAGE].kill(item.parent());
        unpick();
    })
    deselect.click(function(){
        unpick();
    })
    
    settings.click(function(){
        if (settings_exposed){
            return;
        }
        settings_exposed = true;
        var localcsseditor = $('<div id="newlocalcss" name="newlocalcss"></div>');
        localcsseditor.css('min-width', '300px');
        localcsseditor.css('min-height', '50px');
    
        $('#inspector-pane').append('<br><br><strong>Element-specific CSS: </strong><br><i>Warning: Do not set element width, height, position etc. using CSS. This will mess with the export process!</i><br><br>');
        $('#inspector-pane').append(localcsseditor);
        var localcssaceeditor = ace.edit("newlocalcss");
        localcssaceeditor.setValue(item.attr('style'));
        localcssaceeditor.setTheme("ace/theme/dracula");
        localcssaceeditor.session.setMode("ace/mode/text");
        localcssaceeditor.session.setUseWrapMode(true);

        var setlocalcss_button = $('<br><button class="control-button">Set Local CSS</button>');
        setlocalcss_button.click(function() {
            var data = localcssaceeditor.getValue();
            item.attr("style", data);
        })
        $('#inspector-pane').append(setlocalcss_button);
    })

    $('#inspector-pane').append(up);
    $('#inspector-pane').append(down);
    $('#inspector-pane').append(remove);
    $('#inspector-pane').append(deselect);
    $('#inspector-pane').append(settings);

    $('#inspector-pane').append('<br><br>');
    if (item_type == 'img'){
        $('#inspector-pane').append('<label for="newsrc">Source: </label>');
        $('#inspector-pane').append(`<input id="newsrc" name="newsrc" type="text" value="${item.attr('src')}">`);
        $('#inspector-pane').append('<br><br>');
        var reload_button = $('<button class="control-button">Reload source</button>');
        reload_button.click(function() {
            item.attr('src', $('#newsrc').val());
        })
        $('#inspector-pane').append(reload_button);
    }else if (item_type == 'div'){
        var texteditor = $('<div id="newcontent" name="newcontent"></div>');
        texteditor.css('min-width', '300px');
        texteditor.css('min-height', '200px');
        

        $('#inspector-pane').append('<strong>Content: </strong><br><br>');
        $('#inspector-pane').append(texteditor);
        $('#inspector-pane').append('<br><input type="checkbox" id="markdown-opt" name="markdown-opt"><label for="markdown-opt"> Format Markdown if present</label><br>')
        
        var editor = ace.edit("newcontent");
        editor.setValue(item.html());
        editor.setTheme("ace/theme/dracula");
        editor.session.setMode("ace/mode/html");
        editor.session.setUseWrapMode(true);

        var reload_button = $('<br><button class="control-button">Reload content</button>');
        reload_button.click(function() {
            var data = editor.getValue();
            if ($('#markdown-opt').prop("checked")){
                data = MD.render(data);
            }
            item.html(data);
        })
        $('#inspector-pane').append(reload_button);
    }else if (item_type == 'button'){
        $('#inspector-pane').append('<label for="newtext">Button text: </label>');
        $('#inspector-pane').append(`<input id="newtext" name="newtext" type="text" value="${item.html()}">`);
        $('#inspector-pane').append('<br><br>');
        var reload_button = $('<button class="control-button">Reload button text</button>');
        reload_button.click(function() {
            item.html($('#newtext').val());
        })
        $('#inspector-pane').append(reload_button);
        var texteditor = $('<div id="newscript" name="newscript"></div>');
        texteditor.css('min-width', '300px');
        texteditor.css('min-height', '50px');
    
        $('#inspector-pane').append('<br><br><strong>On click (Javascript): </strong><br><br>');
        $('#inspector-pane').append(texteditor);
        var editor = ace.edit("newscript");
        editor.setValue(item.attr('onclick'));
        editor.setTheme("ace/theme/dracula");
        editor.session.setMode("ace/mode/javascript");
        editor.session.setUseWrapMode(true);

        var setjs_button = $('<br><button class="control-button">Set Onclick</button>');
        setjs_button.click(function() {
            var data = editor.getValue();
            item.attr("onclick", data);
        })
        $('#inspector-pane').append(setjs_button);

    }
}

$('body').on('keyup', shortcutController);

function shortcutController(e){
    if ($('body').data('selectedItem')){
        e.preventDefault();
        if (e.key == 'ArrowUp'){
            var curr_z = parseInt($('body').data('selectedItem').css('z-index'));
            APPLET.pages[CURR_PAGE].shift(curr_z, 1);
        }
        if (e.key == 'ArrowDown'){
            var curr_z = parseInt($('body').data('selectedItem').css('z-index'));
            APPLET.pages[CURR_PAGE].shift(curr_z, -1);
        }
        if (e.key == 'Escape'){
            unpick();
        }
    }
}

function clear_working_area(){
    unpick();
    $('#display-area').html('');
}

function add_page(){
    APPLET.pages[PAGE_COUNT] = new Page();
    PAGE_COUNT += 1;
    go_to_page(PAGE_COUNT-1);
}

function go_to_page(page = null){
    if (page === null){
        page = parseInt($('#goto-target').val());
    }
    if (page < PAGE_COUNT){
        clear_working_area();
        CURR_PAGE = page;
        APPLET.pages[CURR_PAGE].load_for_editing();
        $('#curr-page').html(page);
    }else{
        console.log('invalid page number '+page);
    }

}

function package_for_export(){
    $('#loading-screen').css('display', 'block');
    var EXPORT_PACKAGE = {'applet': {'css': APPLET.elemCSS, 'script': APPLET.elemScript}};
    var last_page = CURR_PAGE;
    Object.keys(APPLET.pages).forEach(function (page_num, i){
        var page_to_export = APPLET.pages[page_num];
        var target_page = new Page();
        go_to_page(page_num);
        page_to_export.hierarchy.forEach(function (elem, i){
            var elem_inner = $(elem.children()[0]).clone();
            var target_height = elem.css('height');
            var target_width = elem.css('width');
            var target_left = elem.css('left');
            var target_top = elem.css('top');

            elem_inner.css('height', target_height);
            elem_inner.css('width', target_width);
            elem_inner.css('left', target_left);
            elem_inner.css('top', target_top);
            elem_inner.css('position', 'absolute');
            elem_inner.css('pointer-events','auto');

            target_page.hierarchy.push(elem_inner);
        })
        EXPORT_PACKAGE[page_num] = target_page.render();
    })
    var export_data = JSON.stringify(EXPORT_PACKAGE);
    $('#export-data').html(export_data);
    localStorage.setItem('saved-project', export_data);
    go_to_page(last_page);
    $('#loading-screen').css('display', 'none');
}

function toggle_settings(){
    if (SETTINGS_SHOWN){
        SETTINGS_SHOWN = false;
        $('#settings-panel').html('');
        return;
    }
    SETTINGS_SHOWN = true;
    $('#settings-panel').append('<h2>Page Settings</h2>');

    var csseditor = $('<div id="doccss" name="doccss"></div>');
    csseditor.css('width', '700px');
    csseditor.css('height', '250px');

    $('#settings-panel').append('<strong>Document CSS:</strong><br>The display area id is "display-area". It is recommended that you prefix all css selectors with #display-area. <i>Warning: Do not set element width, height, position etc. using CSS. This will mess with the export process!</i><br><br>');
    $('#settings-panel').append(csseditor);
    
    var ace_css_editor = ace.edit("doccss");
    // APPLET.elemCSS = $('#display-area').attr("style");
    ace_css_editor.setValue(APPLET.elemCSS);
    ace_css_editor.setTheme("ace/theme/dracula");
    ace_css_editor.session.setMode("ace/mode/css");

    var saveCSS = $('<button class="control-button">Apply CSS</button>');
    saveCSS.click(function() {
        var newCSS = ace_css_editor.getValue();
        APPLET.elemCSS = newCSS;
        $('#additional-styling').html(newCSS);
    });

    $('#settings-panel').append('<br>');

    $('#settings-panel').append(saveCSS);

    $('#settings-panel').append('<br><br>');

    var scripteditor = $('<div id="docscript" name="docscript"></div>');
    scripteditor.css('width', '700px');
    scripteditor.css('height', '250px');
    

    $('#settings-panel').append('<strong>Document Script:</strong><br>This javascript code will be loaded and executed with your applet.<br><br>');
    $('#settings-panel').append(scripteditor);
    
    var ace_script_editor = ace.edit("docscript");
    ace_script_editor.setValue(APPLET.elemScript);
    ace_script_editor.setTheme("ace/theme/dracula");
    ace_script_editor.session.setMode("ace/mode/javascript");

    var saveScript = $('<button class="control-button">Save Script</button>');
    saveScript.click(function() {
        APPLET.elemScript = ace_script_editor.getValue();
    });

    $('#settings-panel').append('<br>');

    $('#settings-panel').append(saveScript);
    

}

function launch(){
    package_for_export();
    window.open('viewer.html', 'My Project');

}

