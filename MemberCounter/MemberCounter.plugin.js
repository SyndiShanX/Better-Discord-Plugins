/**
 * @name MemberCounter
 * @author SyndiShanX, imafrogowo
 * @description Displays the Member Count of a Server at the top of the Member List (Can be Styled using .member-counter-wrapper and .member-counter-text).
 * @version 2.0.1
 * @invite yzYKRKeWNh
 * @source https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/
 * @updateUrl https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/MemberCounter.plugin.js
 * @website https://syndishanx.github.io/Better-Discord-Plugins/
 */

const { React, findModuleByProps, Patcher } = BdApi;

class MemberCounter {
	constructor() {
		this.patches = [];
	}
	addPatch(patchType, moduleToPatch, functionName, callback) {
		this.patches.push(
			Patcher[patchType]("MemberCount", moduleToPatch, functionName, callback)
		);
	}
	start() {
		const MemberList = findModuleByProps("ListThin");
		this.addPatch("after", MemberList.ListThin, "render", (that, [args], ret) => {
				const SelectedGuildStore = findModuleByProps("getLastSelectedGuildId");
				var membersNum = findModuleByProps('getMemberCounts').getMemberCount(SelectedGuildStore.getGuildId());
				if (membersNum == null) {membersNum = '0'}
				const counterWrapper = React.createElement("div", {
						className: "member-counter-wrapper",
						style: { textAlign: "center" },
					},
					React.createElement("h3", {
						className: "member-counter-text membersGroup-2eiWxl container-q97qHp",
						style: { color: "var(--channels-default)" },
					},
					"Members - " + membersNum.toLocaleString())
				);
				const children = ret.props.children[0].props.children.props.children
				children.splice(1,0,counterWrapper)
				ret.props.children[0].props.children.props.children = children
			}
		);
		document.querySelectorAll('.content-yjf30S')[2].style.height = document.querySelectorAll('.content-yjf30S')[2].style.height.split('px')[0] + '40px';
	}
	stop() {
		this.patches.forEach((x) => x());
	}
}