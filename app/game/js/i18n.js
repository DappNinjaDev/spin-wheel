const KEY_SPIN_YOUR_FORTUNE = 'spin_your_fortune';
const KEY_INSTRUCTION_BET_AND_SPIN = 'bet_and_spin';
const KEY_BALANCE = 'balance';
const KEY_SPINNING = 'spinning';
const KEY_WIN_WAVES = 'win_waves';
const KEY_FAIL = 'fail';
const KEY_SPIN_BTN = 'spin_btn';
const KEY_ALL_GAMES_BTN = 'all_games_btn';

const LANG_EN = 'en';
const LANG_RU = 'ru';
const langs = [LANG_EN, LANG_RU];
const getFirstBrowserLanguage = () => {
    let result = null;
    var nav = window.navigator,
        browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
        i,
        language;

    // support for HTML 5.1 "navigator.languages"
    if (Array.isArray(nav.languages)) {
        for (i = 0; i < nav.languages.length; i++) {
            language = nav.languages[i];
            if (language && language.length) {
                result = language;
                break;
            }
        }
    }

    // support for other well known properties in browsers
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
        language = nav[browserLanguagePropertyKeys[i]];
        if (language && language.length) {
            result = language;
            break;
        }
    }

    if (result) {
        result = result.toLowerCase();
        const split = result.split('-');
        if (split.length >= 2) {
            result = split[0];
        }
    }

    return result;
};

const getUserLang = _ => {
    if (localStorage.getItem('lang')) {
        return localStorage.getItem('lang');
    } else {
        return langs.includes(getFirstBrowserLanguage()) ? getFirstBrowserLanguage() : LANG_EN;
    }
};

let i18nDefaultLanguage = getUserLang();
//let i18nDefaultLanguage = LANG_RU;

const textValues = {
    [LANG_EN]: {
        [KEY_SPIN_YOUR_FORTUNE]: 'Spin your fortune',
        [KEY_INSTRUCTION_BET_AND_SPIN]: 'Place your bet, spin the wheel.',
        [KEY_BALANCE]: 'Balance: {balance}',
        [KEY_SPINNING]: 'Spinning...',
        [KEY_WIN_WAVES]: 'Win {count} WAVES',
        [KEY_FAIL]: 'Luck next time',
        [KEY_SPIN_BTN]: 'Spin',
        [KEY_ALL_GAMES_BTN]: 'Last games',
    },
    [LANG_RU]: {
        [KEY_SPIN_YOUR_FORTUNE]: 'Сделайте ставку',
        [KEY_INSTRUCTION_BET_AND_SPIN]: 'Сделайте ставку и вращайте колесо',
        [KEY_BALANCE]: 'Баланс: {balance}',
        [KEY_SPINNING]: 'Вращаем...',
        [KEY_WIN_WAVES]: 'Выиграно {count} WAVES',
        [KEY_FAIL]: 'Попробуйте еще',
        [KEY_SPIN_BTN]: 'Вращать',
        [KEY_ALL_GAMES_BTN]: 'Предыдущие игры',
    },
};

const getText = (key, data = {}, lang = i18nDefaultLanguage) => {
    let result = textValues[lang][key] ? textValues[lang][key] : key;
    Object.keys(data).forEach(key => {
        result = result.replace(`{${key}}`, data[key]);
    });

    return result;
};

const changeLang = lang => {
    localStorage.setItem('lang', lang);
    location.reload();
};
