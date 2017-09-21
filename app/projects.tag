<projects>
  <button onClick={this.toggleMode}>Toggle</button>
  <ul>
    <project
      is-view-mode={parent.viewMode}
      each={opts.repos}
      data={this}/>
  </ul>
  <script>
    import './project.tag';

    this.active = '';
    this.viewMode = true;

    this.toggleMode = () => {
      this.viewMode = !this.viewMode;
    }

    this.setActiveProject = function() {
      this.parent.active = this.project.info;
      this.parent.update();
    }
    this.resetActiveProject = function() {
      this.parent.active = '';
      this.parent.update();
    }
  </script>

  <style>
    :scope {
      display: block;
      margin-top: 2em;
    }

    ul {
      margin-top: 4em;
      list-style: none;
    }
  </style>

</projects>