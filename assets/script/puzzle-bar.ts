import Block from "./block";
import {flatten} from "lodash";

const {ccclass, property} = cc._decorator;
@ccclass
export default class PuzzleBar extends cc.Component {
    @property({type: cc.Texture2D})
    picture: cc.Texture2D;
    @property({type: cc.Prefab})
    blockPrefab: cc.Prefab;
    blockGrid: cc.Node[][] = [];
    onLoad() {
        for (let y = 0; y < 3; y++) {
            this.blockGrid[y] = [];
            for (let x = 0; x < 2; x++) {
                const blockNode = cc.instantiate(this.blockPrefab);
                this.blockGrid[y].push(blockNode);
                this.node.addChild(blockNode);
            }
        }
        this.updateChildrenLayout();
        this.node.getComponent(cc.Layout).updateLayout()
    }
    updateChildrenLayout() {
        let idx = 0;
        this.blockGrid.forEach((blockList, y) => {
            blockList.forEach((blockNode, x) => {
                if (!blockNode) return;
                const ins = blockNode.getComponent(Block);
                ins.init(this.picture, new cc.Vec2(x, y), this, idx++);
                blockNode.setPosition(0, -(125 - blockNode.height / 2));
            })
        })
    }
    start() {
    }
    update(dt) {
    }
}
