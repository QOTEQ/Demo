/* eslint-disable */
const { createPopper } = window.Popper;

 import events from './system/events.js';
 import transport from './system/transport.js';
 import store from './system/store.js';
 import router from './system/router.js';
 import dialogs from './system/dialogs.js';

 import parser from './utilities/parser.js';
 import diagram from './editors/diagram.js';
 import codeEditor from './editors/code.js';
 import controllerMain from './controllers/controller_main.js';
 import controllerDiagram from './controllers/controller_diagram.js';
 import controllerTable from './controllers/controller_table.js';

//  const api = window.api;
const modules = {events, transport, store, router, dialogs}

const dm = {
    // mode:'textarea',
    router,

    types:[
        {text:'Form order of goods'},
        {text:'Check availability'},
        {text:'Payment for order' },
        {text:'Notification: out of stock'},
        {text:'Notification: successful payment'},
        {text:'Transfer of goods from the warehouse for dispatch'},
        {text:'Repeat payment'},
        {text:'Sending by one of the ways'},
        {text:'Notification: successful dispatch'},
        {text:'Waiting for delivery'},
        {text:'Notification: shipping problems'},
        {text:'Return of goods to the warehouse'}
    ],
    lines:[],
    cleanLines:[],
    objects:[],
    rgs:{empty:/^\s*$/, regular:/^\s+/, number:/^\s*\#\s*/, star:/^\s*\*\s*/, arrow:/^\s*-\s*\>\s*/, plus:/^\s*\+\s*/, minus:/^\s*-\s*/},
    editingLine:0,
    codeEditorShown:true,
    autocomleteShown:false,
    processes:[
      {name:'Order product', url:'Order product'}
    ],
    subprocesses:[],
    selectedProcessIndex:0,
    elements:{
        processRunButton: document.getElementById('process-run-button'),
        processSaveButton: document.getElementById('process-save-button'),
        paper:document.getElementById('diagram-paper'),
        diagramHeader:document.getElementById('diagram-header'),
        codeEditorContainer:document.getElementById('diagram-text-input-container'),
        processesSelect:document.getElementById('processes-select'),
        lineNumners:document.getElementById('diagram-text-input-line-number'),
        codeEditor:document.getElementById('diagram-text-input'),
        autocomplete:document.getElementById('diagram-text-input-autocomplete'),
        scale:document.getElementById('diagram-scale'),
        closeBtn:document.getElementById('diagram-code-editor-button-close'),
        openBtn:document.getElementById('diagram-code-editor-button-open'),
    },


    async init(){

        this.initControls();

        dialogs.init();


        controllerMain.init(modules);
        controllerDiagram.init(modules);
        controllerTable.init(modules);

        diagram.init(this.elements.paper);
        router.init();
        this.initCodeEditor();

        this.elements.processRunButton.addEventListener('click', this.runProcess.bind(this));
        this.runProcess();
        // dialogs.alert('Test');
        // console.log(parser.parseScript(this.text));
    },

    async loadData(){
      transport.init();
      this.fetchProcess(this.selectedProcessIndex);
    },

    runProcess(){
      const test = document.getElementById('test_component')
      dialogs.open(test, {title:'Test title', buttons:[
        {text:'Custom', callback:()=>{
          this.test();
          dialogs.close();
        }}]
      });
    },

    test(){
      console.log('test')
    },

    initControls(){
      const processes = this.processes.map(p=>`<option value="${p.url}">${p.name}</option>`).join('');
      this.elements.processesSelect.innerHTML = processes;
      this.elements.processesSelect.addEventListener('change', e=>{this.fetchProcess(this.elements.processesSelect.selectedIndex)})
      document.addEventListener('diagram.header.change', e => this.elements.diagramHeader.innerText = e.detail);
      document.addEventListener('diagram.scale.change', e => this.elements.scale.innerText = e.detail.toFixed(1));
    },

    async fetchProcess(index = 0){



        // console.log(index);
        this.selectedProcessIndex = index;

        //  this.processes[index].data = this.text;

        if (!this.processes[index].data) {
          const url = this.processes[index].url;
          try {

            // console.log(window.api.bos)
            const fetched = await window.api.bos.getFlow({name:url});
            this.processes[index].data = fetched.source;
            // this.processes[index].data = '';
          }
          catch(e){
            return console.error(e)
          }
        }
        this.elements.diagramHeader.innerHTML = this.processes[index].name;
        this.elements.codeEditor.value = this.processes[index].data;



        // this.updateValue(this.processes[index].data);
        // console.log(this.processes[index].data);
        this.updateValue2(this.processes[index].data);
        this.showCodeEditor(false);

        // console.log(parser.parseScript(this.text));
    },






    //.....CODE EDITOR

    initCodeEditor(){
        document.addEventListener('selectionchange', (event) => {
            if (document.activeElement === dm.elements.codeEditor) this.onSelectionChange(document.activeElement.selectionStart, document.activeElement.selectionEnd);
        });
        this.elements.codeEditor.addEventListener('input', (event)=>this.updateValue2(event.target.value));
        // this.elements.codeEditor.addEventListener('scroll', (event)=>this.updateScroll(event.target.scrollTop));
        this.elements.codeEditor.addEventListener('scroll', (event)=>this.updateScroll(event.target.scrollTop));
        // this.elements.codeEditor.addEventListener('mousedown', ()=>setTimeout(this.updateAutocomplete.bind(this), 0));
        this.elements.codeEditor.addEventListener('keydown', this.onEditorKeydown.bind(this));
        this.elements.autocomplete.addEventListener('keydown', this.onAutocompleteKeydown.bind(this));
        this.elements.autocomplete.addEventListener('click', this.onAutocompleteClick.bind(this));
        this.elements.openBtn.addEventListener('click', ()=>this.showCodeEditor());
        this.elements.closeBtn.addEventListener('click', ()=>this.showCodeEditor(false));
        // this.elements.autocomplete.addEventListener('blur', this.onAutocompleteBlur.bind(this));
        // this.elements.codeEditor.value = this.text;
        // this.updateValue(this.text);
    },


    sortSiblings(a, b){
      if (a.type == 'plus' || b.type == 'minus') return -1;
      if (a.type == 'minus') return 1;
      return 0;
    },

    updateValue(text){
        // const text = event.target.innerText;
        // console.log(this, text);
        // console.log('input');

        const lines = text.split('\n'), cleanLines = [];
        let differnt_lines_count = false, edited_line_index = 0;

        if (lines.length == this.lines.length) {
          for (let i=0; i < lines.length; i++) {
              if (lines[i] != this.lines[i]) edited_line_index = index;
          }
        }
        else {
          differnt_lines_count = true;
        }

        // for (let i=0; i<Math.max(lines.length, this.lines.length); i++) {

        // }

        let siblings = [];

        // if (this.lines.length != lines.length) {

            let numbers = '';
            let stars = '';
            let count = 1;
            let name;
            let processes_count = 0;
            let process = [];
            let sub_process = [];


            for (let i=0; i<lines.length; i++) {

                numbers += `${count}.<br>`;
                count++;

                if (lines[i].match(this.rgs.empty)) {
                  continue;
                }
                else if (lines[i].match(this.rgs.number)) {
                  name = lines[i].replace(this.rgs.number, '');
                  processes_count++;
                  if (processes_count > 1) {
                    sub_process = [];
                    for (let ss of process) {
                      for (let s of ss) {
                        if (s.text == name) {
                          // console.log(name)
                          s.embeds = sub_process;
                        }
                        // else {
                        //   console.log(s, name)
                        // }
                      }
                    }
                  }
                  // this.elements.diagramHeader.innerText = lines[i].replace(this.rgs.number, '');
                  continue;
                }

                else if (lines[i].match(this.rgs.arrow)) {
                    name = lines[i].replace(this.rgs.arrow, '');
                    siblings.push({type: 'arrow', text:name});
                    // numbers += `<br>`;
                }
                else if (lines[i].match(this.rgs.plus)) {
                    name = lines[i].replace(this.rgs.plus, '');
                    siblings.push({type:'plus', text:name});
                    // numbers += `<br>`;
                }
                else if (lines[i].match(this.rgs.minus)) {
                    name = lines[i].replace(this.rgs.minus, '');
                    siblings.push({type: 'minus', text:name});
                    // numbers += `<br>`;
                }
                else if (lines[i].match(this.rgs.star)) {
                    name = lines[i].replace(this.rgs.star, '');
                    // siblings.push({type:'star', text:name});
                    siblings = [{type: 'star', text:name}];
                    if (processes_count == 1) {
                      process.push(siblings);
                    }
                    else {
                      sub_process.push(siblings);
                    }


                    // numbers += `<br>`;
                }
                // else {
                //     name = lines[i].replace(this.rgs.regular, '');
                //     siblings = [{type: 'regular', text:name}];
                //     arr.push(siblings);

                // }


                cleanLines.push(name);
            }

            for (let siblings of process){
              if (siblings.length > 1) {
                  siblings.sort(this.sortSiblings);

              }
            }




            this.elements.lineNumners.innerHTML = numbers;
            const box = this.elements.lineNumners.getBoundingClientRect();
            this.elements.codeEditor.style.paddingLeft = box.width + 'px';

            this.elements.autocomplete.style.left = box.width + 'px';
            // console.log(process)
            this.objects = process;
        // }
        this.lines = lines;
        this.cleanLines = cleanLines;
        this.updateScroll(this.elements.codeEditor.scrollTop);
        // console.log(this.elements.codeEditor.selectionStart)
        // this.updateAutocomplete();
        // diagram.updateGraph(this.objects);
        // console.log(this.objects)

        diagram.updateGraph(this.objects);

        // const parsed = parser.parseScript(this.text);
        // diagram.updateGraph(parsed);

    },

    updateValue2(text){
      // const text = event.target.innerText;
      // console.log(this, text);
      // console.log('input');

      const parsed = parser.parseProcess(text);
      // console.log(parsed)
      diagram.updateGraph(parsed);

      const numbers = text.split('\n').map((line, index)=>`${index+1}.`).join('<br>');

      this.elements.lineNumners.innerHTML = numbers;
      const box = this.elements.lineNumners.getBoundingClientRect();
      this.elements.codeEditor.style.paddingLeft = box.width + 'px';

      // this.elements.autocomplete.style.left = box.width + 'px';
      // console.log(process)
      // this.objects = process;
      // // }
      // this.lines = lines;
      // this.cleanLines = cleanLines;
      this.updateScroll(this.elements.codeEditor.scrollTop);
      // console.log(this.elements.codeEditor.selectionStart)
      // this.updateAutocomplete();
      // diagram.updateGraph(this.objects);
      // console.log(this.objects)

      // diagram.updateGraph(this.objects);

      // const parsed = parser.parseScript(this.text);
      // diagram.updateGraph(parsed);

  },

    onSelectionChange(start, end){
        // console.log('onSelectionChange', start, end);
        // this.updateAutocomplete();
    },

    onEditorBlur(){
        this.elements.autocomplete.style.display = 'none';
    },

    onEditorKeydown(e){
        let { keyCode } = e;
        let { value, selectionStart, selectionEnd } = this.elements.codeEditor;
        if (keyCode === 9) {  // TAB = 9
            e.preventDefault();
            this.elements.codeEditor.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
            this.elements.codeEditor.setSelectionRange(selectionStart+1, selectionStart+1)
        }
        else if (keyCode === 40) {
            if (this.autocomleteShown) {
                e.preventDefault();
                this.elements.autocomplete.firstChild.focus();
                // this.elements.autocomplete.setSelectionRange(0, 0);
            }
        }
        else if (keyCode === 27) { // ESC
            e.preventDefault();
            this.showAutocomplete(false);
        }

    },
    // onAutocompleteBlur(e){
    //     this.showAutocomplete(false);
    // },
    onAutocompleteKeydown(e){
        if (!this.autocomleteShown) return;
        let { keyCode } = e;

        if (keyCode === 38 || keyCode === 40) {
            e.preventDefault();
            const children = this.elements.autocomplete.children;
            let index = 0;
            for (let i=0; i<children.length; i++) {
                if (children[i] == document.activeElement) {
                    index = i;
                    break;
                }
            }
            if (keyCode === 38) { // up
                index--;
                if (index < 0) index = children.length - 1;
            }
            else if (keyCode === 40) { // down
                index++;
                if (index >= children.length) index = 0;
            }
            children[index].focus();
            // console.log(keyCode, index);
        }
        else if (keyCode === 27) { // ESC
            e.preventDefault();
            this.showAutocomplete(false);
        }
    },

    updateScroll(scroll){
        // console.log(this)
        // console.log(this.elements.lineNumners)
         this.elements.lineNumners.scroll(0, scroll);
    },

    showCodeEditor(show = true){
        if (!show)  this.showAutocomplete(false)
        this.codeEditorShown = show;
        this.elements.openBtn.style.display = show ? 'none' : 'block';
        // this.elements.closeBtn.style.display = show ? 'block' : 'none';
        this.elements.codeEditorContainer.style.display = show ? 'flex' : 'none';
    },

    showAutocomplete(show = true){
        this.autocomleteShown = show;
        if (show) {
            this.elements.autocomplete.style.display = 'block';
            let top = 10 + (this.editingLine + 1) * 19 + 2 - this.elements.codeEditor.scrollTop;
            const codeEdotorRect = this.elements.codeEditor.getBoundingClientRect();
            const autocomplete_rect = this.elements.autocomplete.getBoundingClientRect();
            if (top + autocomplete_rect.height > codeEdotorRect.x + codeEdotorRect.height) {
                top -= 10 + autocomplete_rect.height + 19 + 2;
            }
            this.elements.autocomplete.style.top = top + 'px';
            // this.elements.autocomplete.firstChild.focus();
        }
        else {
            this.elements.autocomplete.style.display = 'none';
            this.elements.autocomplete.innerHTML = '';
            this.elements.codeEditor.focus();
        }
    },

    onAutocompleteClick(event){
        const text = event.target.innerText;
        // console.log(text);
        // console.log(this.lines[this.editingLine], '|', this.cleanLines[this.editingLine], '|',
        //             this.cleanLines[this.editingLine].length, '|', this.lines[this.editingLine].replace(this.cleanLines[this.editingLine], text));

        this.lines[this.editingLine] = this.cleanLines[this.editingLine].length ?
                                        this.lines[this.editingLine].replace(this.cleanLines[this.editingLine], text) :
                                        this.lines[this.editingLine] + text;
        const all = this.lines.join('\n');
        this.elements.codeEditor.value = all;
        this.updateValue2(all);
    },

    updateAutocomplete(event){
        // console.log(this.elements.codeEditor.selectionStart)
        const lines = this.elements.codeEditor.value.substr(0, this.elements.codeEditor.selectionStart).split("\n")
        this.editingLine = lines.length == 0 ? 0 : lines.length - 1;
        const text = this.cleanLines[this.editingLine].toLowerCase().trim();
        const matches = this.types.filter(item => item.text.toLowerCase().indexOf(text) != -1 && item.text.toLowerCase() != text);
        if (matches.length){
            this.elements.autocomplete.innerHTML = matches.map(item => `<button>${item.text}</button>`).join('');
            this.showAutocomplete();
        }
        else {
            this.showAutocomplete(false);
        }

        // console.log(this.cleanLines[this.editingLine]);

    }
}

window.addEventListener('load', async () => {
  window.dm = dm;
  dm.init();
})

