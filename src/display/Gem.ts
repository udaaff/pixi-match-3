import { Container, Sprite } from "pixi.js";

import { BoardObject } from "./BoardObject";
import { int } from "../utils/integer";
import { EntityID } from "../model/EntityID";
import { cfg } from "../game/cfg";
import { getMatchTypeByEntityID } from "../model/matchColor";
import { getObject } from "../pool/pool";
import gsap from "gsap";
import { TweenProcess } from "../process/TweenProcess";

const _GRAPHICS: { [key: number]: string } = {
    [EntityID.GEM_BLUE]: "g21",
    [EntityID.GEM_GREEN]: "g22",
    [EntityID.GEM_ORANGE]: "g23",
    [EntityID.GEM_PURPLE]: "g24",
    [EntityID.GEM_RED]: "g25",
    [EntityID.GEM_YELLOW]: "g26",
}

export class Gem extends BoardObject {
    private _container: Container;
    private _image:Sprite;
    private _imageTN:string;
    // private _highlight:Sprite;
    private _matchType:int;
    // private _impulsController:ImpulsController;
    // private _impulsContainer:Sprite;
    // private _eye:Eye;
    // private _eyeContainer:Sprite = new Sprite();

    constructor(entityID: int) {
        super({
            entityID,
            isMatchable: true,
            isMoveable: true,
            isGem: true,
            isCollectable: true,
            hasEye: true,
        });

        // this._impulsContainer = new Sprite();

        this._container = new Container();
        this._container.y = -cfg.boardCellWidth / 2;
        this._container.x = -cfg.boardCellHeight / 2;
        this.addChild(this._container); // XXX

        // super.addChild(this._impulsContainer);
        // this._impulsContainer.addChild(this._container);
        // this._impulsContainer.addChild(this._eyeContainer);

        // this._impulsController = new ImpulsController(this._impulsContainer);

        // entity graphic
        this._matchType = getMatchTypeByEntityID(this.entityID);
        if (!(this.entityID in _GRAPHICS))
            throw new Error("no graphics for entity");

        this._imageTN = _GRAPHICS[this.entityID];
        this._image = getObject(Sprite, this._imageTN);
        this._image.setSize(cfg.boardCellWidth, cfg.boardCellHeight);

        // this._eye = new Eye(matchType);
        // this._eyeContainer.x = Eye.EYE_POSITION[matchType][0];
        // this._eyeContainer.y = Eye.EYE_POSITION[matchType][1];

        this._container.addChild(this._image);
        // this._eyeContainer.addChild(this._eye);
    }

    public override get highlight(): Sprite | null
    {
        // if (!this._highlight)
        // {
        //     this._highlight = new Image(Context.textureManager.getTexture(this._imageTN + "_screen"));
        //     this._highlight.alpha = 0;
        //     this._container.addChild(this._highlight);
        // }

        // return this._highlight;
        return null; // XXX temp
    }

    // public override get highlightAlpha():number
    // {
    //     return this.highlight.alpha;
    // }

    // public override set highlightAlpha(value:number)
    // {
    //     // this.highlight.alpha = value;
    // }

    public get matchType():int
    {
        return this._matchType;
    }

    public addImpuls():void
    {
        // this._impulsController.addImpuls();
    }

    public override onGetFromPool():void
    {
        this.scale.set(1);
        this.alpha = 1;
        this.rotation = 0;
        this.x = 0;
        this.y = 0;
        this.isBlocked = false;
        this._numLives = 1;
        this.coordinates = null;
        // this._impulsContainer.y = 0;
        // this._impulsController.start();
        // this._eye.fromPoolHandler();
        // this._eye.x = this._eye.y = 0;
    }

    public override onDisposeToPool():void
    {
        // this._impulsController.stop();
        // this._eye.toPoolHandler();
    }

    // public getEye():Eye
    // {
    //     return this._eye;
    // }
}