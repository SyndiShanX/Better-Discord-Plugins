/**
 * @name MemberCounter
 * @author SyndiShanX, imafrogowo
 * @description Displays the Member Count of a Server at the top of the Member List (Can be Styled using .member-counter-wrapper and .member-counter-text).
 * @version 2.0.3
 * @invite yzYKRKeWNh
 * @source https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/
 * @updateUrl https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/MemberCounter.plugin.js
 * @website https://syndishanx.github.io/Better-Discord-Plugins/
 */

const { React, getModule, Filters, Webpack, Patcher } = BdApi;

class MemberCounter {
  constructor() {
		this.patches = [];
  }
  addPatch(patchType, moduleToPatch, functionName, callback) {
		this.patches.push(Patcher[patchType]('MemberCount', moduleToPatch, functionName, callback));
  }
  start() {
		// Fetch the MemberList Element using React Filters
		const MemberList =  Webpack.getModule(Webpack.Filters.byKeys('ListThin'));
		this.addPatch('after', MemberList.ListThin, 'render', (thisObj, [args], returnVal) => {
			// Fetch the Member Count using BdApi
			const SelectedGuildStore = Webpack.getModule(Webpack.Filters.byKeys('getLastSelectedGuildId'));
			var MemberCount = Webpack.getModule(Webpack.Filters.byKeys('getMemberCounts')).getMemberCount(SelectedGuildStore.getGuildId());
			// Check if Selected Channel is a Thread and Updates MemberCount
			if (document.querySelector('.chatContent-3KubbW') != null) {
				if (document.querySelector('.chatContent-3KubbW').ariaLabel.split('thread').length == 2) {
					const threadObj = returnVal.props.children[0].props.children.props
					threadMemberCount = 0
					for (let i = 0; i < threadObj.children.length; i++) {
						if (threadObj.children[i] != null) {
							if (threadObj.children[i].props.userId != null) {
								threadMemberCount = threadMemberCount + 1
							}
						}
					}
					MemberCount = threadMemberCount
				}
			}
			// Create Counter Elements as long as MemberCount is Defined
			const counterWrapper = MemberCount?.toLocaleString() !== undefined ?
				React.createElement( 'div', {
					className: 'member-counter-wrapper',
					style: { textAlign: 'center' },
				},
					React.createElement( 'h3', {
						className: 'member-counter-text membersGroup-2eiWxl container-q97qHp',
						style: { color: 'var(--channels-default)' },
					},
					'Members - ' + MemberCount?.toLocaleString())) : null;
			// Append Counter Elements to MemberList Element
			if (returnVal.props.className.startsWith('members')) {
				//console.log(returnVal)
				const children = returnVal.props.children;
				children.splice(0, 0, counterWrapper);
				returnVal.props.children = children;
			}}
		);
  }
  stop() {
		this.patches.forEach((x) => x());
  }
}