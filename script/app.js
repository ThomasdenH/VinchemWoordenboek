import { MDCTopAppBar } from '@material/top-app-bar/index';
import { MDCList } from '@material/list/index';
import { MDCRipple } from '@material/ripple/index';
import content from './content';
import {MDCSnackbar} from '@material/snackbar';

navigator.serviceWorker.register('sw.js');

// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const wordDetailPage = document.querySelector('.word-detail');
const wordTitle = wordDetailPage.querySelector('.word-title');
const wordGramm = wordDetailPage.querySelector('.word-gramm');
const wordDesc = wordDetailPage.querySelector('.word-description');
const wordExample = wordDetailPage.querySelector('.word-example');
const backButton = document.querySelector('.mdc-top-app-bar__navigation-icon');

const shareButton = document.querySelector('.action-share');
if (navigator.share) {
    shareButton.addEventListener('click', () => {
        navigator.share({
            title: 'Vinchem Woordenboek',
            text: 'Ik wil een woord met je delen!',
            url: window.location.href,
        });
    });
} else {
    shareButton.remove();
}


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
mdcList.listElements.map((listItemEl) => new MDCRipple(listItemEl));

// Show a word if it was specified
const params = new URLSearchParams(document.location.search.substring(1));
const currentWord = params.get('woord');
if (currentWord !== null)
    showWord(content.words.find((word) => word.woord === decodeURIComponent(currentWord)));

window.onpopstate = function() {
    closeWord();
};

function showWord(word) {
    if (typeof word === 'undefined') {
        console.log('Het woord is niet gevonden.');
    } else if (typeof word.synonym === 'string'){
        showWord(content.words.find((otherWord) => otherWord.woord === word.synonym));
    } else {
        document.body.classList.add('covered');
        wordDetailPage.classList.remove('hidden');
        wordTitle.innerHTML = word.woord;
        wordGramm.innerHTML = word.prefix;
        wordDesc.innerHTML = word.betekenis;
        wordExample.innerHTML = word.voorbeeldzin;
        backButton.classList.remove('hidden');
        topAppBarElement.classList.add('mdc-top-app-bar--fixed');
    }
}

function closeWord() {
    document.body.classList.remove('covered');
    wordDetailPage.classList.add('hidden');
    topAppBarElement.classList.remove('mdc-top-app-bar--fixed');
    backButton.classList.add('hidden');
    const newurl = window.location.origin + window.location.pathname;
    window.history.pushState({ path: newurl }, '', newurl);
}

backButton.addEventListener('click', () => closeWord());
