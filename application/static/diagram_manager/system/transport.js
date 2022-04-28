/* eslint-disable */

import events from "./events.js";

const transport = {

  endpoint:null,

  init(){
      this.endpoint = window.api ? window.api : null;
      // console.log(window.api)
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
