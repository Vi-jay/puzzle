export function convertToWorldPos(curPos: cc.Vec2, size: cc.Size) {
    const pos = curPos;
    const {width, height} = cc.winSize;
    const y = pos.y - height / 2;
    const x = width / 2 - Math.abs(pos.x);
    return cc.v2(-x - size.width / 2, -y + size.height / 2)
}

export function convertToNodePos(container: cc.Node, curNode: cc.Node) {
    let pos = curNode.convertToNodeSpaceAR(container.position);
    const size = curNode.getContentSize();
    const {width, height} = container.getContentSize();
    const y = height / 2 - Math.abs(pos.y);
    const x = width / 2 - Math.abs(pos.x);
    return cc.v2(-x - size.width / 4, -y - size.height / 2);
}