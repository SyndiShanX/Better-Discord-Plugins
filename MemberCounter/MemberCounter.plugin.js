/**
 * @name MemberCounter
 * @author SyndiShanX, imafrogowo
 * @description Displays the Member Count of a Server at the top of the Member List (Can be Styled using .member-counter-wrapper and .member-counter-text).
 * @version 2.0.2
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
		this.patches.push(Patcher[patchType]("MemberCount", moduleToPatch, functionName, callback));
  }
  start() {
		// Fetch the MemberList Element using React Filters
		const MemberList = findModuleByProps("ListThin");
		this.addPatch("after", MemberList.ListThin, "render", (thisObj, [args], returnVal) => {
			// Fetch the Member Count using BdApi
			const SelectedGuildStore = findModuleByProps("getLastSelectedGuildId");
			const MemberCount = findModuleByProps("getMemberCounts").getMemberCount( SelectedGuildStore.getGuildId() );
			// Create Counter Elements as long as MemberCount is Defined
			const counterWrapper = MemberCount?.toLocaleString() !== undefined ?
				React.createElement( "div", {
					className: "member-counter-wrapper",
					style: { textAlign: "center" },
				},
					React.createElement( "h3", {
						className: "member-counter-text membersGroup-2eiWxl container-q97qHp",
						style: { color: "var(--channels-default)" },
					},
					"Members - " + MemberCount?.toLocaleString())) : null;
			// Append Counter Elements to MemberList Element
			if (returnVal.props.className.startsWith('members')) {
				const children = returnVal.props.children[0].props.children.props.children;
				children.splice(1, 0, counterWrapper);
				returnVal.props.children[0].props.children.props.children = children;
			}}
		);
  }
  stop() {
		this.patches.forEach((x) => x());
  }
}