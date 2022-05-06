const joint = require('jointjs');

import dut from './DiagramUtilities';

const headerHeight = 44;
const buttonSize = 20;

const descriptions = {
  instance: {
    z: 0,
    // size: { width: 250, height: 120 },
    attrs: {
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#ffffff',
        stroke: 'transparent',
        // strokeWidth: 0
      },
      header: {
        className: 'card-header',
        refWidth: '100%',
        height: 44,
        fill: 'rgb(124, 77, 255)', //'#7ACC90',
        rx: 10,
        ry: 10,
      },
      icon: {
        x: 15,
        y: 10,
        width: 20,
        height: 20,
        fill: '#ffffff',
        xlinkHref: '/img/diagrams/lock.svg',
      },
      headerText: {
        // ref: 'header',
        x: 44,
        y: 22,
        fontSize: 16,
        fill: '#ffffff',
        refWidth: '100%',
        height: 40,
        textAnchor: 'start',
        textVerticalAnchor: 'middle',
        'xml-space': 'preserve',
      },

      toggleButton: {
        refDx: -buttonSize - (headerHeight - buttonSize) / 2,
        // refDx: (- buttonSize * 2 - (headerHeight - buttonSize) / 2) - 5,
        refY: (headerHeight - buttonSize) / 2,
        cursor: 'pointer',
        event: 'group:toggle:button:pointerdown',
        title: 'Collapse / Expand',
      },
      toggleButtonBorder: {
        width: buttonSize,
        height: buttonSize,
        fill: '#000000',
        fillOpacity: 0.2,
        stroke: '#FFFFFF',
        strokeWidth: 0.5,
        rx: 2,
        ry: 2,
      },
      toggleButtonIcon: {
        fill: 'none',
        stroke: '#FFFFFF',
        strokeWidth: 1,
      },
      // deleteButton: {
      //     refDx: - buttonSize - (headerHeight - buttonSize) / 2,
      //     refY: (headerHeight - buttonSize) / 2,
      //     cursor: 'pointer',
      //     event: 'group:delete:button:pointerdown',
      //     title: 'Delete'
      // },
      // deleteButtonBorder: {
      //     width: buttonSize,
      //     height: buttonSize,
      //     fill: '#000000',
      //     fillOpacity: 0.2,
      //     stroke: '#FFFFFF',
      //     strokeWidth: 0.5,
      //     rx:2,
      //     ry: 2
      // },
      // deleteButtonIcon: {
      //     fill: 'none',
      //     stroke: '#FFFFFF',
      //     strokeWidth: 1,
      //     d: 'M 6 6 14 14 M 6 14 14 6'
      // },
      // text:{
      //     // ref: 'header',
      //     x: 'calc(0.5*w)',
      //     y: 'calc(0.5*h + 10)',
      //     fontSize: 16,
      //      fill:'#78909C',
      //     // refWidth: '100%',
      //      width:'calc(w)',
      //      height: 40,
      //      textAnchor: 'middle',
      //     textVerticalAnchor: 'middle',
      //     'xml-space': 'preserve',
      //     text:   ``
      // },
    },
  },
  class: {
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'rect',
        selector: 'header',
      },
      {
        tagName: 'image',
        selector: 'icon',
        className: 'element-icon',
      },
      {
        tagName: 'text',
        selector: 'headerText',
        // textContent: 'Rectangle with header'
      },
      {
        tagName: 'g',
        selector: 'toggleButton',
        children: [
          {
            tagName: 'rect',
            selector: 'toggleButtonBorder',
          },
          {
            tagName: 'path',
            selector: 'toggleButtonIcon',
          },
        ],
      },
      // {
      //     tagName: 'g',
      //     selector: 'deleteButton',
      //     children: [{
      //         tagName: 'rect',
      //         selector: 'deleteButtonBorder'
      //     }, {
      //         tagName: 'path',
      //         selector: 'deleteButtonIcon'
      //     }]
      // },
      // {
      //     tagName: 'text',
      //     selector: 'text',
      //     // textContent: 'Rectangle with header'
      // },
    ],

    lastPosition: null,
    children: [],
    links: {},

    toggle: function (shouldCollapse) {
      // console.log('toggle');
      // console.error('shouldCollapse', shouldCollapse);
      var buttonD;
      var collapsed =
        shouldCollapse === undefined ? !this.get('collapsed') : shouldCollapse;

      if (collapsed) {
        this.toggleEmbeddedLinks(collapsed);
        this.toggleEmbeddedCells(collapsed);

        // buttonD = 'M 2 7 12 7 M 7 2 7 12';
        buttonD = 'M 4 10 16 10 M 10 4 10 16';

        // console.log(this.links)
      } else {
        this.toggleEmbeddedCells(collapsed);
        this.toggleEmbeddedLinks(collapsed);

        buttonD = 'M 4 14 16 14';
      }
      this.toggleSize(collapsed);
      this.attr(['toggleButtonIcon', 'd'], buttonD);
      this.set('collapsed', collapsed);
    },

    toggleSize: function (collapsed) {
      let width = 200;
      const el = document.querySelector('[model-id="' + this.id + '"]');
      if (el) {
        const icon = el.querySelector('[joint-selector="icon"]');
        const header = el.querySelector('[joint-selector="headerText"]');
        const button = el.querySelector('[joint-selector="toggleButton"]');
        if (header) {
          const tspan = header.firstChild;

          // width = Math.round(icon.getBoundingClientRect().width + tspan.getBoundingClientRect().width + button.getBoundingClientRect().width);
          width = Math.round(
            44 +
              tspan.getBoundingClientRect().width +
              10 +
              buttonSize +
              (headerHeight - buttonSize) / 2
          );
          // console.log(tspan.getBoundingClientRect().width)
          // header.setAttribute('text-anchor', collapsed ? 'end' : 'start');
        }
      }
      if (collapsed) {
        this.resize(width, 44);
      } else {
        if (this.getEmbeddedCells().length) {
          this.fitChildren();
          const size = this.prop('size');
          if (size.width < width) {
            this.resize(width, size.height);
          }
        } else {
          this.resize(width, 100);
        }
      }
    },
    toggleEmbeddedLinks: function (collapsed) {
      if (!this.graph) return;
      if (collapsed) {
        this.links = {};
        let inbound = this.graph.getConnectedLinks(this, {
          inbound: true,
          deep: true,
        });
        let outbound = this.graph.getConnectedLinks(this, {
          outbound: true,
          deep: true,
        });
        for (let l of inbound) {
          // if (l.prop('parent') == this.prop('id')) continue;
          this.links[l.id] = {
            source: l.prop('source'),
            target: l.prop('target'),
          };
          l.prop('target', { id: this.prop('id') });
        }

        for (let l of outbound) {
          // if (l.prop('parent') == this.prop('id')) continue;
          this.links[l.id] = {
            source: l.prop('source'),
            target: l.prop('target'),
          };
          l.prop('source', { id: this.prop('id') });
        }
      } else {
        let links = this.graph.getConnectedLinks(this);
        // console.log(Object.keys(this.links).length)
        for (let link of links) {
          if (!this.links[link.id]) continue;
          link.prop('source', this.links[link.id].source);
          link.prop('target', this.links[link.id].target);
        }
        this.links = {};
      }
    },
    toggleEmbeddedCells: function (collapsed) {
      if (!this.graph) return;
      if (collapsed) {
        this.lastPosition = this.prop('position');
        // console.log(this.lastPosition);
        this.children = this.getEmbeddedCells();
        for (let c of this.children) {
          if (c.toggle) c.toggle(collapsed);
        }
        this.graph.removeCells(this.children);
      } else {
        // console.log(this.children.length);
        let offset = null;
        if (this.lastPosition) {
          const pos = this.prop('position');
          if (pos.x != this.lastPosition.x || pos.y != this.lastPosition.y) {
            offset = {
              x: pos.x - this.lastPosition.x,
              y: pos.y - this.lastPosition.y,
            };
            // this.lastPosition = pos;
          }
        }

        this.graph.addCells(this.children);
        for (let cell of this.children) {
          if (offset) {
            let pos = cell.prop('position');
            // console.log(offset, pos)
            if (pos)
              cell.prop('position', {
                x: pos.x + offset.x,
                y: pos.y + offset.y,
              });
          }
          this.embed(cell);
        }
        this.children = [];
      }
    },
    isCollapsed: function () {
      return Boolean(this.get('collapsed'));
    },

    fitChildren: function () {
      var padding = 20;
      // console.log(this.id, this.getEmbeddedCells().length)
      this.fitEmbeds({
        padding: {
          top: headerHeight + padding,
          left: padding,
          right: padding,
          bottom: padding,
        },
      });
    },
  },
  static: {},
};

if (!joint.shapes.html) joint.shapes.html = {};
if (!joint.shapes.html.GroupWithHeader) {
  joint.shapes.html.GroupWithHeader = joint.dia.Element.define(
    'html.GroupWithHeader',
    descriptions.instance,
    descriptions.class,
    descriptions.static
  );
}
const element = new joint.shapes.html.GroupWithHeader();

const GroupWithHeader = {
  newElement(config) {
    // console.log(config.size);

    const cell = element.clone(); //{deep:true}
    //  cell.prop('component_id', component_id);
    if (config.id) cell.prop('id', config.id);
    if (config.s_type) cell.prop('s_type', config.s_type);

    this.updateCell(config, cell);

    if (config.ports) {
      if (config.ports.groups)
        cell.prop(['ports', 'groups'], config.ports.groups);
      if (config.ports.items) {
        // console.log(config.ports.items)
        cell.prop(['ports', 'items'], config.ports.items);
        let ports = { in: 0, out: 0 };
        for (let item of config.ports.items) {
          ports[item.group]++;
        }
        let max = Math.max(ports.in, ports.out);
        if (max > 3) cell.prop(['size', 'height'], max * 40);
      }
    }
    return cell;
  },

  updateCell(config, cell) {
    if (config.icon)
      cell.attr(
        ['icon', 'xlinkHref'],
        config.icon.includes('/') ? config.icon : '/img/diagrams/' + config.icon
      );
    if (config.header) {
      if (config.header.text)
        cell.attr(['headerText', 'text'], config.header.text);
      if (config.header.fill) cell.attr(['header', 'fill'], config.header.fill);
    }
    if (config.body) {
      for (let id in config.body) cell.attr(['body', id], config.body[id]);
    }
    if (config.text) cell.attr(['text', 'text'], config.text);
    if (config.size) cell.prop('size', config.size);
  },
};

export default GroupWithHeader;
