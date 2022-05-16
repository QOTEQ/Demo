/* eslint-disable */

class controllerSidepanel {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    const sidebar = document.getElementById(id);
    this.elements = {
      sidebar,
      sections: sidebar.querySelector('.side-bar-sections'),
    };
    this.selectedSection = null;

    const data = {
      server: [
        {
          id: 'flows',
          type: 'folder',
          text: 'Flows',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'order_product.flow',
              type: 'flow',
              text: 'order_product.flow',
              li_attr: {
                title: 'order_product.flow',
              },
              a_attr: {},
            },
          ],
        },
        {
          id: 'server-js',
          type: 'folder',
          text: 'RPCs',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'rpc1.js',
              type: 'js',
              text: 'rpc1.js',
              li_attr: {
                title: 'rpc1.js',
              },
              a_attr: {},
            },
          ],
        },
        {
          id: 'json',
          type: 'folder',
          text: 'Config',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'config.json',
              type: 'json',
              text: 'config.json',
              li_attr: {
                title: 'config.json',
              },
              a_attr: {},
            },
          ],
        },
        {
          id: 'content',
          type: 'folder',
          text: 'Content',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'test.md',
              type: 'md',
              text: 'test.md',
              li_attr: {
                title: 'test.md',
              },
              a_attr: {},
            },
          ],
        },
      ],
      client: [
        {
          id: 'public',
          type: 'folder',
          text: 'Public',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'public_js',
              type: 'folder',
              text: 'js',
              li_attr: {
                title: 'js',
              },
              a_attr: {},
              children: [
                {
                  id: 'test.js',
                  type: 'js',
                  text: 'test.js',
                  li_attr: {
                    title: 'test.js',
                  },
                  a_attr: {},
                },
              ],
            },
            {
              id: 'public_css',
              type: 'folder',
              text: 'css',
              li_attr: {
                title: 'css',
              },
              a_attr: {},
              children: [
                {
                  id: 'test.css',
                  type: 'css',
                  text: 'test.css',
                  li_attr: {
                    title: 'test.css',
                  },
                  a_attr: {},
                },
              ],
            },
            {
              id: 'public_images',
              type: 'folder',
              text: 'images',
              li_attr: {
                title: 'images',
              },
              a_attr: {},
              children: [
                {
                  id: 'test.jpg',
                  type: 'image',
                  text: 'test.jpg',
                  li_attr: {
                    title: 'test.jpg',
                  },
                  a_attr: {},
                },
              ],
            },
            {
              id: 'index.html',
              type: 'html',
              text: 'index.html',
              li_attr: {
                title: 'index.html',
              },
              a_attr: {},
            },
          ],
        },

        {
          id: 'components',
          type: 'folder',
          text: 'Components',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'header1.html',
              type: 'html',
              text: 'header1.html',
              li_attr: {
                title: 'header1.html',
              },
              a_attr: {},
            },
            {
              id: 'footer1.html',
              type: 'html',
              text: 'footer1.html',
              li_attr: {
                title: 'footer1.html',
              },
              a_attr: {},
            },
          ],
        },
        {
          id: 'elements',
          type: 'folder',
          text: 'Elements',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'element1.html',
              type: 'html',
              text: 'element1.html',
              li_attr: {
                title: 'element1.html',
              },
              a_attr: {},
            },
          ],
        },

        {
          id: 'router',
          type: 'folder',
          text: 'Router',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'router.js',
              type: 'js',
              text: 'router.js',
              li_attr: {
                title: 'router.js',
              },
              a_attr: {},
            },
          ],
        },

        {
          id: 'store',
          type: 'folder',
          text: 'Store',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'store.js',
              type: 'js',
              text: 'store.js',
              li_attr: {
                title: 'store.js',
              },
              a_attr: {},
            },
          ],
        },
        {
          id: 'views',
          type: 'folder',
          text: 'Views',
          state: {
            opened: true,
            selected: false,
          },
          children: [
            {
              id: 'MainView.html',
              type: 'html',
              text: 'MainView.html',
              li_attr: {
                title: 'MainView.html',
              },
              a_attr: {},
            },
            {
              id: 'FirstView.html',
              type: 'html',
              text: 'FirstView.html',
              li_attr: {
                title: 'FirstView.html',
              },
              a_attr: {},
            },
            {
              id: 'SecondView.html',
              type: 'html',
              text: 'SecondView.html',
              li_attr: {
                title: 'SecondView.html',
              },
              a_attr: {},
            },
          ],
        },
      ],
      database: [],
      external: [],
      files: [],
      mail: [],
      versioning: [],
      debugging: [],
    };

    const sections = [
      {
        text: 'Server',
        icon: 'fas fa-server',
        type: 'server',
      },
      {
        text: 'Client',
        icon: 'fas fa-desktop',
        type: 'client',
      },
      {
        text: 'Database',
        icon: 'fas fa-database',
        type: 'database',
      },
      {
        text: 'External APIs',
        icon: 'fas fa-external-link-alt',
        type: 'external',
      },
      {
        text: 'Files',
        icon: 'far fa-file',
        type: 'files',
      },
      {
        text: 'Mail',
        icon: 'far fa-envelope',
        type: 'mail',
      },
      {
        text: 'Versioning',
        icon: 'fas fa-code-branch',
        type: 'versioning',
      },
      {
        text: 'Debugging',
        icon: 'fas fa-bug',
        type: 'debugging',
      },
    ];

    const treedata = {
      core: {
        themes: {
          name: 'default-dark',
        },
        check_callback: (operation, node, node_parent, node_position, more) => {
          // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node', 'copy_node' or 'edit'
          // in case of 'rename_node' node_position is filled with the new node name
          console.log(operation, node, node_parent, node_position, more);
          return operation === 'rename_node' ? true : false;
        },
        data: [],
      },
      types: {
        server: {
          icon: '/client/img/folder_type_server.svg',
        },
        client: {
          icon: '/client/img/folder_type_client.svg',
        },
        folder: {
          icon: false,
        },
        flow: {
          icon: '/client/img/file_type_puppet.svg',
        },
        md: {
          icon: '/client/img/file_type_markdown.svg', //"fab fa-markdown"
        },
        sql: {
          icon: '/client/img/file_type_sql.svg',
        },
        pgsql: {
          icon: '/client/img/file_type_pgsql.svg',
        },
        js: {
          icon: '/client/img/file_type_js.svg',
        },
        json: {
          icon: '/client/img/file_type_json.svg',
        },
        html: {
          icon: '/client/img/file_type_html.svg',
        },
        css: {
          icon: '/client/img/file_type_css.svg',
        },
        image: {
          icon: '/client/img/file_type_image.svg',
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
      ], //, "sort" ,   "wholerow"
    };

    // console.log($)
    // $(function () {
    for (let section of sections) {
      let div = document.createElement('div');
      div.id = 'side-bar-' + section.type;
      div.setAttribute('data-section', section.type);
      div.className = 'side-bar-section';
      // div.innerHTML = `<h3>${section.type}</h3>`;
      if (data[section.type]) {
        treedata.core.data = data[section.type];
        $(div)
          .jstree(treedata)
          .on('changed.jstree', this.selectTreeItem.bind(this));
      }
      this.elements.sections.appendChild(div);
    }

    let to = false;
    $('#jstree_search').keyup(() => {
      if (to) {
        clearTimeout(to);
      }
      to = setTimeout(
        function () {
          const v = $('#jstree_search').val();
          this.searchSections(v);
          // $(this.selectedSection).jstree(true).search(v);
        }.bind(this),
        250
      );
    });

    this.modules.events.listen(
      'activity-bar-item-selected',
      this.selectSection.bind(this)
    );
    this.selectSection('server');
  }

  initSections() {}

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

  searchSections(str) {
    this.elements.sections
      .querySelectorAll('.side-bar-section')
      .forEach((section) => {
        $(section).jstree(true).search(str);
      });
  }

  selectSection(type) {
    // console.log(type);
    this.elements.sections
      .querySelectorAll('.side-bar-section')
      .forEach((section) => {
        if (section.getAttribute('data-section') == type) {
          this.selectedSection = section;
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
  }
}

export default controllerSidepanel;
