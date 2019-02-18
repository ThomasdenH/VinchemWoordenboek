import { MDCTopAppBar } from '@material/top-app-bar/index';

navigator.serviceWorker.register('sw.js');

// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);
