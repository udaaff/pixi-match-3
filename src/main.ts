import '@pixi/spine-pixi';

import { sound } from '@pixi/sound';
import { Application, Assets, Ticker, WebGLRenderer } from 'pixi.js';

import { getLevelData, setRawLevelsData } from './model/levels';
import { tracePools } from './pool/pool';
import { GameplayProcess } from './process/GameplayProcess';
import { logProcessInfo } from './process/Process';
import { addProcess } from './process/processRunner';
import { initAssets, loadBundles } from './utils/assets';
import { navigation } from './utils/navigation';
import { registerPools } from './pool/poolUtil';
import { Stats } from 'pixi-stats';
import PixiPlugin from 'gsap/PixiPlugin';
import gsap from 'gsap';
import * as PIXI from 'pixi.js';

// The PixiJS app Application instance, shared across the project
export const app = new Application();

export const gameTicker = new Ticker();
gameTicker.autoStart = true;

gsap.registerPlugin(PixiPlugin);
console.log(PIXI)
PixiPlugin.registerPIXI(PIXI);

// Set up a resize function for the app
function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minWidth = 375;
    const minHeight = 700;

    // Calculate renderer and canvas sizes based on current dimensions
    const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
    const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
    const scale = scaleX > scaleY ? scaleX : scaleY;
    const width = windowWidth * scale;
    const height = windowHeight * scale;

    // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
    app.renderer.canvas.style.width = `${windowWidth}px`;
    app.renderer.canvas.style.height = `${windowHeight}px`;
    window.scrollTo(0, 0);

    // Update renderer and navigation screens dimensions
    app.renderer.resize(width, height);
    navigation.resize(width, height);
}

// Fire when document visibility changes - lose or regain focus
function visibilityChange() {
    if (document.hidden) {
        sound.pauseAll();
        navigation.blur();
    } else {
        sound.resumeAll();
        navigation.focus();
    }
}

// Setup app and initialise assets
async function init() {
    // Initialize app
    await app.init({
        resolution: Math.max(window.devicePixelRatio, 2),
        backgroundColor: 0xffffff,
    });
    app.ticker.maxFPS = 60;

    // Add pixi canvas element (app.canvas) to the document's body
    document.body.appendChild(app.canvas);

    // Whenever the window resizes, call the 'resize' function
    window.addEventListener('resize', resize);

    // Trigger the first resize
    resize();

    // Add a visibility listener, so the app can pause sounds and screens
    document.addEventListener('visibilitychange', visibilityChange);

    // Setup assets bundles (see assets.ts) and start up loading everything in background
    await initAssets();
    await loadBundles(["board-objects", "levels"]);


    const stats = new Stats(app.renderer as WebGLRenderer);

    logProcessInfo();
    // // Show initial loading screen
    // await navigation.showScreen(LoadScreen);

    registerPools();

    const levels = Assets.get("levels.json");
    console.log(levels)

    setRawLevelsData(levels);
    console.log(getLevelData(1));

    const gameplay = new GameplayProcess(2)
    addProcess(gameplay, 'app');

    tracePools();
}

// Init everything
init();