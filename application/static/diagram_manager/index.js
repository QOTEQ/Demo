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
    original:'',
    lines:[],
    cleanLines:[],
    objects:[],
    rgs:{empty:/^\s*$/, regular:/^\s+/, number:/^\s*\#\s*/, star:/^\s*\*\s*/, arrow:/^\s*-\s*\>\s*/, plus:/^\s*\+\s*/, minus:/^\s*-\s*/},
    editingLine:0,
    codeEditorShown:true,
    autocomleteShown:false,
    processes:[
      {name:'Order product', url:'Store'}
    ],
    subprocesses:[],
    selectedProcessIndex:0,
    elements:{
        processRunButton: document.getElementById('process-run-button'),
        processSaveButton: document.getElementById('process-save-button'),
        paper:document.getElementById('diagram-paper'),
        diagramHeader:document.getElementById('diagram-header'),
        processesSelect:document.getElementById('processes-select'),
        scale:document.getElementById('diagram-scale')
    },


    async init(){

        this.initControls();

        dialogs.init();


        controllerMain.init(modules);
        controllerDiagram.init(modules);
        controllerTable.init(modules);
        router.init();

        diagram.init(this.elements.paper);
        this.codeEditor = new codeEditor('diagram-code-editor', modules, {});
        events.listen('diagram-code-editor:input:change', this.diagramCodeEditorChanged.bind(this))

        // this.initCodeEditor();

        this.elements.processRunButton.addEventListener('click', this.runProcess.bind(this));
        // this.runProcess();
        // dialogs.alert('Test');
        // console.log(parser.parseScript(this.text));
    },



    async loadData(){
      transport.init();
      this.fetchProcess(this.selectedProcessIndex);
    },

    async runProcess(){
      const name = this.processes[this.selectedProcessIndex].url;
      const fetched = await window.api.bos.startFlow({ name:'Order product\r' });
      // const test = document.getElementById('test_component')
      // dialogs.open(test, {title:'Test title', buttons:[
      //   {text:'Custom', callback:()=>{
      //     this.test();
      //     dialogs.close();
      //   }}]
      // });
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
        this.codeEditor.setValue(this.processes[index].data);
        // this.elements.codeEditor.value = this.processes[index].data;



        // this.updateValue(this.processes[index].data);
        // console.log(this.processes[index].data);
        this.updateValue(this.processes[index].data);
        // this.showCodeEditor(false);

        // console.log(parser.parseScript(this.text));
    },

    updateValue(text){

     console.log(text.length, this.processes[this.selectedProcessIndex].data.length)
     if(text == this.processes[this.selectedProcessIndex].data)  this.elements.processSaveButton.setAttribute('disabled', true);
     else this.elements.processSaveButton.removeAttribute('disabled');


      const parsed = parser.parseProcess(text);
      // console.log(parsed)
      diagram.updateGraph(parsed);


  },


    //.....CODE EDITOR



    diagramCodeEditorChanged(data){
      if(data.isOriginal)  this.elements.processSaveButton.setAttribute('disabled', true);
      else this.elements.processSaveButton.removeAttribute('disabled');
      const parsed = parser.parseProcess(data.text);
      diagram.updateGraph(parsed);
    },

}

window.addEventListener('load', async () => {
  window.dm = dm;
  dm.init();
})

