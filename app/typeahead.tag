<typeahead>
  <span if={!opts.isActive}>
    <yield/>
  </span>
  <input if={opts.isActive} type='text' value={opts.activeSelection} onKeyDown={this.search}/>
  <ul if={opts.isActive}>
    <li
      each={opts.items}
      onClick={parent.opts.onselect}
      class={selected: (parent.opts.activeSelection === name)}>{name}</li>
  </ul>

  <script>
    // import Jets from 'jets';

    // this.on('update', function(){
    //   console.info(this);
    //   this.jets = new Jets({
    //     contentTag: '.one li',
    //     callSearchManually: true
    //   });

    // });

    // this.search = function(keydownEvent) {
    //   this.jets.search(keydownEvent.target.value);
    //   // console.info('setachlkj', this, keydownEvent)
    // }
  </script>

  <style>
    :scope,
    li {
      cursor: pointer;
    }

    .selected,
    li:hover {
      background: blue;
      color: white;
    }

    ul {
      overflow: auto;
      max-height: 200px;
      margin-left: 0;
    }

    input {
      font-family: inherit;
      font-size: .8em;
    }

  </style>

</typeahead>
