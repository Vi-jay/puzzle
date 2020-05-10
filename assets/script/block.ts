import EventType = cc.Node.EventType;
import * as anime from "animejs";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Block extends cc.Component {
    @property({type: cc.Node})
    picture: cc.Node;
    blockGrid: cc.Node[][];
    //额定每块大小
    puzzlePicSize = cc.size(300, 300);
    nodeSize = cc.size(300, 300);
    init(texture: cc.Texture2D, xy: cc.Vec2, blockGrid: cc.Node[][], isSpecial) {
        this.blockGrid = blockGrid;
        this.node.setContentSize(this.nodeSize);
        //如果是突出的就加大
        if (isSpecial) {
            this.node.width += 50;
            this.node.height += 50
        }
        const {width, height} = this.puzzlePicSize;
        const sprite = this.picture.getComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(texture, cc.rect(xy.x * width, xy.y * height, this.node.width, this.node.height));
        this.node.setPosition(xy.x * width, -xy.y * height);
        return this.node;
    }
    onLoad() {
        const {node: puzzle} = this;
        const {width, height} = this.puzzlePicSize;
        let startPos;
        puzzle.on(EventType.TOUCH_START, (event) => {
            startPos = puzzle.position.clone();
            puzzle.zIndex = 1;
            puzzle.opacity = 128;
        })
        puzzle.on(EventType.TOUCH_MOVE, (event: cc.Touch) => {
            const delta = event.getDelta();
            puzzle.x += delta.x;
            puzzle.y += delta.y;
        })
        puzzle.on(EventType.TOUCH_END, (event) => {
            puzzle.opacity = 255;
            puzzle.zIndex = 0;
            const [targetX, targetY] = this.getPos2Idx(puzzle.position)
            if (!this.blockGrid[targetY] || !this.blockGrid[targetY][targetX])
                return this.changeAnimePos(puzzle, startPos);
            const exchangeNode = this.blockGrid[targetY][targetX];
            this.changeAnimePos(exchangeNode, startPos);
            this.changeAnimePos(puzzle, new cc.Vec2(targetX * width, -targetY * height));
            this.blockGrid[targetY][targetX] = puzzle;
            const [startX, startY] = this.getPos2Idx(startPos)
            this.blockGrid[startY][startX] = exchangeNode;
        })
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
