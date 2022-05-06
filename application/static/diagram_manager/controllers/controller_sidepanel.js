/* eslint-disable */

class controllerSidepanel {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {};

    const treedata = {
      core: {
        themes: { name: 'default-dark' },
        data: [
          {
            id: 'server',
            text: 'Server',
            icon: '/diagram_manager/img/folder_type_server.svg',
            state: {
              opened: true,
              selected: false,
            },
            children: [
              {
                id: 'database',
                text: 'Database',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'postgres.pgsql',
                    text: 'Postgres Data',
                    icon: '/diagram_manager/img/file_type_pgsql.svg',
                    li_attr: { title: 'Postgres Data' },
                    a_attr: {},
                  },
                ],
              },

              {
                id: 'sql',
                text: 'SQL',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.sql',
                    text: 'Test Sql',
                    icon: '/diagram_manager/img/file_type_sql.svg',
                    li_attr: { title: 'Test Sql' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'flow',
                text: 'Flow',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'order_product.flow',
                    text: 'Order Product Flow',
                    icon: '/diagram_manager/img/file_type_puppet.svg',
                    li_attr: { title: 'Order Product Flow' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'server-js',
                text: 'JS',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.js',
                    text: 'Test Js',
                    icon: '/diagram_manager/img/file_type_js.svg',
                    li_attr: { title: 'Test Js' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'json',
                text: 'JSON',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.json',
                    text: 'Test JSON',
                    icon: '/diagram_manager/img/file_type_json.svg',
                    li_attr: { title: 'Test JSON' },
                    a_attr: {},
                  },
                ],
              },
            ],
          },

          {
            id: 'client',
            text: 'Client',
            icon: '/diagram_manager/img/folder_type_client.svg',
            state: {
              opened: true,
              selected: false,
            },
            children: [
              {
                id: 'vendors',
                text: 'Vendors',
              },
              {
                id: 'css',
                text: 'CSS',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.css',
                    text: 'Test Css',
                    icon: '/diagram_manager/img/file_type_css.svg',
                    li_attr: { title: 'Test Css' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'client-js',
                text: 'JS',
              },
              {
                id: 'html',
                text: 'HTML',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.html',
                    text: 'Test Html',
                    icon: '/diagram_manager/img/file_type_html.svg',
                    li_attr: { title: 'Test.html' },
                    a_attr: {},
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    // console.log($)
    $(function () {
      $('#jstree').jstree(treedata);
    });
    $('#jstree').on('changed.jstree', this.selectTreeItem.bind(this));
  }

  selectTreeItem(e, data) {
    if (data.action != 'select_node') return;
    const id = data.selected[0],
      parent = data.node.parent,
      parents = data.node.parents,
      ext = id.split('.').pop();
    // console.log(data, ext);
    const views = {
      main: 'Main',
      js: 'Javascript',
      md: 'Markdown',
      sql: 'Sql',
      css: 'Css',
      html: 'Html',
      json: 'Json',
      flow: 'Diagram',
      pgsql: 'Table',
    };

    if (views[ext]) this.modules.router.goto(views[ext]);
    else this.modules.router.goto('Main');
  }
}

export default controllerSidepanel;
