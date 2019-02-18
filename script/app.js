import { MDCTopAppBar } from '@material/top-app-bar/index';
import { MDCList } from '@material/list/index';
import { MDCRipple } from '@material/ripple/index';
import content from './content';
import {MDCSnackbar} from '@material/snackbar';

navigator.serviceWorker.register('sw.js');

// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const list = document.querySelector('.mdc-list');
content.words.sort((a, b) => a.woord.localeCompare(b.woord));

for (const word of content.words) {
    const span = document.createElement('span');
    span.innerHTML = word.woord;
    span.className = 'mdc-list-item__text';

    const li = document.createElement('li');
    li.className = 'mdc-list-item';
    li.appendChild(span);
    li.addEventListener('click', () => {
        const newurl = window.location.origin + window.location.pathname + `?woord=${encodeURIComponent(word.woord)}`;
        window.history.pushState({ path: newurl }, '', newurl);
        showWord(word);
    });

    list.appendChild(li);
}

const mdcList = new MDCList(list);
const listItemRipples = mdcList.listElements.map((listItemEl) => new MDCRipple(listItemEl));

// Show a word if it was specified
const params = new URLSearchParams(document.location.search.substring(1));
const currentWord = params.get('woord');
if (currentWord !== null)
    showWord(content.words.find((word) => word.woord === decodeURIComponent(currentWord)));

const wordDetailPage = document.querySelector('.word-detail');
const wordTitle = wordDetailPage.querySelector('.word-title');
const wordGramm = wordDetailPage.querySelector('.word-gramm');
function showWord(word) {
    if (typeof word === 'undefined') {
        console.log('Het woord is niet gevonden.');
    } else if (typeof word.synonym === 'string'){
        showWord(content.words.find((otherWord) => otherWord.woord === word.synonym));
    } else {
        wordDetailPage.classList.remove('hidden');
        wordTitle.innerHTML = word.woord;
        wordGramm.innerHTML = word.prefix;
    }
}
