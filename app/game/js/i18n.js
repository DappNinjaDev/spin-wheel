const KEY_SPIN_YOUR_FORTUNE = 'spin_your_fortune';
const KEY_INSTRUCTION_BET_AND_SPIN = 'bet_and_spin';
const KEY_BALANCE = 'balance';
const KEY_SPINNING = 'spinning';
const KEY_WIN_WAVES = 'win_waves';
const KEY_FAIL = 'fail';

const LANG_EN = 'en';
const LANG_RU = 'ru';
let i18nDefaultLanguage = LANG_EN;

const textValues = {
    [LANG_EN]: {
        [KEY_SPIN_YOUR_FORTUNE]: 'Spin your fortune',
        [KEY_INSTRUCTION_BET_AND_SPIN]: 'Place your bet, spin the wheel.',
        [KEY_BALANCE]: 'Balance: {balance} WAVES',
        [KEY_SPINNING]: 'Spinning...',
        [KEY_WIN_WAVES]: 'Win {count} WAVES',
        [KEY_FAIL]: 'Luck next time',
    },
    [LANG_RU]: {},
};

const getText = (key, data = {}, lang = i18nDefaultLanguage) => {

    let result = textValues[lang][key] ? textValues[lang][key] : key;
    Object.keys(data).forEach(key => {
        result = result.replace(`{${key}}`, data[key]);
    });

    return result;
};
