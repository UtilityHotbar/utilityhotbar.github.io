const SET_BACKGROUND = false;

var Terminal = (()=>{
  function TerminalConstructor(id){
    this.useJquery = false; // jquery for smooth scroll
    this.html = document.createElement('div');
    this.html.classname = 'Terminal';
    if (typeof(id) === 'string') { this.html.id = id };
    if (SET_BACKGROUND){
      this.html.style.backgroundColor = 'black';
    }
    this.html.style.color = 'white';
    this.html.style.fontSize = '10pt';
    this.html.style.fontFamily = 'VT323,monospace';
    this.html.style.maxHeight = '150px';
    this.html.style.overflowY = 'auto';
    this.html.style.scrollBehaviour = 'smooth'; // not useful for autoscroll bc scrollTop is set manually
    this._output = document.createElement('div');
    this._input = document.createElement('div');
    this.html.appendChild(this._output);
    this.html.appendChild(this._input);

    this.print = (message)=>{
      var newLine = document.createElement('div');
      newLine.textContent = message;
      this._output.appendChild(newLine);
      this.scrollBottom();
    }

    this.input = (prompt, callback)=>{
      var newPrompt = document.createElement('div');
      newPrompt.textContent = prompt;
      this._output.appendChild(newPrompt);
      var newAnswer = document.createElement('input');
      newAnswer.style.color = 'white';
      newAnswer.style.background = '#ffffff00';
      newAnswer.style.outline = 'none';
      newAnswer.style.border = '0px solid';
      newAnswer.onkeydown = (e)=>{
        if (e.which === 13) { // 13 = Enter key
          callback(newAnswer.value);
          newAnswer.remove();
        }else if (e.which === 9||e.which === 37||e.which === 38||e.which === 39||e.which === 40) { // Tab, arrow keys
          e.preventDefault();
        }
      }
      this._input.appendChild(newAnswer);
      setTimeout(()=>{newAnswer.focus()},1); // Create delay to prevent capturing initial keypress
    }

    this.scrollBottom = () => {
      if (this.useJquery){ // "Smooth" animated transition w/ jquery.
        $(this.html).animate({scrollTop: this.html.scrollHeight}, 200);
      }else{
        this.html.scrollTop = this.html.scrollHeight;
      }
    }

    this.onScroll = (newFunc) => { // Overwrites default scroll with custom behaviour :)
      this.scrollBottom = newFunc;
    }
  }
  return TerminalConstructor;
})()
