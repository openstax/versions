<project>
  <li class='project'>
    <p class='project--selected'>
      <span class='project--selected-info'>
        {this.project.owner}/{this.project.repo} @
        <typeahead
          class='project--selected-commit'
          items={this.project.messages}
          active-selection={this.project.commit.commit.message}
          is-active={(parent.active === this.project.info)}
          onSelect={this.selectCommit}
        >{parent.project.commit.sha}</typeahead>
      </span>

      <typeahead
        if={opts.isViewMode}
        class='project--selected-branch'
        items={this.project.branches}
        active-selection={this.project.branch}
        is-active={(parent.active === this.project.info)}
        onSelect={this.selectBranch}
        onClick={parent.setActiveProject}
      >{parent.project.branch}</typeahead>
    </p>

    <p class='project--message' if={opts.isViewMode}>
      <i>{this.project.commit.commit.message}</i>
      <a href={this.project.commit.htmlUrl} target='_blank'>View</a>
    </p>

  </li>
  <script>
    import './typeahead.tag';

    import Project from './project';

    const projectModel = new Project(opts.data.setting);

    projectModel.linkToUi(this, 'project');

    window.projects = window.projects || [];
    projects.push(projectModel);

    this.selectBranch = function() {
      projectModel.setBranch(this.name);
      this.parent.parent.parent.resetActiveProject.call(this.parent.parent);
    }
    this.selectCommit = function() {
      projectModel.setCommit(this.commit);
      this.parent.parent.parent.resetActiveProject.call(this.parent.parent);
    }

  </script>

  <style>
    :scope {
      padding: 0.5em 0 2em 0;
      display: block;
    }

    .project--selected,
    .project--message {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .project--selected {
      font-family: 'Cutive Mono', monospace;
      border-bottom: 1px dotted blue;
    }

    .project--selected-info {
      font-size: 1.5em;
    }

    .project--selected-commit {
      color: blue;
    }

    .project--selected-commit ul {
      font-size: .6667em;
    }

    .project--selected-branch {
      flex-shrink: 0;
    }

    .project--selected-branch,
    .project--selected-branch *,
    .project--message,
    .project--message * {
      user-select: none;
    }
  </style>
</project>