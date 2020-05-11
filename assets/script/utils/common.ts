
export function convertToNodePos(container: cc.Node, curNode: cc.Node) {
    let pos = curNode.convertToNodeSpaceAR(container.position);
    const size = curNode.getContentSize();
    const {width, height} = container.getContentSize();
    const y = height / 2 - Math.abs(pos.y);
    const x = width / 2 - Math.abs(pos.x);
    return cc.v2(-x - size.width / 4, -y - size.height / 2);
}
export function covertToWorldPos(node: cc.Node) {
    const pos = node.convertToWorldSpaceAR(cc.v2());
    const {width, height} = cc.winSize;
    return pos.sub(cc.v2(width / 2, height / 2));
}
export function getTouchGlobalPos(touch: cc.Touch) {
    const {width, height} = cc.winSize;
    const pos = touch.getLocation();
    return pos.sub(cc.v2(width / 2, height / 2));
}
export function covertToNodePos(targetContainer: cc.Node, worldPoint: cc.Vec2) {
    const {width, height} = cc.winSize;
    const pos = cc.v2(width / 2, height / 2).sub(cc.v2(-worldPoint.x, -worldPoint.y));
    //计算出屏幕上（以左上角为原点计算）一个点相距本节点anchor的距离
    return targetContainer.convertToNodeSpaceAR(pos)
}