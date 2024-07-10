"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, {
    width: 400,
    height: 400,
});
let updateTimeout = 0;
let updateCounter = 0;
let prevMsg = '';
function update() {
    clearTimeout(updateTimeout);
    const selection = figma.currentPage.selection;
    const node = selection.length === 1 ? selection[0] : null;
    const msg = {
        node: node === null || node.type !== 'VECTOR' ? null : {
            id: node.id,
            vectorNetwork: node.vectorNetwork,
        },
    };
    const msgStr = JSON.stringify(msg);
    if (msgStr !== prevMsg) {
        prevMsg = msgStr;
        figma.ui.postMessage(msg);
        updateCounter = 0;
    }
    const timeout = updateCounter++ < 20 ? 16 : 250;
    updateTimeout = setTimeout(update, timeout);
}

figma.on('selectionchange', update);

update();

figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.node) {
        const node = yield figma.getNodeByIdAsync(msg.node.id);
        if (node !== null && node.type === 'VECTOR') {
            yield node.setVectorNetworkAsync(msg.node.vectorNetwork);
        }
    }
    if (msg.type === 'open-url') {
        figma.openExternal(msg.url);
    }
});
