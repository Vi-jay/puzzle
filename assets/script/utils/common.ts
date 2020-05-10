export function convertToWorldPos(curNode: cc.Node) {
    const pos = curNode.convertToWorldSpaceAR(cc.v2(0, 0));
    const {width, height} = curNode;
    const y = -pos.y - height / 2 ;
    const x = pos.x - width * 1.5;
    return cc.v2(x, y)
}
export function convertToNodePos(container:cc.Node,curNode: cc.Node) {
    let pos = container.convertToNodeSpaceAR(curNode.position);
    const {width,height} = cc.winSize;
    return cc.v3(width / 2 - Math.abs(pos.x),
        height / 2 - Math.abs(pos.y) + curNode.height / 2);
}