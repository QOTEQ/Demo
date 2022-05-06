/* eslint-disable */
import parser from './../utilities/parser.js';
import diagram from './../editors/flowDiagram.js';
import codeEditor from './../editors/flowMarkdownEditor.js';
import form from './../editors/form.js';

class controllerDiagram {




  constructor(id, modules) {

    this.modules = modules;

    const codeEditorContainer = document.getElementById('diagram-code-editor-container');

    this.elements = {
        processRunButton: document.getElementById('process-run-button'),
        processSaveButton: document.getElementById('process-save-button'),
        paper:document.getElementById('diagram-paper'),
        // diagramHeader:document.getElementById('diagram-header'),
        // processesSelect:document.getElementById('processes-select'),
        scale:document.getElementById('diagram-scale'),
        codeEditorContainer,
        codeEditor:codeEditorContainer.querySelector('#diagram-code-editor'),
        codeEditorDivider:codeEditorContainer.querySelector('#diagram-code-editor-divider'),
        closeBtn:codeEditorContainer.querySelector('.code-editor-close-button'),
        openBtn:codeEditorContainer.querySelector('.code-editor-open-button')
          // formComponent:document.getElementById('form_component'),


    };
    this.original = '';
    this.lines =  [];
    this.cleanLines = [];
    this.objects = [];
    this.rgs = {empty:/^\s*$/, regular:/^\s+/, number:/^\s*\#\s*/, star:/^\s*\*\s*/, arrow:/^\s*-\s*\>\s*/, plus:/^\s*\+\s*/, minus:/^\s*-\s*/},
    this.editingLine = 0;
    this.codeEditorShown = true;
    this.autocomleteShown = false;
    this.processes = [
      {name:'Order product', url:'Store'}
    ];
    this.subprocesses = [];
    this.selectedProcessIndex = 0;

    // const processes = this.processes.map(p=>`<option value="${p.url}">${p.name}</option>`).join('');
    // this.elements.processesSelect.innerHTML = processes;
    // this.elements.processesSelect.addEventListener('change', e=>{this.fetchProcess(this.elements.processesSelect.selectedIndex)})
    // modules.events.listen('diagram.header.change', e => this.elements.diagramHeader.innerText = e);
    modules.events.listen('diagram.scale.change', e => this.elements.scale.innerText = e.toFixed(1));

    this.diagram = new diagram('diagram-paper', modules);
    this.form = new form('form_component', modules);

    this.codeEditor = new codeEditor('diagram-code-editor', modules, {});

    this.elements.openBtn.addEventListener('click', ()=>this.showCodeEditor());
    this.elements.closeBtn.addEventListener('click', ()=>this.showCodeEditor(false));

    this.modules.events.listen('diagram-code-editor:input:change', this.diagramCodeEditorChanged.bind(this))

    // this.initCodeEditor();

    this.elements.processRunButton.addEventListener('click', this.startFlow.bind(this));
    this.modules.events.listen('bos:form', this.form.show.bind(this.form));
  }
   loadData(){
      this.fetchProcess(this.selectedProcessIndex);
    }

    async startFlow(){
      const name = this.processes[this.selectedProcessIndex].url;
      const start = await window.api.bos.startFlow({ name: 'Order product\r' });
      console.log(start);;

      // const test = document.getElementById('test_component')
      // dialogs.open(test, {title:'Test title', buttons:[
      //   {text:'Custom', callback:()=>{
      //     this.test();
      //     dialogs.close();
      //   }}]
      // });
    }

    async fetchProcess(index = 0){

      // console.log(this)

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
      // this.elements.diagramHeader.innerHTML = this.processes[index].name;
      this.codeEditor.setValue(this.processes[index].data);
      // this.elements.codeEditor.value = this.processes[index].data;



      // this.updateValue(this.processes[index].data);
      // console.log(this.processes[index].data);
      this.updateValue(this.processes[index].data);
      // this.showCodeEditor(false);

      // console.log(parser.parseScript(this.text));
  }

  updateValue(text){

    console.log(text.length, this.processes[this.selectedProcessIndex].data.length)
    if(text == this.processes[this.selectedProcessIndex].data)  this.elements.processSaveButton.setAttribute('disabled', true);
    else this.elements.processSaveButton.removeAttribute('disabled');


      const parsed = parser.parseProcess(text);
      // console.log(parsed)
      this.diagram.updateGraph(parsed);


  }

  //.....CODE EDITOR

  showCodeEditor(show = true){
      // if (!show)  this.showAutocomplete(false)
      this.codeEditorShown = show;
      this.elements.openBtn.style.display = show ? 'none' : 'block';
      this.elements.closeBtn.style.display = show ? 'block' : 'none';
      // this.elements.closeBtn.style.display = show ? 'block' : 'none';
      this.elements.codeEditor.style.display = show ? 'flex' : 'none';
       this.elements.codeEditorContainer.style.width = show ? '' : '0';
       this.elements.codeEditorDivider.style.width = show ? '' : '0';
  }


  diagramCodeEditorChanged(data){
    if(data.isOriginal)  this.elements.processSaveButton.setAttribute('disabled', true);
    else this.elements.processSaveButton.removeAttribute('disabled');
    const parsed = parser.parseProcess(data.text);
    this.diagram.updateGraph(parsed);
  }

}

export default controllerDiagram;
