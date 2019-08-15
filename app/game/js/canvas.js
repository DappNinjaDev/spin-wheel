////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW = 0;
var canvasH = 0;

// previous libel_suitregular
var defaultFont = 'Oswald';

/*!
 *
 * START GAME CANVAS - This is the function that runs to setup game canvas
 *
 */
function initGameCanvas(w, h) {
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = w;
    gameCanvas.height = h;

    canvasW = w;
    canvasH = h;
    stage = new createjs.Stage("gameCanvas");

    createjs.Touch.enable(stage);
    stage.enableMouseOver(20);
    stage.mouseMoveOutside = true;

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, wheelOuterContainer, wheelInnerContainer, lightsContainer,
    ticketContainer, resultContainer;
var guideline, bg, logo, buttonStart, buttonReplay, buttonFacebook, buttonTwitter, buttonGoogle, buttonFullscreen,
    buttonSoundOn, buttonSoundOff;

$.wheel = {};
$.wheelInner = {};
$.ticket = {};
$.light = {};

function createHighlight(x, y, rectX = -42, rectY = -45, rectWidth = 85, rectHeight = 85) {
    let hl = new createjs.Shape();
    hl.name = 'hl';
    hl.graphics.clear();
    //hl.graphics.setStrokeStyle(5).beginStroke('#fff');
    hl.graphics.setStrokeStyle(2).beginStroke('#000');
    hl.visible = false;
    hl.x = x;
    hl.y = y;
    hl.graphics.rect(rectX, rectY, rectWidth, rectHeight).closePath();

    return hl;
}

/*!
 *
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 *
 */
function buildGameCanvas() {
    canvasContainer = new createjs.Container();
    mainContainer = new createjs.Container();
    gameContainer = new createjs.Container();
    wheelContainer = new createjs.Container();
    wheelOuterContainer = new createjs.Container();
    wheelInnerContainer = new createjs.Container();
    wheelPinContainer = new createjs.Container();
    lightsContainer = new createjs.Container();
    ticketContainer = new createjs.Container();
    resultContainer = new createjs.Container();

    bg = new createjs.Bitmap(loader.getResult('background'));
    logo = new createjs.Bitmap(loader.getResult('logo'));

    buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
    centerReg(buttonStart);
    buttonStart.x = canvasW / 100 * 28;
    buttonStart.y = canvasH / 100 * 60;

    //game
    bgWheel = new createjs.Bitmap(loader.getResult('bgWheel'));

    itemWheel = new createjs.Bitmap(loader.getResult('itemWheel'));
    centerReg(itemWheel);
    itemWheelCentre = new createjs.Bitmap(loader.getResult('itemWheelCentre'));
    centerReg(itemWheelCentre);
    itemWheel.x = itemWheelCentre.x = wheelOuterContainer.x = wheelInnerContainer.x = wheelPinContainer.x = lightsContainer.x = wheelX;
    itemWheel.y = itemWheelCentre.y = wheelOuterContainer.y = wheelInnerContainer.y = wheelPinContainer.y = lightsContainer.y = wheelY;

    itemArrow = new createjs.Bitmap(loader.getResult('itemArrow'));
    itemArrow.regX = 27;
    itemArrow.regY = 14;
    itemArrow.x = arrowX;
    itemArrow.y = arrowY;

    itemPin = new createjs.Bitmap(loader.getResult('itemPin'));
    centerReg(itemPin);
    itemPin.x = -500;

    itemSide = new createjs.Bitmap(loader.getResult('itemSide'));
    centerReg(itemSide);
    itemSide.x = canvasW / 100 * 28;
    itemSide.y = canvasH / 100 * 50;

    itemGame1 = new createjs.Bitmap(loader.getResult('itemGame1'));
    centerReg(itemGame1);
    itemGame1.x = canvasW / 100 * 28;
    itemGame1.y = canvasH / 100 * 50;

    itemGame2 = new createjs.Bitmap(loader.getResult('itemGame2'));
    centerReg(itemGame2);
    itemGame2.x = canvasW / 100 * 28;
    itemGame2.y = canvasH / 100 * 50;

    buttonSpin = new createjs.Bitmap(loader.getResult('buttonSpin'));
    centerReg(buttonSpin);
    buttonSpin.x = canvasW / 100 * 28;
    buttonSpin.y = canvasH / 100 * 73;

    spinTxt = new createjs.Text();
    spinTxt.font = "45px " + defaultFont;
    spinTxt.color = "#5f2819";
    spinTxt.textAlign = "center";
    spinTxt.textBaseline = 'alphabetic';
    spinTxt.text = getText(KEY_SPIN_BTN).toUpperCase();
    spinTxt.x = canvasW / 100 * 28;
    spinTxt.y = canvasH / 100 * 75;

    buttonPlus = new createjs.Bitmap(loader.getResult('buttonPlus'));
    centerReg(buttonPlus);
    buttonPlus.x = canvasW / 100 * 18;

    buttonMinus = new createjs.Bitmap(loader.getResult('buttonMinus'));
    centerReg(buttonMinus);
    buttonMinus.x = canvasW / 100 * 38;
    buttonPlus.y = buttonMinus.y = canvasH / 100 * 53;

    ['section2', 'section5', 'section6', 'section10', 'section20'].forEach((item, index) => {
        window[item] = new createjs.Container();
        const obj = new createjs.Bitmap(loader.getResult(item));
        window[item]._section = Number(item.replace('section', ''));
        window[item].addChild(obj);
        centerReg(obj);
        obj.x = canvasW / 100 * (13 + index * 7.5);
        obj.y = canvasH / 100 * 42;
        window[item].addChild(createHighlight(obj.x, obj.y));
    });

    ['bet1', 'bet2', 'bet4', 'bet8', 'bet14'].forEach((item, index) => {
        window[item] = new createjs.Container();
        const obj = new createjs.Bitmap(loader.getResult(item));
        window[item]._bet = Number(item.replace('bet', ''));
        window[item].addChild(obj);
        centerReg(obj);
        obj.x = canvasW / 100 * (13 + index * 7.5);
        obj.y = canvasH / 100 * 58;
        window[item].addChild(createHighlight(obj.x, obj.y, -44, -45, 89, 89));
    });

    itemStatusBg = new createjs.Shape();
    itemStatusBg.graphics.beginFill("red");
    gameData.shape = itemStatusBg.graphics.beginFill("red").command;
    itemStatusBg.graphics.drawRoundRectComplex(canvasW / 100 * 12, canvasH / 100 * 22.3, 410, 63, 5, 5, 5, 5);

    statusTxt = new createjs.Text();
    statusTxt.font = "45px " + defaultFont;
    statusTxt.color = "#fff";
    statusTxt.textAlign = "center";
    statusTxt.textBaseline = 'alphabetic';
    statusTxt.text = '$300';
    statusTxt.x = canvasW / 100 * 28;
    statusTxt.y = canvasH / 100 * 29;

    instructionTxt = new createjs.Text();
    instructionTxt.font = "30px " + defaultFont;
    instructionTxt.color = "#fff";
    instructionTxt.textAlign = "center";
    instructionTxt.textBaseline = 'alphabetic';
    instructionTxt.text = '';
    instructionTxt.lineHeight = 32;
    instructionTxt.x = canvasW / 100 * 28;
    instructionTxt.y = canvasH / 100 * 88;

    userBalance = new createjs.Text();
    userBalance.font = "30px " + defaultFont;
    userBalance.color = "#fff";
    userBalance.textAlign = "left";
    userBalance.textBaseline = 'alphabetic';
    userBalance.text = getText(KEY_BALANCE, {balance: '...'});
    userBalance.lineHeight = 32;
    userBalance.x = canvasW / 100 * 9;
    userBalance.y = canvasH / 100 * 16;

    var _frameW = 22;
    var _frameH = 22;
    var _frame = {"regX": _frameW / 2, "regY": _frameH / 2, "height": _frameH, "count": 2, "width": _frameW};
    var _animations = {
        off: {frames: [0], speed: 1},
        on: {frames: [1], speed: 1}
    };

    itemLightData = new createjs.SpriteSheet({
        "images": [loader.getResult("itemLight").src],
        "frames": _frame,
        "animations": _animations
    });

    itemLightAnimate = new createjs.Sprite(itemLightData, "off");
    itemLightAnimate.framerate = 20;
    itemLightAnimate.x = -100;

    itemTicket = new createjs.Bitmap(loader.getResult('itemTicket'));
    itemTicket.regX = itemTicket.image.naturalWidth;
    itemTicket.x = -500;

    itemTicketMask = new createjs.Shape();
    itemTicketMask.graphics.beginFill("red");
    itemTicketMask.graphics.drawRect(0, canvasH / 100 * 48.5, 438, 70);
    itemTicketMask.alpha = 0;
    ticketContainer.mask = itemTicketMask;

    chanceTxt = new createjs.Text();
    chanceTxt.font = "45px " + defaultFont;
    chanceTxt.color = "#652312";
    chanceTxt.textAlign = "center";
    chanceTxt.textBaseline = 'alphabetic';
    chanceTxt.text = '$300';
    chanceTxt.x = canvasW / 100 * 39;
    chanceTxt.y = canvasH / 100 * 56;

    betTxt = new createjs.Text();
    betTxt.font = "45px " + defaultFont;
    betTxt.color = "#652312";
    betTxt.textAlign = "center";
    betTxt.textBaseline = 'alphabetic';
    betTxt.text = '0';
    betTxt.x = canvasW / 100 * 28;
    betTxt.y = canvasH / 100 * 56;

    creditTxt = new createjs.Text();
    creditTxt.font = "45px " + defaultFont;
    creditTxt.color = "#652312";
    creditTxt.textAlign = "center";
    creditTxt.textBaseline = 'alphabetic';
    creditTxt.text = 'CREDIT : $500';
    creditTxt.x = canvasW / 100 * 28;
    creditTxt.y = canvasH / 100 * 43.5;

    //result
    itemResultSide = new createjs.Bitmap(loader.getResult('itemSide'));
    centerReg(itemResultSide);
    itemResultSide.x = canvasW / 100 * 28;
    itemResultSide.y = canvasH / 100 * 50;

    resultTitleTxt = new createjs.Text();
    resultTitleTxt.font = "60px " + defaultFont;
    resultTitleTxt.color = "#652312";
    resultTitleTxt.textAlign = "center";
    resultTitleTxt.textBaseline = 'alphabetic';
    resultTitleTxt.text = resultTitleText;
    resultTitleTxt.x = canvasW / 100 * 28;
    resultTitleTxt.y = canvasH / 100 * 35;

    resultScoreTxt = new createjs.Text();
    resultScoreTxt.font = "45px " + defaultFont;
    resultScoreTxt.color = "#652312";
    resultScoreTxt.textAlign = "center";
    resultScoreTxt.textBaseline = 'alphabetic';
    resultScoreTxt.text = 'CREDIT : $500';
    resultScoreTxt.x = canvasW / 100 * 28;
    resultScoreTxt.y = canvasH / 100 * 43.5;

    resultShareTxt = new createjs.Text();
    resultShareTxt.font = "20px " + defaultFont;
    resultShareTxt.color = "#666";
    resultShareTxt.textAlign = "center";
    resultShareTxt.textBaseline = 'alphabetic';
    resultShareTxt.text = shareText;
    resultShareTxt.x = canvasW / 100 * 28;
    resultShareTxt.y = canvasH / 100 * 49.5;

    buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
    buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
    buttonGoogle = new createjs.Bitmap(loader.getResult('buttonGoogle'));
    centerReg(buttonFacebook);
    createHitarea(buttonFacebook);
    centerReg(buttonTwitter);
    createHitarea(buttonTwitter);
    centerReg(buttonGoogle);
    createHitarea(buttonGoogle);
    buttonFacebook.x = canvasW / 100 * 20;
    buttonTwitter.x = canvasW / 100 * 28;
    buttonGoogle.x = canvasW / 100 * 36;
    buttonFacebook.y = buttonTwitter.y = buttonGoogle.y = canvasH / 100 * 54.5;

    buttonReplay = new createjs.Bitmap(loader.getResult('buttonReplay'));
    centerReg(buttonReplay);
    createHitarea(buttonReplay);
    buttonReplay.x = canvasW / 100 * 28;
    buttonReplay.y = canvasH / 100 * 67;

    //option
    buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
    centerReg(buttonFullscreen);
    buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
    centerReg(buttonSoundOn);
    buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
    centerReg(buttonSoundOff);
    buttonSoundOn.visible = false;

    buttonLangEn = new createjs.Bitmap(loader.getResult('flagEn'));
    centerReg(buttonLangEn);
    buttonLangRu = new createjs.Bitmap(loader.getResult('flagRu'));
    centerReg(buttonLangRu);

    if (guide) {
        guideline = new createjs.Shape();
        guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW - contentW) / 2, (stageH - contentH) / 2, contentW, contentH);
    }

    mainContainer.addChild(logo, buttonStart);
    wheelContainer.addChild(bgWheel, wheelOuterContainer, wheelInnerContainer, itemWheelCentre, itemWheel,
        lightsContainer, itemArrow, wheelPinContainer);

    gameContainer.addChild(itemPin, itemLightAnimate, itemTicket, itemSide, itemGame1, itemGame2, itemTicketMask,
        ticketContainer, creditTxt, chanceTxt, betTxt, buttonMinus, buttonPlus, buttonSpin, spinTxt, itemStatusBg, statusTxt,
        instructionTxt, userBalance,
        bet1, bet2, bet4, bet8, bet14,
        section2, section5, section6, section10, section20
    );
    resultContainer.addChild(itemResultSide, resultTitleTxt, resultScoreTxt, buttonReplay);

    if (shareEnable) {
        resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonGoogle);
    }

    canvasContainer.addChild(/*bg,*/ wheelContainer, mainContainer, gameContainer, resultContainer, /*buttonFullscreen,*/ buttonSoundOn, buttonSoundOff, buttonLangEn, buttonLangRu, guideline);
    stage.addChild(canvasContainer);

    resizeCanvas();
}


/*!
 *
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 *
 */
function resizeCanvas() {
    if (canvasContainer != undefined) {
        buttonSoundOn.x = buttonSoundOff.x = buttonLangEn.x = buttonLangRu.x = canvasW - offset.x;
        buttonSoundOn.y = buttonSoundOff.y = buttonLangEn.y = buttonLangRu.y = offset.y;
        buttonSoundOn.x = buttonSoundOff.x = buttonLangEn.x = buttonLangRu.x -= 40;
        buttonSoundOn.y = buttonSoundOff.y = buttonLangEn.y = buttonLangRu.y += 30;
        buttonLangEn.x -= 150;
        buttonLangRu.x -= 80;

        buttonFullscreen.x = buttonSoundOn.x - 63;
        buttonFullscreen.y = buttonSoundOn.y;
    }
}

/*!
 *
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 *
 */
function removeGameCanvas() {
    stage.autoClear = true;
    stage.removeAllChildren();
    stage.update();
    createjs.Ticker.removeEventListener("tick", tick);
    createjs.Ticker.removeEventListener("tick", stage);
}

/*!
 *
 * CANVAS LOOP - This is the function that runs for canvas loop
 *
 */
function tick(event) {
    updateGame();
    stage.update(event);
}

/*!
 *
 * CANVAS MISC FUNCTIONS
 *
 */
function centerReg(obj) {
    obj.regX = obj.image.naturalWidth / 2;
    obj.regY = obj.image.naturalHeight / 2;
}

function createHitarea(obj) {
    obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));
}
