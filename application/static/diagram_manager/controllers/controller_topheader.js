/* eslint-disable */

import css_themes from './../system/css_themes.js';

class controllerTopHeader {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {
      topMenu: document.getElementById('top-menu'),
      cssThemeLink: document.getElementById('css-theme-link'),
      cssThemeSwitcher: document.getElementById('css-theme-switcher'),
    };

    let CodeMirrorTheme =
      this.modules.store.get('CodeMirrorTheme') || 'darcula';
    this.elements.cssThemeSwitcher.innerHTML =
      '<option disabled>Select a theme</option>' +
      css_themes.map((t) => `<option value="${t}">${t}</option>`).join('');
    this.elements.cssThemeSwitcher.value = CodeMirrorTheme;
    this.elements.cssThemeSwitcher.addEventListener(
      'change',
      this.switchCssTheme.bind(this)
    );
    this.elements.cssThemeSwitcher.dispatchEvent(new Event('change'));
  }

  switchCssTheme() {
    const theme = this.elements.cssThemeSwitcher.value;
    this.elements.cssThemeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/theme/${theme}.min.css`;
    this.modules.store.set('CodeMirrorTheme', theme);
    this.modules.events.emit('code-mirror:theme:change', theme);
  }
}

export default controllerTopHeader;
