/**
 * @name MemberCounter
 * @author SyndiShanX
 * @description Displays the Member Count of a Server at the top of the Member List (Can be Styled using .member-counter-wrapper and .member-counter-text).
 * @version 1.1.2
 */

const {Patcher, ReactUtils} = new BdApi("MemberCounter");

function createCounter() {
	if ( document.getElementsByClassName('members-3WRCEx')[0] != undefined ) {
		if ( document.getElementsByClassName('member-counter-wrapper')[0] == undefined ) {
			const membersWrap = document.getElementsByClassName('members-3WRCEx')[0];
			const SelectedGuildStore = BdApi.findModuleByProps('getLastSelectedGuildId');
			var membersNum = BdApi.findModuleByProps('getMemberCounts').getMemberCount(SelectedGuildStore.getGuildId());
			
			const counterWrapper = document.createElement('div');
			counterWrapper.className = 'member-counter-wrapper';
			counterWrapper.style.textAlign = 'center';
			
			const counterNum = document.createElement('h3');
			counterNum.className = 'member-counter-text membersGroup-2eiWxl container-q97qHp';
			counterNum.textContent = 'Members - ' + membersNum.toLocaleString();
			counterNum.style.color = 'var(--channels-default)';
			counterWrapper.append(counterNum);
			
			membersWrap.prepend(counterWrapper);
		}
	}
}

Utilities: {
	var onceAdded = (selector, callback) => {
		let directMatch;
		if (directMatch = document.querySelector(selector)) {
			callback(directMatch);
			return () => null;
		}
		const cancel = () => observer.disconnect();
		const observer = new MutationObserver(changes => {
			for (const change of changes) {
				if (!change.addedNodes.length) continue;
				for (const node of change.addedNodes) {
					const match = (node.matches(selector) && node) || node.querySelector(selector);
					if (!match) continue;
					cancel();
					callback(match);
				}
			}
		});
		observer.observe(document.getElementsByClassName('membersWrap-3NUR2t')[0], {childList: false, subtree: true});
	};
}

function walk(node, filter, {max = 200} = {}) {
	const fiber = node[Object.keys(node).find(e => e.indexOf("__reactFiber") === 0)];
	if (!fiber) return null;
	let curr = fiber, i = 0;
	while(curr !== null && i++ < max) {
		if (filter(curr)) break;
		curr = curr?.return;
	}
	return curr;
}

const membersWrap = document.querySelector('.members-3WRCEx')

module.exports = () => ({
	start() {
		this.patchTextAreaButtons();
	},
	async patchTextAreaButtons() {
		onceAdded('.members-3WRCEx', e => {
			const vNodeTest = ReactUtils.getInternalInstance(e);
			if (!vNodeTest) return;
			const vNode = walk(membersWrap, vnode => vnode?.stateNode?.isReactComponent && vnode.stateNode.trackMemberListViewed)?.stateNode;
			Patcher.after(vNode.constructor.prototype, "render", () => {
				createCounter()
			});
		});
	},
	stop() {
		if (document.getElementsByClassName('member-counter-wrapper')[0] != undefined) {
			document.getElementsByClassName('member-counter-wrapper')[0].remove();
		}
  }
});