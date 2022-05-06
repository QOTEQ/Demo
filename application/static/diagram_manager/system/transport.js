/* eslint-disable */

import events from "./events.js";

const transport = {

  endpoint:null,

  init(api){
      this.endpoint = api;
      if (!api || !api.bos || !api.store) return console.error('BOS and store APIs are not available');

      api.bos.on('error', (error) => {
        events.emit('bos:error', error);
      });

      window.api.bos.on('step', (step) => {
        events.emit('bos:step', step);
      });

      window.api.bos.on('notify', (notify) => {
        events.emit('bos:notify', notify);
      });

      window.api.bos.on('invoke', (invoke) => {
        events.emit('bos:notify', invoke);
      });

      window.api.bos.on('form', (step) => {
        events.emit('bos:form', step);
      });

      // window.api.bos.on('step', (step) => {
      //   events.emit('step', step);
      // });
  },

  async send(method, data, store = false){
      if (!this.endpoint) return console.error('no endpoint');
      const type = store ? 'store' : 'bos';
      if (!this.endpoint[type] || !this.endpoint[type][method]) return console.error('no endpoint method', type, method);
      try {
        const res = await this.endpoint[type][method](data);
        return res;
      }
      catch(e){
        console.error(e)
      }
  },

  listen(name, callback){

  },

  remove(name, callback){
      // document.removeEventListener(name, callback);
  }
};

export default transport;
