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
    @property({type: cc.Node})
    scroller: cc.Node;
    @property({type: cc.Prefab})
    blockPrefab: cc.Prefab;


    blockGrid: cc.Node[][] = [];
    blockCmp = [dir({bottom: 1, right: 1}), dir({bottom: 1}), dir({right: 1})
        , dir(), dir({top: 1}), dir({left: 1, top: 1})];

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
                ins.init(this.picture, new cc.Vec2(x, y), idx, this.blockCmp[idx],this.scroller);
                idx++;
                blockNode.setPosition(0, -(125 - blockNode.height / 2));
            })
        })
    }

    start() {
    }

    update(dt) {
    }
}
