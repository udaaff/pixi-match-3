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
};