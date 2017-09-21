import { observable, computed, action, reaction } from 'mobx';
import _, { extend, pick, map, property, forEach } from 'lodash';

import lunr from 'lunr';

const OctoKat = require('octokat');

// octokat client-side gets a bit confused without this.
window.OctoKat = OctoKat;
window.OctoKat.Fetch = window.fetch.bind(window);
window._ = _


const octo = new OctoKat({token: 'c64a47afdafd2319fd78e98f36581540f6650282'});

class Project {
  static separators = {
    commit: ' @ ',
    project: '/'
  }

  static docConverters = {
    branch: {
      sha:          property('commit.sha'),
      apiUrl:       property('commit.url'),
      commitApiUrl: property('commit.url'),
      name:         property('name')
    },
    commit: {
      sha:          property('sha'),
      apiUrl:       property('url'),
      commitApiUrl: property('url'),
      url:          property('htmlUrl'),
      commitUrl:    property('htmlUrl'),
      name:         property('commit.message')
    },
    pull: {
      sha:    property('head.sha'),
      apiUrl: property('url'),
      url:    property('htmlUrl'),
      name:   property('title'),
      body:   property('body'),
      number: property('number')
    },
    tag: {
      sha:            property('object.sha'),
      apiUrl:         property('url'),
      commitApiUrl:   property('object.url'),
      name:           function(item) {
        return item.ref.replace('refs/tags/', '');
      }
    }
  }

  @observable info = '';
  @observable commits = [];
  @observable branches = [];
  @observable pulls = [];
  @observable tags = [];
  @observable commit = {
    commit: {
      message: ''
    }
  };

  constructor(info) {
    this.info = info;

    this.loadBranches()
      .then(this.loadCommits.bind(this))
      .then(this.loadCommmitFromBranch.bind(this))
      .then(this.loadPulls.bind(this))
      .then(this.loadTags.bind(this));

    reaction(
      () => this.branch,
      (branch) => {
        this.loadCommmitFromBranch();
        return;
      }
    );

    reaction(
      () => this.docs,
      (docs) => {

        this.index = lunr(function() {
          this.ref('id');
          this.field('name');
          this.field('body');
          this.field('sha');
          this.field('number');

          forEach(docs, (doc) => {
            this.add(doc);
          })

        });
      }
    )

  }

  linkToUi(uiContext, name) {
    uiContext[name] = this.json;
    return reaction(
      () => this.commit,
      (commit) => {
        uiContext.update({
          [name]: this.json
        });
        return;
      }
    );
  }

  @computed get owner() {
    return this.info.split(Project.separators.project)[0];
  }

  @computed get repo() {
    return this.info.split(Project.separators.project)[1].split(Project.separators.commit)[0];
  }

  @computed get branch() {
    return this.info.split(Project.separators.commit)[1];
  }

  @computed get data() {
    return `${this.owner}${Project.separators.project}${this.repo}${Project.separators.commit}${this.commit.sha? this.commit.sha : 'fetching sha...'}`
  }

  @computed get messages() {
    return this.commits.map((commit) => {
      return {
        name: commit.commit.message,
        commit: commit
      };
    });
  }

  @computed get api() {
    return octo.repos(this.owner, this.repo);
  }

  @computed get json() {
    return pick(this, ['owner', 'repo', 'branch', 'commit', 'data', 'info', 'commits', 'branches', 'messages']);
  }

  getAsDocs(listName, getters, type) {
    return map(this[listName], (item) => {
      let doc = {};

      forEach(getters, function (getter, key) {
        doc[key] = getter(item);
      });

      doc.type = type;
      doc.id = `${type}${Project.separators.commit}${doc.sha}`;
      doc.info = `${this.owner}${Project.separators.project}${this.repo}${Project.separators.commit}${doc.sha}`;

      return doc;
    })
  }

  @computed get branchDocs() {
    return this.getAsDocs('branches', Project.docConverters.branch, 'branch');
  }

  @computed get commitDocs() {
    return this.getAsDocs('commits', Project.docConverters.commit, 'commit');
  }

  @computed get pullDocs() {
    return this.getAsDocs('pulls', Project.docConverters.pull, 'pull');
  }

  @computed get tagDocs() {
    return this.getAsDocs('tags', Project.docConverters.tag, 'tag');
  }

  @computed get docs() {
    return this.branchDocs
      .concat(this.commitDocs)
      .concat(this.pullDocs)
      .concat(this.tagDocs);
  }

  @action setBranch(branch) {
    this.info = `${this.owner}/${this.repo} @ ${branch}`;
  }

  @action setCommit(commit) {
    this.commit = commit;
  }

  @action loadCommmitFromBranch() {
    return this.api.branches(this.branch).fetch().then((response) => {
      this.commit = response.commit;
    });
  }

  @action loadBranches() {
    return this.api.branches.fetchAll().then((response) => {
      this.branches = response;
    });
  }

  @action loadPulls() {
    return this.api.pulls.fetchAll().then((response) => {
      this.pulls = response;
    });
  }

  @action loadCommits() {
    return this.api.commits.fetch().then((response) => {
      this.commits = response.items;
    });
  }

  @action loadTags() {
    return this.api.git.refs.tags.fetchAll().then((response) => {
      this.tags = response;
    });
  }

  @action resetCommit() {
    this.commit = this.commits[0];
  }
}

export default Project;
