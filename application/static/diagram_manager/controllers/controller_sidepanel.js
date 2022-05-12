/* eslint-disable */

class controllerSidepanel {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {};

    const treedata = {
      core: {
        themes: { name: 'default-dark' },
        check_callback: (operation, node, node_parent, node_position, more) => {
          // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node', 'copy_node' or 'edit'
          // in case of 'rename_node' node_position is filled with the new node name
          console.log(operation, node, node_parent, node_position, more);
          return operation === 'rename_node' ? true : false;
        },
        data: [
          {
            id: 'server',
            text: 'Server',
            type: 'server',
            // icon: '/diagram_manager/img/folder_type_server.svg',
            state: {
              opened: true,
              selected: false,
            },
            children: [
              {
                id: 'database',
                type: 'folder',
                text: 'Database',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'postgres.pgsql',
                    type: 'pgsql',
                    text: 'Postgres Data',
                    // icon: '/diagram_manager/img/file_type_pgsql.svg',
                    li_attr: { title: 'Postgres Data' },
                    a_attr: {},
                  },
                ],
              },

              {
                id: 'sql',
                type: 'folder',
                text: 'SQL',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.sql',
                    type: 'sql',
                    text: 'Test Sql',
                    // icon: '/diagram_manager/img/file_type_sql.svg',
                    li_attr: { title: 'Test Sql' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'flow',
                type: 'folder',
                text: 'Flow',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'order_product.flow',
                    type: 'flow',
                    text: 'Order Product Flow',
                    // icon: '/diagram_manager/img/file_type_puppet.svg',
                    li_attr: { title: 'Order Product Flow' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'server-js',
                type: 'folder',
                text: 'JS',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.js',
                    type: 'js',
                    text: 'Test Js',
                    // icon: '/diagram_manager/img/file_type_js.svg',
                    li_attr: { title: 'Test Js' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'json',
                type: 'folder',
                text: 'JSON',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.json',
                    type: 'json',
                    text: 'Test JSON',
                    // icon: '/diagram_manager/img/file_type_json.svg',
                    li_attr: { title: 'Test JSON' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'md',
                type: 'folder',
                text: 'MD',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.md',
                    type: 'md',
                    text: 'Test MD',
                    // icon: '/diagram_manager/img/file_type_json.svg',
                    li_attr: { title: 'Test MD' },
                    a_attr: {},
                  },
                ],
              },
            ],
          },

          {
            id: 'client',
            type: 'client',
            text: 'Client',
            // icon: '/diagram_manager/img/folder_type_client.svg',
            state: {
              opened: true,
              selected: false,
            },
            children: [
              {
                id: 'vendors',
                type: 'folder',
                text: 'Vendors',
              },
              {
                id: 'css',
                type: 'folder',
                text: 'CSS',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.css',
                    type: 'css',
                    text: 'Test Css',
                    // icon: '/diagram_manager/img/file_type_css.svg',
                    li_attr: { title: 'Test Css' },
                    a_attr: {},
                  },
                ],
              },
              {
                id: 'client-js',
                type: 'folder',
                text: 'JS',
              },
              {
                id: 'html',
                type: 'folder',
                text: 'HTML',
                state: {
                  opened: true,
                  selected: false,
                },
                children: [
                  {
                    id: 'test.html',
                    type: 'html',
                    text: 'Test Html',
                    // icon: '/diagram_manager/img/file_type_html.svg',
                    li_attr: { title: 'Test.html' },
                    a_attr: {},
                  },
                ],
              },
            ],
          },
        ],
      },
      types: {
        server: {
          icon: '/diagram_manager/img/folder_type_server.svg',
        },
        client: {
          icon: '/diagram_manager/img/folder_type_client.svg',
        },
        folder: {
          icon: false,
        },
        flow: {
          icon: '/diagram_manager/img/file_type_puppet.svg',
        },
        md: {
          icon: '/diagram_manager/img/file_type_markdown.svg', //"fab fa-markdown"
        },
        sql: {
          icon: '/diagram_manager/img/file_type_sql.svg',
        },
        pgsql: {
          icon: '/diagram_manager/img/file_type_pgsql.svg',
        },
        js: {
          icon: '/diagram_manager/img/file_type_js.svg',
        },
        json: {
          icon: '/diagram_manager/img/file_type_json.svg',
        },
        html: {
          icon: '/diagram_manager/img/file_type_html.svg',
        },
        css: {
          icon: '/diagram_manager/img/file_type_css.svg',
        },
      },
      plugins: [
        'changed',
        'types',
        'unique',
        'dnd',
        'contextmenu',
        'state',
        'search',
      ], //, "sort" "wholerow",
    };

    // console.log($)
    $(function () {
      $('#jstree').jstree(treedata);
      let to = false;
      $('#jstree_search').keyup(function () {
        if (to) {
          clearTimeout(to);
        }
        to = setTimeout(function () {
          const v = $('#jstree_search').val();
          $('#jstree').jstree(true).search(v);
        }, 250);
      });
    });
    $('#jstree').on('changed.jstree', this.selectTreeItem.bind(this));
  }

  selectTreeItem(e, data) {
    if (data.action != 'select_node') return;
    const id = data.selected[0],
      parent = data.node.parent,
      parents = data.node.parents;

    //  console.log(data);
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

    if (views[data.node.type]) this.modules.router.goto(views[data.node.type]);
    else this.modules.router.goto('Main');
  }
}

export default controllerSidepanel;
