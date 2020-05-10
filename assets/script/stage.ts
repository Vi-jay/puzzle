import Block from "./block";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Stage extends cc.Component {
    @property({type: cc.Texture2D})
    picture: cc.Texture2D;
    @property({type: cc.Prefab})
    blockPrefab: cc.Prefab;

    onLoad() {
        const blockGrid = [];
        for (let y = 0; y < 3; y++) {
            blockGrid[y] = [];
            for (let x = 0; x < 2; x++) {
                const blockNode = cc.instantiate(this.blockPrefab)
                    .getComponent(Block)
                    .init(this.picture, new cc.Vec2(x, y),blockGrid,false);
                this.node.addChild(blockNode);
                blockGrid[y].push(blockNode);
            }
        }
        this.node.getComponent(cc.Layout).updateLayout()
        console.log(this.node.width)
        this.node.x = -this.node.width/2;
    }
    start() {
    }
    update(dt) {
    }
}
