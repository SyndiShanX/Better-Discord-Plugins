/**
 * @name MemberCounter
 * @author SyndiShanX, imafrogowo
 * @description Displays the Member Count of a Server at the top of the Member List (Can be Styled using .member-counter-wrapper, .member-counter-text, .offline-member-counter, .online-member-counter, and dm-counter).
 * @version 2.0.5
 * @invite yzYKRKeWNh
 * @source https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/
 * @updateUrl https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/MemberCounter.plugin.js
 * @website https://syndishanx.github.io/Better-Discord-Plugins/
 */

const { Webpack: {getModule, getStore, Filters}, React, Patcher } = BdApi;

class MemberCounter {
  constructor() {
		this.patches = [];
		this.MenuItems = {...getModule((m) => m.MenuRadioItem)};
  }
  addPatch(patchType, moduleToPatch, functionName, callback) {
		this.patches.push(Patcher[patchType]('MemberCount', moduleToPatch, functionName, callback));
  }
  start() {
		// Fetch the MemberList Element using React Filters
		const MemberList =  getModule(Filters.byKeys('ListThin'));
		this.addPatch('after', MemberList.ListThin, 'render', (thisObj, [args], returnVal) => {
			// Fetch the Various Stores and Member Counts using BdApi
			const SelectedGuildStore = getStore('SelectedGuildStore')
			const GuildMemberCountStore = getStore('GuildMemberCountStore')
			const SelectedChannelStore = getStore('SelectedChannelStore')
			const ChannelStore = getStore('ChannelStore')
			const { groups } = getStore("ChannelMemberStore").getProps(SelectedGuildStore.getGuildId(), SelectedChannelStore.selectedChannelId);
			var MemberCount = GuildMemberCountStore.getMemberCount(SelectedGuildStore.getGuildId());
			const OnlineMemberCount = groups.filter(group => group.id == "online")[0];
			const DMCount = getStore("PrivateChannelSortStore").getSortedChannels()[1];
			// Check if the Currently Selected Channel is a Thread, Don't Render Offline Counter if True 
			const currentSelectedChannel = ChannelStore.getChannel(SelectedChannelStore.getChannelId())
			const ThreadBasedOnlineMembers = currentSelectedChannel?.memberCount || OnlineMemberCount?.count;
			var OfflineCount = parseInt(MemberCount) - parseInt(OnlineMemberCount?.count)
			var offlineCounter = ''
			if (String(OfflineCount).toLowerCase() != 'nan') {
				if (currentSelectedChannel?.threadMetadata != undefined) {
					if (currentSelectedChannel.memberCount == 50) {
						MemberCount = '50+'
					} else {
						MemberCount = currentSelectedChannel.memberCount
					}
					OfflineCount = parseInt(OnlineMemberCount?.count) - parseInt(MemberCount)
				} else {
					offlineCounter = React.createElement("div", {
							className: "member-counter-wrapper",
							style: { textAlign: "center" },
						},
						React.createElement("h1", {
								className: "member-counter-text offline-member-counter membersGroup-2eiWxl container-q97qHp",
								style: { color: "var(--channels-default)", fontWeight: "bold" },
							},
							`🔴 Offline - ` + OfflineCount
						)
					);
				}
			}
			// Check if Offline Counter is Defined and Set Bottom Margin Accordingly
			if (offlineCounter != '') {
				var onlineCounter = React.createElement("div", {
						className: "member-counter-wrapper",
						style: { textAlign: "center", marginBottom: "-10px" },
					},
					React.createElement("h1", {
							className: "member-counter-text online-member-counter membersGroup-2eiWxl container-q97qHp",
							style: { color: "var(--channels-default)", fontWeight: "bold" },
						},
						`🟢 Online - ` + MemberCount
					)
				);
			} else {
				var onlineCounter = React.createElement("div", {
						className: "member-counter-wrapper",
						style: { textAlign: "center" },
					},
					React.createElement("h1", {
							className: "member-counter-text online-member-counter membersGroup-2eiWxl container-q97qHp",
							style: { color: "var(--channels-default)", fontWeight: "bold" },
						},
						`🟢 Online - ` + MemberCount
					)
				);
			}
			const dmCounter = React.createElement("div", {
					className: "member-counter-wrapper",
					style: { textAlign: "center", marginTop: "-20px" },
				},
				React.createElement("h3", {
						className: "member-counter-text dm-counter membersGroup-2eiWxl container-q97qHp",
						style: { color: "var(--channels-default)", fontWeight: "bold" },
					},
					`🟢 DMs - ${DMCount?.length}`
				)
			);
			const counterWrapper = MemberCount?.toLocaleString() !== undefined ? (
				React.createElement("div", null, onlineCounter, offlineCounter)
			) : (
				React.createElement("div", {
						className: "dmcounter-wrapper",
						style: { textAlign: "center" },
					},
					dmCounter
				)
			);
			
			// Debug Logs
			//console.log(returnVal)
			//console.log(returnVal.props.className)
			
			// Append Counter Elements | Selects Member List | Selects DM List
			if (returnVal.props.className.startsWith('members')) {
				const children = returnVal.props.children;
				children.splice(0, 0, counterWrapper);
				returnVal.props.children = children;
			} else if (returnVal.props.id != 'channels') {
				const children = returnVal.props.children[0].props.children.props.children;
				children.splice(1, 0, counterWrapper);
				returnVal.props.children[0].props.children.props.children = children;
			}
		});
  }
  stop() {
		this.patches.forEach((x) => x());
  }
}

module.exports = MemberCounter