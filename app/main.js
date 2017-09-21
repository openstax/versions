import riot from 'riot';
import 'riot-hot-reload';
import './app.tag';

import css from 'milligram';
import customCSS from './main.css';

import { repos } from './settings';

riot.mount('app', {
  repos : repos.map((repo) => {
    return {
      setting: repo
    };
  })
});
