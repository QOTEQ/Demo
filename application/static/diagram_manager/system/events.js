/* eslint-disable */

const events = {

  emit(name, data){
      document.dispatchEvent(new CustomEvent(name, {detail: data}));
  },

  listen(name, callback){
      document.addEventListener(name, callback);
  },

  remove(name, callback){
      document.removeEventListener(name, callback);
  }
};

export default events;
