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
        scale:document.getElementById('diagram-scale'),
        formComponent:document.getElementById('form_component'),
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
        this.elements.formComponent.addEventListener('submit', (e)=>{e.preventDefault();});
        // this.testForm();
        // this.runProcess();
        // dialogs.alert('Test');
        // console.log(parser.parseScript(this.text));
    },



    async loadData(){
      transport.init();
      events.listen('form', this.showForm.bind(this));
      // events.listen('step', (step)=>{console.log('step',step)});
      this.fetchProcess(this.selectedProcessIndex);
    },

    testForm(){
      const step = {

        "step": {
            "command": "Form `Order`",
            "success": [],
            "fail": [],
            "finalization": []
        },
        "form": {
            "product": [
                {
                    "productId": "2",
                    "name": "Huawei D16 Laptop",
                    "description": "AMD Ryzon 5, 16gb RAM, SSD 500gb",
                    "amount": 10,
                    "price": 30000,
                    "weight": 2
                },
                {
                    "productId": "3",
                    "name": "Vitelotte potatoes",
                    "description": "Violet-blue, nutty flavour, chestnuts smell",
                    "amount": 100,
                    "price": 75,
                    "weight": 1
                },
                {
                    "productId": "4",
                    "name": "Gesture chair",
                    "description": "Inspired by the movement of the human body",
                    "amount": 25,
                    "price": 17000,
                    "weight": 20
                },
                {
                    "productId": "1",
                    "name": "Motorola Edge 20 Pro",
                    "description": "Dual-Sim 256gb, 12gb RAM, 5G",
                    "amount": 42,
                    "price": 20000,
                    "weight": 0
                }
            ],
            "carrier": [
                {
                    "carrierId": "1",
                    "name": "Postal service"
                },
                {
                    "carrierId": "2",
                    "name": "Courier service"
                },
                {
                    "carrierId": "3",
                    "name": "Pickup from store"
                }
            ],
            "amount": {
                "type": "number",
                "required": true
            }
            }

      };
      this.showForm(step);
    },

    formName:'',

    form:{

    },

    showForm(step){
        // console.log(step);
        this.elements.formComponent.innerHTML = '';
        this.formName = step.step.command;
        this.form = {};
        // const inputs = [];
        for (let id in step.form) {
            let desc= step.form[id], element, input;
            const label = document.createElement('label');
            label.textContent = id;
            label.setAttribute('for', id);
            this.elements.formComponent.appendChild(label);

            this.form[id] = '';

            if (Array.isArray(desc)){

                const keys = Object.keys(desc[0]), value = keys[0], name = keys[1];
                input = document.createElement('select');
                for (let opt of desc){
                    const option = document.createElement('option');
                    option.value = opt[value];
                    option.innerText = opt[name];
                    input.appendChild(option);
                }
                this.form[id] = desc[0][value];
            }
            else if (desc.type == 'number'){
                input = document.createElement('input');
                input.type = 'number';
                input.required = desc.required;

            }
            else {
              element = document.createElement('input');
            }
            input.id = id;
            this.elements.formComponent.appendChild(input);
        }

        dialogs.open(this.elements.formComponent, {title:step.step.command, close:false, buttons:[{text:'Submit', callback:this.submitForm.bind(this)}]});

    },

    submitForm(){
      this.elements.formComponent.requestSubmit();
      const valid = this.elements.formComponent.checkValidity();
      if (!valid) return;
      for (let id in this.form){
        this.form[id] = this.elements.formComponent.querySelector('#'+id).value;
      }
      console.log(this.form)
      transport.send('formSubmit', {name:this.formName, data:this.form});
      dialogs.close();
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

