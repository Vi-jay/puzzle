import EventType = cc.Node.EventType;
import * as anime from "animejs";
import Vec2 = cc.Vec2;
import {convertToNodePos, convertToWorldPos} from "./utils/common";
import PuzzleBar, {DirDict} from "./puzzle-bar";
import * as _ from "lodash";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Block extends cc.Component {
    @property({type: cc.Node})
    picture: cc.Node;
    @property({type: cc.Texture2D})
    maskTextures: cc.Texture2D[] = [];


    //额定每块大小
    puzzlePicSize = cc.size(300, 300);
    //被切割的拼图原图
    texture: cc.Texture2D
    coordinate: cc.Vec2;
    puzzleContainer: cc.Node;
    childSortIdx: number;
    //拼图的突角
    dirDict: DirDict;
    scroller: cc.Node;

    onLoad() {
        this.initActions();
    }

    init(texture: cc.Texture2D, coordinate: cc.Vec2, idx: number, dirDict: DirDict, scroller: cc.Node) {
        this.scroller = scroller;
        this.dirDict = dirDict;
        this.texture = texture;
        this.coordinate = coordinate;
        this.puzzleContainer = this.node.parent;
        const mask = this.getComponent(cc.Mask);
        mask.spriteFrame = new cc.SpriteFrame(this.maskTextures[idx])
        //初始化小模型
        this.changeNodeSize(true);
        return this.node;
    }

    changeNodeSize(isSmall?) {
        const size = this.puzzlePicSize.clone();
        //突出部分大小
        const {left, right, top, bottom} = this.dirDict;
        [left, right].forEach((num) => size.width += num);
        [top, bottom].forEach((num) => size.height += num);
        this.picture.setContentSize(size.clone());
        let calculateSize = size.clone();
        if (isSmall) {
            calculateSize.width *= .5;
            calculateSize.height *= .5;
        }
        this.node.setContentSize(calculateSize);
        const {width: picW, height: picH} = this.puzzlePicSize;
        const sprite = this.picture.getComponent(cc.Sprite);
        const coordinate = this.coordinate;
        const rect = cc.rect(coordinate.x * picW - left, coordinate.y * picH - top, size.width, size.height);
        sprite.spriteFrame = new cc.SpriteFrame(this.texture, rect);
        this.picture.scale = isSmall ? .5 : 1;
    }

    backToBar() {
        this.changeNodeSize(true);
        this.puzzleContainer.insertChild(this.node, this.childSortIdx)
        this.changeAnimePos(this.node, cc.v2(0, -(this.puzzleContainer.height / 2 - this.node.height / 2)))
    }

    getPuzzleCenterVer2() {
        const {node: puzzle} = this;
        const {x, y} = puzzle.getPosition();
        const {width, height} = puzzle.getContentSize();
        return cc.v2(x + width / 2, y - height / 2)
    }

    initActions() {
        const {node: puzzle} = this;
        const world = cc.find("Canvas/wrap");
        const stage = cc.find("Canvas/wrap/stage");
        let isMoving = false;
        const getSortIdx = () => this.puzzleContainer.children.findIndex((node) => node === this.node);
        const touchStart = (event: cc.Touch) => {
            const inTheBar = this.puzzleContainer.children.includes(puzzle);
            //如果在移动中 或者 不在bar中 则不运行touchstart
            if (isMoving || !inTheBar) return;

            this.childSortIdx = getSortIdx();
            this.changeNodeSize()
            //加入世界坐标
            console.log()
            puzzle.setPosition(convertToWorldPos(event.getLocationInView(), puzzle.getContentSize()));
            puzzle.parent = world;
        };
        puzzle.on(EventType.TOUCH_MOVE, (event: cc.Touch) => {
            const pos = this.puzzleContainer.convertToNodeSpaceAR(event.getLocation());
            const outTheBar = -pos.y < 0;
            if (!outTheBar) return;
            puzzle.zIndex = 99;
            puzzle.opacity = 128;
            touchStart(event);
            isMoving = true;
            const delta = event.getDelta();
            puzzle.x += delta.x;
            puzzle.y += delta.y;
        })
        puzzle.on(EventType.TOUCH_END, (event) => {
            if (!isMoving) return;
            puzzle.opacity = 255;
            puzzle.zIndex = 0;
            isMoving = false;
            //如果已经加入stage
            const inTheStage = puzzle.parent === stage;
            if (inTheStage) return this.changeAnimePos(puzzle, this.calculatePos());
            //如果还没加入stage
            const IN_STAGE = stage.getBoundingBox().contains(this.getPuzzleCenterVer2());
            if (!IN_STAGE) return this.backToBar();
            //TODO 有问题
            let pos = convertToNodePos(stage, puzzle);
            puzzle.setPosition(pos);
            puzzle.parent = stage;
            return this.changeAnimePos(puzzle, this.calculatePos());
        });
    }

    /***
     * 计算出应该在范围内的pos
     */
    calculatePos() {
        const puzzle = this.node;
        const {width, height} = this.puzzlePicSize;
        const {left, top} = this.dirDict;
        let x = Math.round(puzzle.x / width);
        x = Math.min(Math.max(0, x), 1)
        let y = Math.round(puzzle.y / height)
        y = Math.min(Math.max(-2, y), 0)
        return cc.v2(width * x - left, height * y + top)
    }

    changeAnimePos(node: cc.Node, pos: cc.Vec2) {
        anime({
            targets: node,
            x: pos.x,
            y: pos.y,
            scale: {
                value: [.95, 1],
                delay: 50
            },
            easing: "linear",
            duration: 100
        })
    }


}
