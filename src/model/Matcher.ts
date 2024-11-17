import { Color } from "pixi.js";
import { BoardObject } from "../display/BoardObject";
import { Bomb } from "../display/Bomb";
import { ColorBomb } from "../display/ColorBomb";
import { getRandomElement, removeElementOnce, removeRandomElement } from "../utils/arrayUtils";
import { int } from "../utils/integer";
import { BombType } from "./BombType";
import { M3Model } from "./M3Model";
import { Match } from "./Match";
import { Swap } from "./Swap";
import { Viewport } from "./Viewport";

const MATCH_PATTERNS = [
    [[0, -1], [0, -2], [-1, -2], [0, -3], [1, -2]],
    [[0, 1], [0, 2], [-1, 2], [0, 3], [1, 2]],
    [[-1, 0], [-2, 0], [-2, -1], [-3, 0], [-2, 1]],
    [[1, 0], [2, 0], [2, -1], [3, 0], [2, 1]],
    [[0, 2], [0, 1], [-1, 1], [1, 1]],
    [[2, 0], [1, 0], [1, -1], [1, 1]]
];

const SUPER_SWAP_PATTERN = [[0, 1], [1, 0]];

export class Matcher {
    constructor(private readonly _model: M3Model) { }

    public getMatches(swap?: Swap): Match[] {
        const trigger1 = swap?.object1;
        const trigger2 = swap?.object2;
        const result: Match[] = [];
        const hMatches: BoardObject[][] = [];
        const vMatches: BoardObject[][] = [];
        const viewport = this._model.viewport;
        const vLength = viewport.row + viewport.vLength;
        const hLength = viewport.column + viewport.hLength;
        const iLength = vLength - 2;
        const jLength = hLength - 2;
        const gemToVMatchMap = new Map<BoardObject, BoardObject[]>();

        // находим все горизонтальные матчи: 3+ фишек по горизонтали
        for (let i = viewport.row; i < vLength; i++) {
            for (let j = viewport.column; j < jLength; j++) {
                const hMatch = this.getHRMatch(i, j);
                if (hMatch && hMatch.length > 2) {
                    // горизонтальное совпадение найдено
                    hMatches.push(hMatch);
                    j += hMatch.length - 1;
                }
            }
        }

        // находим все вертикальные матчи: 3+ фишек по вертикали
        for (let j = viewport.column; j < hLength; j++) {
            for (let i = viewport.row; i < iLength; i++) {
                const vMatch = this.getVBMatch(i, j);

                if (vMatch && vMatch.length > 2) {
                    // вертикальное совпадение найдено
                    vMatches.push(vMatch);
                    i += vMatch.length - 1;
                    for (const gem of vMatch) {
                        gemToVMatchMap.set(gem, vMatch);
                    }
                }
            }
        }

        // перебираем все горизонтальные матчи, ища при этом пересечения с вертикальными
        for (const hMatch of hMatches) {
            let vMatch: BoardObject[] | undefined;

            const match = new Match();
            match.gems = hMatch.concat();

            // ищем пересечение
            for (const gem of hMatch) {
                vMatch = gemToVMatchMap.get(gem);
                if (vMatch) {
                    // пересечение найдено
                    // в крестовой комбинации триггером может являться только объект на пересечении
                    match.trigger = gem;
                    if (hMatch.length > 4 || vMatch.length > 4)
                        match.combinationType = Match.MATCH_5;
                    else
                        match.combinationType = Match.MATCH_CROSS;

                    match.direction = Match.VERTICAL_HORIZONTAL;

                    for (const gem of vMatch) {
                        if (match.trigger !== gem)
                            match.gems.push(gem);
                    }

                    // удаляем вертикальное совпадение
                    removeElementOnce(vMatches, vMatch);
                    for (const gem of vMatch) {
                        gemToVMatchMap.delete(gem);
                    }
                    break;
                }
            }

            // вертикальное пересечение не было найдено для текущего горизонтального матча
            if (!vMatch) {
                match.combinationType = this.getMatchTypeByLength(match.gems.length);
                match.direction = Match.HORIZONTAL;
            }

            result.push(match);
        }

        for (const vMatch of vMatches) {
            const match = new Match();
            match.gems = vMatch;
            match.combinationType = this.getMatchTypeByLength(match.gems.length);
            match.direction = Match.VERTICAL;
            result.push(match);
        }

        if (trigger1 || trigger2) {
            for (const match of result) {
                if (match.trigger)
                    continue;

                if (trigger1 && match.gems.indexOf(trigger1) !== -1)
                    match.trigger = trigger1;
                else if (trigger2 && match.gems.indexOf(trigger2) !== -1)
                    match.trigger = trigger2;
                else
                    match.trigger = match.gems[0]; // на случай, если был достигнут потолок перестановок
            }
        }
        else {
            outerLoop:
            for (const match of result) {
                if (match.trigger)
                    continue;

                for (const gem of match.gems) {
                    if (!(gem instanceof Bomb)) {
                        match.trigger = gem;
                        continue outerLoop;
                    }
                }

                match.trigger = match.gems[0];
            }
        }

        if ((trigger1 instanceof Bomb) && (trigger2 instanceof Bomb)) {
            if ((trigger1 instanceof ColorBomb) && (trigger2 instanceof ColorBomb)) {
                const matchTypes = this._model.spawnableMatchTypes.concat();
                const matchType1 = removeRandomElement(matchTypes);
                const matchType2 = removeRandomElement(matchTypes);
                const match = new Match();
                match.gems = [trigger1, trigger2];
                match.combinationType = Match.MATCH_COLOR;
                match.trigger = trigger2;
                result.push(match);

                trigger1.triggerMatchType = matchType1;
                trigger2.triggerMatchType = matchType2;
            }
            else {
                const match = new Match();
                match.gems = [trigger1, trigger2];
                match.trigger = trigger1;
                result.push(match);

                if (trigger1.isMatchableType())
                    trigger2.triggerMatchType = trigger1.matchType;

                if (trigger2.isMatchableType())
                    trigger1.triggerMatchType = trigger2.matchType;
            }
        }
        else if (trigger1 instanceof Bomb) {
            if (trigger1.bombType == BombType.COLOR) {
                const match = new Match();
                match.gems = [trigger1];
                match.combinationType = Match.MATCH_COLOR;
                match.trigger = trigger2;
                result.push(match);
                if (trigger2?.isMatchableType())
                    trigger1.triggerMatchType = trigger2.matchType;
            }
        }
        else if (trigger2 instanceof Bomb) {
            if (trigger2.bombType == BombType.COLOR) {
                const match = new Match();
                match.gems = [trigger2];
                match.combinationType = Match.MATCH_COLOR;
                match.trigger = trigger1;
                result.push(match);
                if (trigger1?.isMatchableType())
                    trigger2.triggerMatchType = trigger1.matchType;
            }
        }

        return result;
    }

    public getPossibleSwaps(): Swap[] {
        let swaps: Swap[] = [];
        const viewport: Viewport = this._model.viewport;
        const vLength = viewport.row + viewport.vLength;
        const hLength = viewport.column + viewport.hLength;
        const kLength = MATCH_PATTERNS.length;
        for (let i: int = viewport.row; i < vLength; i++) {
            for (let j: int = viewport.column; j < hLength; j++) {
                for (let k: int = 0; k < kLength; k++) {
                    let result = this.getSwapsByPattern(i, j, MATCH_PATTERNS[k]);
                    if (result)
                        swaps = swaps.concat(result);
                }

                const result = this.getSuperSwapsAt(i, j);
                if (result)
                    swaps = swaps.concat(result);
            }
        }

        return swaps;
    }

    /**
     * Возвращает true, если есть хотя бы одно возможное совпадение в пределах текущего вьюпорта.
     */
    public hasMove(): Boolean {
        const viewport: Viewport = this._model.viewport;
        const vLength: int = viewport.row + viewport.vLength;
        const hLength: int = viewport.column + viewport.hLength;
        const kLength: int = MATCH_PATTERNS.length;
        for (let i: int = viewport.row; i < vLength; i++) {
            for (let j: int = viewport.column; j < hLength; j++) {
                if (this.getSuperSwapsAt(i, j))
                    return true;

                for (let k: int = 0; k < kLength; k++) {
                    if (this.getMatchesByPattern(i, j, MATCH_PATTERNS[k]))
                        return true;
                }
            }
        }

        return false;
    }

    /**
     * Возвращает true, если есть хотя бы одно возможное совпадение в пределах текущего вьюпорта.
     */
    public hasSwap(): Boolean {
        const viewport: Viewport = this._model.viewport;
        const vLength: int = viewport.row + viewport.vLength;
        const hLength: int = viewport.column + viewport.hLength;
        const kLength: int = MATCH_PATTERNS.length;
        for (let i: int = viewport.row; i < vLength; i++) {
            for (let j: int = viewport.column; j < hLength; j++) {
                if (this.getSuperSwapsAt(i, j))
                    return true;

                for (let k: int = 0; k < kLength; k++) {
                    if (this.getSwapsByPattern(i, j, MATCH_PATTERNS[k]))
                        return true;
                }
            }
        }

        return false;
    }

    /**
     * Возвращает true, если есть хотя бы одно совпадение "три в ряд" в пределах текущего вьюпорта.
     * Проверяются IMatchable объекты.
     */
    public hasMatch(viewport?: Viewport): Boolean {
        if (!viewport)
            viewport = this._model.viewport;

        const vLength = viewport.row + viewport.vLength;
        const hLength = viewport.column + viewport.hLength;
        const iLength = vLength - 2;
        const jLength = hLength - 2;

        for (let i = viewport.row; i < vLength; i++) {
            for (let j = viewport.column; j < jLength; j++) {
                const match = this.getHRMatch(i, j, viewport);
                if (match && match.length > 2)
                    return true;
            }
        }

        for (let j = viewport.column; j < hLength; j++) {
            for (let i = viewport.row; i < iLength; i++) {
                const match = this.getVBMatch(i, j, viewport);
                if (match && match.length > 2)
                    return true;
            }
        }

        return false;
    }

    public getRandomPossibleSwap(): Swap | null {
        return getRandomElement(this.getPossibleSwaps());
    }

    private getMatchTypeByLength(length: int): string {
        if (length == 3)
            return Match.MATCH_3;
        else if (length == 4)
            return Match.MATCH_4;
        else
            return Match.MATCH_5;
    }

    /**
     * Возвращает массив возможных совпадений. Массив (match) содержит только
     * элементы соответствующие паттерну (3 элемента). Т.е., не захватываются другие элементы, которые
     * могут входит в match.
     */
    private getMatchesByPattern(row: int, column: int, pattern: int[][]): BoardObject[][] | null {
        // Залоченые элементы не могут участвовать в комбинации.
        let matches: BoardObject[][] | null = null;

        // Базовый элемент (X) от которого будем отталкиваться при проверке. Может быть заморожен.
        const gemX = this._model.getGemAt(row, column);
        if (!gemX?.isMatchableType() || gemX.isBlocked || this._model.gemLocked(gemX))
            return null;

        const baseMatchType: int = gemX.matchType;

        // Элемент (1) для свопа, тип не важен. Элемент не должен быть заморожен или залочен.
        const gem1 = this._model.getGemAt(row + pattern[1][0], column + pattern[1][1], true);
        if (!gem1?.isMatchableType() || gem1.isBlocked || this._model.gemFrozen(gem1) || this._model.gemLocked(gem1))
            return null;

        // Элемент (0) составляющий с элементом X базовую комбинацию. Может быть заморожен.
        const gem0 = this._model.getGemAt(row + pattern[0][0], column + pattern[0][1], true);
        if (!gem0?.isMatchableType() || gem0.isBlocked || this._model.gemLocked(gem0) || gem0.matchType !== baseMatchType)
            return null;

        // Прочие элементы для свопа. Не должны быть заморожены или залочены.
        const iLength: int = pattern.length;
        for (let i: int = 2; i < iLength; i++) {
            const gem = this._model.getGemAt(row + pattern[i][0], column + pattern[i][1], true);
            if (gem?.isMatchableType() && !gem.isBlocked && !this._model.gemFrozen(gem) && !this._model.gemLocked(gem) && gem.matchType == baseMatchType) {
                if (!matches)
                    matches = [];

                matches.push([gemX, gem0, gem]);
            }
        }

        return matches;
    }

    /**
     * Объекты должны быть полюбому Moveable, не замороженые, не залоченые, не блокированые.
     */
    public getSuperSwapsAt(row: int, column: int): Swap[] | null {
        // Базовый элемент (X) от которого будем отталкиваться при проверке. Не может быть заморожен.
        const gemX = this._model.getGemAt(row, column);
        if (!gemX?.isMoveableType() || gemX.isBlocked || this._model.gemLocked(gemX) || this._model.gemFrozen(gemX))
            return null;

        let swaps: Swap[] | null = null;
        const iLength: int = SUPER_SWAP_PATTERN.length;
        for (let i: int = 0; i < iLength; i++) {
            let gem = this._model.getGemAt(row + SUPER_SWAP_PATTERN[i][0], column + SUPER_SWAP_PATTERN[i][1], true);
            if (gem?.isMoveableType() && !gem.isBlocked && !this._model.gemFrozen(gem) && !this._model.gemLocked(gem)) {
                let hasResult = ((gemX instanceof Bomb) && (gem instanceof Bomb))
                    || (gemX instanceof ColorBomb) || gem instanceof ColorBomb;

                if (!hasResult)
                    continue;

                if (!swaps)
                    swaps = [];

                swaps.push(new Swap(gemX, gem));
            }
        }

        return swaps;
    }

    /**
     * Возвращает массив возможных перестановок.
     */
    private getSwapsByPattern(row: int, column: int, pattern: int[][]): Swap[] | null{
        // Залоченые элементы не могут участвовать в комбинации.
        let swaps: Swap[] | null = null;

        // Базовый элемент (X) от которого будем отталкиваться при проверке. Может быть заморожен.
        const gemX = this._model.getGemAt(row, column);
        if (!gemX?.isMatchableType() || gemX.isBlocked || this._model.gemLocked(gemX))
            return null;

        const baseMatchType: int = gemX.matchType;

        // Элемент (1) для свопа, тип не важен. Элемент не должен быть заморожен или залочен.
        const gem1 = this._model.getGemAt(row + pattern[1][0], column + pattern[1][1], true);
        if (!gem1?.isMatchableType() || gem1.isBlocked || this._model.gemFrozen(gem1) || this._model.gemLocked(gem1))
            return null;

        // Элемент (0) составляющий с элементом X базовую комбинацию. Может быть заморожен.
        const gem0 = this._model.getGemAt(row + pattern[0][0], column + pattern[0][1], true);
        if (!gem0?.isMatchableType() || gem0.isBlocked || this._model.gemLocked(gem0) || gem0.matchType !== baseMatchType)
            return null;

        // Прочие элементы для свопа. Не должны быть заморожены или залочены.
        const iLength: int = pattern.length;
        for (let i: int = 2; i < iLength; i++) {
            const gem = this._model.getGemAt(row + pattern[i][0], column + pattern[i][1], true);
            if (gem?.isMatchableType() && !gem.isBlocked && !this._model.gemFrozen(gem) && !this._model.gemLocked(gem) && gem.matchType == baseMatchType) {
                if (!swaps)
                    swaps = [];

                swaps.push(new Swap(gem1, gem));
            }
        }

        return swaps;
    }

    /**
     * Vertical Bottom Match
     * Если не совпало не одного объекта, возвращается null
     */
    private getVBMatch(row: int, column: int, viewport?: Viewport): BoardObject[] | null {
        const gem = this._model.getGemAt(row, column);
        if (!gem?.isMatchableType() || this._model.gemLocked(gem))
            return null;

        if (!viewport)
            viewport = this._model.viewport;

        const match: BoardObject[] = [gem];
        const baseMatchType: int = gem.matchType;
        const length: int = viewport.row + viewport.vLength;
        for (let i: int = row + 1; i < length; i++) {
            const gem = this._model.getGemAt(i, column);
            if (!gem?.isMatchableType() || this._model.gemLocked(gem) || gem.matchType !== baseMatchType)
                break;

            match.push(gem);
        }
        return match;
    }

    /**
     * Horizontal Right Match
     * Если не совпало не одного объекта, возвращается null
     */
    private getHRMatch(row: int, column: int, viewport?: Viewport): BoardObject[] | null {
        const gem = this._model.getGemAt(row, column);
        if (!gem?.isMatchableType() || this._model.gemLocked(gem))
            return null;

        if (!viewport)
            viewport = this._model.viewport;

        const match: BoardObject[] = [gem];
        const baseMatchType: int = gem.matchType;
        const length: int = viewport.column + viewport.hLength;
        for (let j: int = column + 1; j < length; j++) {
            const gem = this._model.getGemAt(row, j);
            if (!gem?.isMatchableType() || this._model.gemLocked(gem) || gem.matchType !== baseMatchType)
                break;

            match.push(gem);
        }
        return match;
    }
}