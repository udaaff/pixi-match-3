import { pixiPipes } from '@assetpack/core/pixi';

export default {
    entry: './raw-assets',
    output: './public/assets/',
    cache: true,
    pipes: [
        ...pixiPipes({
            // compression: { jpg: false, png: false, webp: false },
            texturePacker: {
                texturePacker: {
                    nameStyle: "relative",
                    removeFileExtension: true,
                },
            },
            manifest: {
                output: './public/assets/assets-manifest.json',
            }
        }),
    ],
};