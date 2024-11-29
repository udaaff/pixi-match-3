/** Minimum screen width before the resizing function shrinks the view. */
const minWidth = 428;
/** Minimum screen height before the resizing function shrinks the view. */
const minHeight = 925;

/** Object to store all configuration values for the out of gameplay design logic. */
export const cfg = {
    content: {
        width: minWidth,
        height: minHeight,
    },
    /** Tile scale for the background elements found in each screen. */
    backgroundTileScale: 2,

    appWidth: 760,
    appHeight: 650,

    // num cells
    viewportHLength: 8,
    viewportVLength: 8,

    boardCellWidth: 68,
    boardCellHeight: 68,

    maxShuffleAttemps: 1000,

    hintDuration: 0.3,

    bombFloatingPeriod: 1,
    bombFloatingAmplitude: 2,

    boardX0: 20,
    boardY0: 80,

    boardMoveSpeedFactor: 0.005,
    boardMoveDelay: 1,
};