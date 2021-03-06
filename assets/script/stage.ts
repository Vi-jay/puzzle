import Block from "./block";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Stage extends cc.Component {
    @property({type: cc.Texture2D})
    picture: cc.Texture2D;
    @property({type: cc.Prefab})
    blockPrefab: cc.Prefab;

    onLoad() {
    }
    start() {
    }
    update(dt) {
    }
}
