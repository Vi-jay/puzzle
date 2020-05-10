import EventType = cc.Node.EventType;
import * as anime from "animejs";
import Vec2 = cc.Vec2;
import {convertToNodePos, convertToWorldPos} from "./utils/common";
import PuzzleBar from "./puzzle-bar";
import * as _ from "lodash";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Block extends cc.Component {
    @property({type: cc.Node})
    picture: cc.Node;
    puzzleBar: PuzzleBar;
    //额定每块大小
    puzzlePicSize = cc.size(300, 300);
    nodeSize = cc.size(300, 300);
    smallSize = cc.size(200, 200);
    texture: cc.Texture2D
    xy: cc.Vec2;
    puzzleContainer: cc.Node;
    idx: number;
    init(texture: cc.Texture2D, xy: cc.Vec2, puzzleBar: PuzzleBar, idx: number) {
        this.puzzleBar = puzzleBar;
        this.texture = texture;
        this.xy = xy;
        this.idx = idx;
        this.puzzleContainer = this.node.parent;
        this.changeNodeSize(this.smallSize);
        //如果是突出的就加大
        // if (isSpecial) {
        //     this.node.width += 50;
        //     this.node.height += 50
        // }
        return this.node;
    }
    onLoad() {
        this.initActions();
    }
    changeNodeSize(size: cc.Size) {
        this.node.setContentSize(size);
        this.picture.setContentSize(size);
        const {width, height} = this.puzzlePicSize;
        const sprite = this.picture.getComponent(cc.Sprite);
        const xy = this.xy;
        sprite.spriteFrame = new cc.SpriteFrame(this.texture, cc.rect(xy.x * width, xy.y * height, this.node.width, this.node.height));
    }
    backToBar() {
        this.changeNodeSize(this.smallSize);
        this.puzzleContainer.insertChild(this.node, this.idx)
        this.node.setPosition(0, -(125 - this.node.height / 2));
    }
    initActions() {
        const {node: puzzle} = this;
        let preParent;
        const world = cc.find("Canvas/wrap");
        const stage = cc.find("Canvas/wrap/stage");
        let isMoving= false;
        const touchStart = () => {
            preParent = puzzle.parent;
            puzzle.zIndex = 99;
            puzzle.opacity = 128;
            if (preParent !== this.puzzleContainer) return;
            //放大
            this.changeNodeSize(this.nodeSize)
            //加入世界坐标
            puzzle.setPosition(convertToWorldPos(puzzle));
            puzzle.parent = world;
        };
        puzzle.on(EventType.TOUCH_MOVE, (event: cc.Touch) => {
            const pos = this.puzzleContainer.convertToNodeSpaceAR(event.getLocation());
            if (-pos.y>0)return;
            touchStart();
            isMoving=true;
            const delta = event.getDelta();
            puzzle.x += delta.x;
            puzzle.y += delta.y;
        })
        //TODO 判断双击的情况
        puzzle.on(EventType.TOUCH_END, (event) => {
            puzzle.opacity = 255;
            puzzle.zIndex = 0;
            //加入stage
            if (puzzle.parent !== stage) {
                const IN_STAGE = stage.getBoundingBox().contains(puzzle.getPosition());
                if (!IN_STAGE) return this.backToBar();
                let pos = convertToNodePos(stage, puzzle);
                puzzle.setPosition(pos);
                puzzle.parent = stage;
            }
            puzzle.setPosition(this.calculatePos())
        });
        puzzle.on(EventType.TOUCH_CANCEL, (event) => {
            if (!isMoving)return ;
            puzzle.opacity = 255;
            puzzle.zIndex = 0;
            isMoving=false;
            //加入stage
            if (puzzle.parent !== stage) {
                const IN_STAGE = stage.getBoundingBox().contains(puzzle.getPosition());
                if (!IN_STAGE) return this.backToBar();
                let pos = convertToNodePos(stage, puzzle);
                puzzle.setPosition(pos);
                puzzle.parent = stage;
            }
            puzzle.setPosition(this.calculatePos())
        })
    }
    calculatePos(){
        const puzzle = this.node;
        const x = Math.round(puzzle.x/puzzle.width)
        const y = Math.round(puzzle.y/puzzle.height)
        return cc.v2(puzzle.width*x,puzzle.height*y)
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
    private getPos2Idx(pos: cc.Vec3) {
        const {width, height} = this.puzzlePicSize;
        const xn = Math.round(Math.abs(pos.x / width));
        const yn = Math.round(Math.abs(pos.y / height));
        return [xn, yn];
    }
    start() {
    }
    update(dt) {
    }
}
