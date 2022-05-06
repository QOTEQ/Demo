/* eslint-disable */

import baseDiagram from './baseDiagram.js';

class flowDiagram extends baseDiagram {
  constructor(id, modules) {
    super(id, modules);

    this.paper.on(
      'group:toggle:button:pointerdown',
      this.groupToggleButtonPointerdownHandler.bind(this)
    );
  }

  //...........UPDATE ELEMENTS AND LINKS

  updateGraph(flow) {
    // console.log(flow)
    this.paper.freeze();
    this.graph.clear();
    let cells = [],
      step,
      main,
      previous,
      node,
      element,
      link,
      pair;

    if (!flow[0] || !flow[0].body || !flow[0].body.length) {
      console.error('flow is empty');
      this.paper.unfreeze();
      return;
    }

    const types = ['success', 'fail', 'finalization'];
    step = flow[0].body[0];
    previous = this.createElement('main', {
      command: step.command,
      embeds: this.findEmbeds(flow, step.command),
    });
    cells.push(previous);

    // console.log(flow[0]);
    for (let i = 0; i < flow[0].body.length; i++) {
      step = flow[0].body[i];
      let nextStep = flow[0].body[i + 1];
      //{command: 'Form "Order"', success: Array(0), fail: Array(0), finalization: Array(0)}

      for (let type of types) {
        for (let command of step[type]) {
          pair = this.createElementAndLink(
            type,
            { command, embeds: this.findEmbeds(flow, command) },
            previous
          );
          cells.push(pair.element);
          if (pair.link) cells.push(pair.link);
        }
        if (type == 'success' && nextStep) {
          pair = this.createElementAndLink(
            'main',
            {
              command: nextStep.command,
              embeds: this.findEmbeds(flow, nextStep.command),
            },
            previous
          );
          main = pair.element;
          cells.push(pair.element);
          if (pair.link) cells.push(pair.link);
        }
      }
      previous = main;
    }
    this.graph.addCells(cells);

    this.directedGraph();
    this.paper.unfreeze();
    this.modules.events.emit('diagram.header.change', flow[0].name);
  }

  findEmbeds(flow, command) {
    for (let i = 1; i < flow.length; i++) {
      if (command == flow[i].name) {
        // console.log(command, flow[i].name)
        return flow[i].body;
      }
    }
    return null;
  }

  createElementsANdLinks() {}

  createElementAndLink(type, node, previous) {
    const element = this.createElement(type, node);
    element.prop(['data', 'embeds'], node.embeds);
    // if (type == 'main') console.log(node)
    const link = previous ? this.createLink(type, previous, element) : null;
    return { element, link };
  }

  createElement(type, node) {
    const colors = {
      main: '#2f76fe',
      success: '#cdcdcd',
      fail: '#e6c456',
      finalization: '#e6c456',
    };
    const width = 150,
      height = 60;
    const text = node.command;

    // console.log(node)

    const wraptext = joint.util.breakText(text, {
      width: width,
      height: height,
    });

    const options = {
      z: 1,
      size: { width, height },
      attrs: {
        body: {
          fill: type == 'finalization' ? '#990004' : '#000000',
          stroke: colors[type],
          strokeWidth: 2,
        },
        label: {
          text: wraptext,
          fill: colors[type],
        },
      },
    };

    if (node.embeds) {
      // console.log(node.embeds);

      options.attrs.toggleButton = {
        refDx: -20,
        // refDx: (- buttonSize * 2 - (headerHeight - buttonSize) / 2) - 5,
        // refY: 0,
        cursor: 'pointer',
        event: 'group:toggle:button:pointerdown',
        title: 'Collapse / Expand',
      };

      options.attrs.toggleButtonBorder = {
        fill: 'transparent',
        stroke: colors[type],
        strokeWidth: 2,
        width: '20',
        height: '20',
        class: 'embeds-button',
      };
      options.attrs.toggleButtonIcon = {
        stroke: colors[type],
        strokeWidth: 2,
        d: 'M 4 10 16 10 M 10 4 10 16', //'M 4 14 16 14'
      };

      options.markup = [
        {
          tagName: 'rect',
          selector: 'body',
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
        {
          tagName: 'text',
          selector: 'label',
        },
      ];
    }

    const element = new joint.shapes.standard.Rectangle(options);
    element.prop('data', node);

    return element;
  }

  createLink(type, source, target) {
    const colors = {
      main: '#2f76fe',
      success: '#00e60a',
      fail: '#ff1a00',
      finalization: '#ff1a00',
    };
    const link = new joint.shapes.standard.Link({
      z: 0,
      source: source,
      target: target,
      attrs: {
        line: {
          stroke: colors[type],
          'stroke-width': 2,
        },
      },
    });
    return link;
  }

  //..........GROUPS

  groupToggleButtonPointerdownHandler(elementView) {
    var element = elementView.model;
    const data = element.prop('data');
    // console.log('groupToggleButtonPointerdownHandler', element.prop('data'));
    const steps = [];

    if (data && data.embeds) {
      this.modules.dialogs.alert(
        '<ol class="flow-diagram-embeds-list">' +
          data.embeds
            .map((e) => `<li>${e.command.replaceAll('`', '')}</li>`)
            .join('') +
          '</ol>',
        { title: data.command, buttons: { ok: true } }
      );
    }

    // this.deselectAllElements();
    // this.paper.freeze();
    // element.toggle();
    // this.fitAncestors(element);
    // this.paper.unfreeze();
  }

  expandEmbeds(element) {
    const embeds = element.prop('data').embeds;
  }

  expandEmbeds2(element) {
    const embeds = element.prop('data').embeds;
  }

  fitAncestors(element) {
    element.getAncestors().forEach((container) => {
      // console.log(container.id)
      if (container.fitChildren && !container.get('collapsed'))
        container.fitChildren();
    });
  }
}

export default flowDiagram;
