////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

/*!
*
* START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
*
*/
function initPreload() {
    toggleLoader(true);

    checkMobileEvent();

    $(window).resize(function () {
        resizeGameFunc();
    });
    resizeGameFunc();

    loader = new createjs.LoadQueue(false);
    manifest = [
        {src: 'assets/background.png', id: 'background'},
        {src: 'assets/logo.png', id: 'logo'},
        {src: 'assets/button_start.png', id: 'buttonStart'},

        {src: 'assets/bg_wheel.png', id: 'bgWheel'},
        {src: 'assets/item_wheel_center.png', id: 'itemWheelCentre'},
        {src: 'assets/item_arrow.png', id: 'itemArrow'},
        {src: 'assets/item_wheel.png', id: 'itemWheel'},
        {src: 'assets/item_pin.png', id: 'itemPin'},
        {src: 'assets/item_light.png', id: 'itemLight'},

        //{src: 'assets/item_side.png', id: 'itemSide'},
        {src: 'assets/table/table.png', id: 'itemSide'},
        {src: 'assets/item_game1.png', id: 'itemGame1'},
        {src: 'assets/item_game2.png', id: 'itemGame2'},
        {src: 'assets/item_ticket.png', id: 'itemTicket'},
        {src: 'assets/button_spin.png', id: 'buttonSpin'},

        {src: 'assets/button_plus.png', id: 'buttonPlus'},
        {src: 'assets/button_minus.png', id: 'buttonMinus'},

        {src: 'assets/sections/section2.png', id: 'section2'},
        {src: 'assets/sections/section5.png', id: 'section5'},
        {src: 'assets/sections/section6.png', id: 'section6'},
        {src: 'assets/sections/section10.png', id: 'section10'},
        {src: 'assets/sections/section20.png', id: 'section20'},

        {src: 'assets/bets/bet1.png', id: 'bet1'},
        {src: 'assets/bets/bet2.png', id: 'bet2'},
        {src: 'assets/bets/bet4.png', id: 'bet4'},
        {src: 'assets/bets/bet8.png', id: 'bet8'},
        {src: 'assets/bets/bet14.png', id: 'bet14'},

        {src: 'assets/button_replay.png', id: 'buttonReplay'},
        {src: 'assets/button_facebook.png', id: 'buttonFacebook'},
        {src: 'assets/button_twitter.png', id: 'buttonTwitter'},
        {src: 'assets/button_google.png', id: 'buttonGoogle'},
        {src: 'assets/button_fullscreen.png', id: 'buttonFullscreen'},
        {src: 'assets/button_sound_on.png', id: 'buttonSoundOn'},
        {src: 'assets/button_sound_off.png', id: 'buttonSoundOff'},
        {src: 'assets/flags/en_49.png', id: 'flagEn'},
        {src: 'assets/flags/ru_49.png', id: 'flagRu'}
    ];

    for (var n = 0; n < wheel_arr.length; n++) {
        if (wheel_arr[n].src != '') {
            manifest.push({src: wheel_arr[n].src, id: 'wheel' + n});
        }

        if (wheel_arr[n].highlight != '') {
            manifest.push({src: wheel_arr[n].highlight, id: 'wheelH' + n});
        }
    }

    for (var n = 0; n < wheelSecond_arr.length; n++) {
        if (wheelSecond_arr[n].src != '') {
            manifest.push({src: wheelSecond_arr[n].src, id: 'wheelInner' + n});
        }
        if (wheelSecond_arr[n].highlight != '') {
            manifest.push({src: wheelSecond_arr[n].highlight, id: 'wheelInnerH' + n});
        }
    }

    soundOn = true;
    if ($.browser.mobile || isTablet) {
        if (!enableMobileSound) {
            soundOn = false;
        }
    }

    if (soundOn) {
        manifest.push({src: 'assets/sounds/click.ogg', id: 'soundClick'});
        manifest.push({src: 'assets/sounds/loss.ogg', id: 'soundLoss'});
        manifest.push({src: 'assets/sounds/win.ogg', id: 'soundWin'});
        manifest.push({src: 'assets/sounds/lossall.ogg', id: 'soundLossall'});
        manifest.push({src: 'assets/sounds/jackpot.ogg', id: 'soundJackpot'});
        manifest.push({src: 'assets/sounds/spin.ogg', id: 'soundSpin'});
        manifest.push({src: 'assets/sounds/spinning.ogg', id: 'soundSpinning'});
        manifest.push({src: 'assets/sounds/ticket.ogg', id: 'soundTicket'});
        manifest.push({src: 'assets/sounds/tone.ogg', id: 'soundTone'});
        manifest.push({src: 'assets/sounds/result.ogg', id: 'soundResult'});
        manifest.push({src: 'assets/sounds/arrow.ogg', id: 'soundArrow'});
        manifest.push({src: 'assets/sounds/select.ogg', id: 'soundSelect'});
        manifest.push({src: 'assets/sounds/start.ogg', id: 'soundStart'});

        createjs.Sound.alternateExtensions = ["mp3"];
        loader.installPlugin(createjs.Sound);
    }

    loader.addEventListener("complete", handleComplete);
    loader.addEventListener("fileload", fileComplete);
    loader.addEventListener("error", handleFileError);
    loader.on("progress", handleProgress, this);
    loader.loadManifest(manifest);
}

/*!
 *
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 *
 */
function fileComplete(evt) {
    var item = evt.item;
    //console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 *
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 *
 */
function handleFileError(evt) {
    console.log("error ", evt);
}

/*!
 *
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 *
 */
function handleProgress() {
    $('#mainLoader span').html(Math.round(loader.progress / 1 * 100) + '%');
}

/*!
 *
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 *
 */
function handleComplete() {
    toggleLoader(false);
    initMain();
};

/*!
 *
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 *
 */
function toggleLoader(con) {
    if (con) {
        $('#mainLoader').show();
    } else {
        $('#mainLoader').hide();
    }
}
