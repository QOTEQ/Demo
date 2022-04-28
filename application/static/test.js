import { Metacom } from './metacom.js';

class Application {
  constructor() {
    const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
    this.metacom = Metacom.create(`${protocol}://${location.host}/api`);
  }
}

window.addEventListener('load', async () => {
  window.application = new Application();
  window.api = window.application.metacom.api;
  await application.metacom.load('auth', 'bos', 'store');
  const token = localStorage.getItem('metarhia.session.token');
  let logged = false;
  if (token) {
    const res = await api.auth.restore({ token });
    logged = res.status === 'logged';
  }
  if (!logged) {
    const res = await api.auth.signin({ login: 'marcus', password: 'marcus' });
    if (res.token) {
      localStorage.setItem('metarhia.session.token', res.token);
    }

    api.bos.on('form', ({ step }) => {
      console.log(JSON.stringify(step));
      let data = {};
      if (step.command === 'Form `Order`') {
        data = {
          product: 'Motorola Edge 20 Pro',
          carrier: 'Postal service',
          amount: 2,
        };
      }
      if (step.command === 'Form `Payment`') {
        data = {
          amount: 20000,
        };
      }
      api.bos.formSubmit({ name: step.command, data });
    });

    api.bos.on('error', (error) => {
      console.log(error);
    });

    api.bos.on('step', (step) => {
      console.log(JSON.stringify(step));
    });

    api.bos.on('notify', (notify) => {
      console.log(JSON.stringify(notify));
    });

    api.bos.on('invoke', (invoke) => {
      console.log(JSON.stringify(invoke));
    });

    await api.bos.startFlow({ name: 'Order product' });
  }
  await window.dm.loadData();
});
