import Block from "./block";
import {flatten} from "lodash";

const {ccclass, property} = cc._decorator;
export type DirDict = { top: number, right: number, bottom: number, left: number }
function dir({top = 0, right = 0, bottom = 0, left = 0} = {}): DirDict {
    const obj = {top, right, bottom, left};
    return Object.entries(obj).reduce((dict, [key, val]) => {
        dict[key] = val * 70;
        return dict as any;
    }, {})
}
@ccclass
export default class PuzzleBar extends cc.Component {
    @property({type: cc.Texture2D})
    picture: cc.Texture2D;
    @property({type: cc.Prefab})
    blockPrefab: cc.Prefab;
    //每个碎片的突角
    blockCmp = [dir({bottom: 1, right: 1}), dir({bottom: 1}), dir({right: 1})
        , dir(), dir({top: 1}), dir({left: 1, top: 1})];
    onLoad() {
        this.node.parent.parent.zIndex = 10;
        let idx = 0;
        const stageGrid = [];
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 2; x++) {
                const blockNode = cc.instantiate(this.blockPrefab);
                this.node.addChild(blockNode);
                blockNode.getComponent(Block).init(this.picture, new cc.Vec2(x, y), idx, this.blockCmp[idx++], stageGrid);
                blockNode.setPosition(0, -(this.node.height / 2 - blockNode.height / 2));
            }
        }
        this.node.getComponent(cc.Layout).updateLayout()
    }
    start() {
    }
    update(dt) {
    }
}
