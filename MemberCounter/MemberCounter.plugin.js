/**
 * @name MemberCounter
 * @author SyndiShanX, imafrogowo
 * @description Displays the Member Count of a Server at the top of the Member List, can be configured to show Total Members, Online Members, Offline Members, and a DM Counter.
 * @version 2.24
 * @invite yzYKRKeWNh
 * @source https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/
 * @website https://syndishanx.github.io/Better-Discord-Plugins/
 */

const { Webpack: {getModule, getStore, Filters}, React, Patcher, Utils } = BdApi;

// Set Default Settings
const userSettings = {
	showTotalCounter: true,
	showOnlineCounter: true,
	showOfflineCounter: true,
	showDMsCounter: true
};

class MemberCounter {
  constructor() {
		this.patches = [];
		this.MenuItems = {...getModule((m) => m.MenuRadioItem)};
  }
  addPatch(patchType, moduleToPatch, functionName, callback) {
		this.patches.push(Patcher[patchType]('MemberCount', moduleToPatch, functionName, callback));
  }
  start() {
		Object.assign(userSettings, BdApi.Data.load("MemberCounter", "settings"));
		// Fetch the MemberList Element using React Filters
		const MemberList = getModule(Filters.byKeys('ListThin'));
		this.addPatch('after', MemberList.ListThin, 'render', (thisObj, [args], returnVal) => {
			// Fetch the Various Stores and Member Counts using BdApi
			const SelectedGuildStore = getStore('SelectedGuildStore')
			const GuildMemberCountStore = getStore('GuildMemberCountStore')
			const SelectedChannelStore = getStore('SelectedChannelStore')
			const ChannelStore = getStore('ChannelStore')
			const { groups } = getStore("ChannelMemberStore").getProps(SelectedGuildStore.getGuildId(), SelectedChannelStore.getCurrentlySelectedChannelId());
			var MemberCount = GuildMemberCountStore.getMemberCount(SelectedGuildStore.getGuildId());
			const DMCount = getStore("PrivateChannelSortStore").getSortedChannels()[1];
			// Fetch all Roles and add them together for a Pseudo Count
			var OnlineMembersCounted = 0
			for (let i = 0; i < groups.filter(group => group.id).length; i++) {
				if ( groups.filter(group => group.id)[i].id != 'offline') {
					OnlineMembersCounted = OnlineMembersCounted + groups.filter(group => group.id)[i].count
				}
			}
			// Check if the Currently Selected Channel is a Thread, Don't Render Offline Counter if True 
			var OfflineCount = parseInt(MemberCount) - parseInt(OnlineMembersCounted)
			var offlineCounter = ''
			if (String(OfflineCount).toLowerCase() != 'nan') {
				if (ChannelStore.getChannel(SelectedChannelStore.getChannelId()).threadMetadata != undefined) {
					const threadMembers = Object.entries(getStore("ThreadMemberListStore").getMemberListSections(SelectedChannelStore.getCurrentlySelectedChannelId()))
					var OnlineThreadMembersCounted = 0
					var OfflineThreadMembersCounted = 0
					// Fetch all Roles in the current Thread Channel and add them together for a Pseudo Count
					for (let i = 0; i < threadMembers.length; i++) {
						if ( threadMembers[i][0] != 'offline') {
							OnlineThreadMembersCounted = OnlineThreadMembersCounted + threadMembers[i][1]['userIds'].length
						} else {
							OfflineThreadMembersCounted = OfflineThreadMembersCounted + threadMembers[i][1]['userIds'].length
						}
					}
					MemberCount = OnlineThreadMembersCounted + OfflineThreadMembersCounted
					OfflineCount = parseInt(OfflineThreadMembersCounted)
				}
			}
			var offlineCounterStyle = {}
			if (userSettings.showOfflineCounter == false) {
				offlineCounterStyle = { color: "var(--channels-default)", fontWeight: "bold", display: "none", padding: "24px 8px 0 16px", height: "40px", boxSizing: "border-box", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", textTransform: "uppercase", fontSize: "12px", lineHeight: "16px", letterSpacing: ".02em", fontFamily: "var(--font-display)", fontWeight: "600", flex: "1 1 auto", color: "var(--channels-default)" }
			} else {
				offlineCounterStyle = { color: "var(--channels-default)", fontWeight: "bold", padding: "24px 8px 0 16px", height: "40px", boxSizing: "border-box", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", textTransform: "uppercase", fontSize: "12px", lineHeight: "16px", letterSpacing: ".02em", fontFamily: "var(--font-display)", fontWeight: "600", flex: "1 1 auto", color: "var(--channels-default)" }
			}
			offlineCounter = React.createElement("div", {
					className: "member_counter_wrapper",
					style: { textAlign: "center" },
				},
				React.createElement("h1", {
						className: "member_counter_text offline_member_counter",
						style: offlineCounterStyle,
					},
					`🔴 Offline - ` + OfflineCount.toLocaleString()
				)
			);
			var totalCounterStyle = {}
			// Check if Total Counter is Enabled
			if (userSettings.showTotalCounter != false) {
				// Check if MemberCount is Defined and Set Bottom Margin Accordingly
				if (MemberCount != undefined) {
					// Check if Offline Counter is Defined and Set Bottom Margin Accordingly
					if (userSettings.showOnlineCounter == false && userSettings.showOfflineCounter == false) {
						totalCounterStyle = { textAlign: "center", marginBottom: "0px" }
					} else {
						totalCounterStyle = { textAlign: "center", marginBottom: "-10px" }
					}
					var totalCounter = React.createElement("div", {
							className: "member_counter_wrapper",
							style: totalCounterStyle,
						},
						React.createElement("h1", {
								className: "member_counter_text total_member_counter",
								style: { color: "var(--channels-default)", fontWeight: "bold", padding: "24px 8px 0 16px", height: "40px", boxSizing: "border-box", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", textTransform: "uppercase", fontSize: "12px", lineHeight: "16px", letterSpacing: ".02em", fontFamily: "var(--font-display)", fontWeight: "600", flex: "1 1 auto", color: "var(--channels-default)" },
							},
							`🔵 Total Members - ` + MemberCount.toLocaleString()
						)
					);
				}
			}
			var onlineCounterStyle = {}
			// Check if Online Counter is Enabled
			if (userSettings.showOnlineCounter != false) {
				// Check if Offline Counter is Defined and Set Bottom Margin Accordingly
				if (userSettings.showOfflineCounter == false) {
					onlineCounterStyle = { textAlign: "center", marginBottom: "0px" }
				} else {
					onlineCounterStyle = { textAlign: "center", marginBottom: "-10px" }
				}
				if (offlineCounter != '') {
					var OnlineMembersFinal = ''
					if (OnlineThreadMembersCounted != undefined) {
						OnlineMembersFinal = OnlineThreadMembersCounted.toLocaleString()
					} else {
						OnlineMembersFinal = OnlineMembersCounted.toLocaleString()
					}
					var onlineCounter = React.createElement("div", {
							className: "member_counter_wrapper",
							style: onlineCounterStyle,
						},
						React.createElement("h1", {
								className: "member_counter_text online_member_counter",
								style: { color: "var(--channels-default)", fontWeight: "bold", padding: "24px 8px 0 16px", height: "40px", boxSizing: "border-box", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", textTransform: "uppercase", fontSize: "12px", lineHeight: "16px", letterSpacing: ".02em", fontFamily: "var(--font-display)", fontWeight: "600", flex: "1 1 auto", color: "var(--channels-default)" },
							},
							`🟢 Online - ` + OnlineMembersFinal
						)
					);
				} else if (MemberCount != null) {
					var onlineCounter = React.createElement("div", {
							className: "member_counter_wrapper",
							style: { textAlign: "center" },
						},
						React.createElement("h1", {
								className: "member_counter_text online_member_counter",
								style: { color: "var(--channels-default)", fontWeight: "bold", padding: "24px 8px 0 16px", height: "40px", boxSizing: "border-box", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", textTransform: "uppercase", fontSize: "12px", lineHeight: "16px", letterSpacing: ".02em", fontFamily: "var(--font-display)", fontWeight: "600", flex: "1 1 auto", color: "var(--channels-default)" },
							},
							`🟢 Members - ` + MemberCount.toLocaleString()
						)
					);
				}
			}
			var dmCounterStyle = {}
			if (userSettings.showDMsCounter == false) {
				dmCounterStyle = { color: "var(--channels-default)", fontWeight: "bold", display: "none", padding: "24px 8px 0 16px", height: "40px", boxSizing: "border-box", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", textTransform: "uppercase", fontSize: "12px", lineHeight: "16px", letterSpacing: ".02em", fontFamily: "var(--font-display)", fontWeight: "600", flex: "1 1 auto", color: "var(--channels-default)" }
			} else {
				dmCounterStyle = { color: "var(--channels-default)", fontWeight: "bold", padding: "24px 8px 0 16px", height: "40px", boxSizing: "border-box", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", textTransform: "uppercase", fontSize: "12px", lineHeight: "16px", letterSpacing: ".02em", fontFamily: "var(--font-display)", fontWeight: "600", flex: "1 1 auto", color: "var(--channels-default)" }
			}
			const dmCounter = React.createElement("div", {
					className: "member_counter_wrapper",
					style: { textAlign: "center", marginTop: "-20px", marginBottom: "15px" },
				},
				React.createElement("h3", {
						className: "member_counter_text dm_counter",
						style: dmCounterStyle,
					},
					`DMs - ${DMCount?.length.toLocaleString()}`
				)
			);
			const counterWrapper = MemberCount?.toLocaleString() !== undefined ? (
				React.createElement("div", null, totalCounter, onlineCounter, offlineCounter)
			) : (
				React.createElement("div", {
						className: "dm_counter_wrapper",
						style: { textAlign: "center" },
					},
					dmCounter
				)
			);
			
			// Debug Logs
			//console.log(returnVal)
			//console.log(returnVal.props.className)
			
			// Append Counter Elements | Selects Member List | Selects DM List
			if (!returnVal.props.className.startsWith('voter')) {
				if (returnVal.props.className.startsWith('members')) {
					const children = returnVal.props.children;
					children.splice(0, 0, counterWrapper);
					returnVal.props.children = children;
				} else if (returnVal.props.id != 'channels' && returnVal.props.role != 'list') {
					const children = returnVal.props.children[0].props.children.props.children;
					children.splice(1, 0, counterWrapper);
					returnVal.props.children[0].props.children.props.children = children;
				}
			}
		});
  }
  stop() {
		this.patches.forEach((x) => x());
  }
	getSettingsPanel() {
    const settingsPanelWrapper = document.createElement("div");
    settingsPanelWrapper.style = 'padding-top: 32px;'
		
		const settingsDivider = document.createElement("div");
    settingsDivider.className = 'bd-setting-divider'
    settingsDivider.style = 'position: relative; top: -2em;'
		
		settingsPanelWrapper.append(settingsDivider);
		
		const Switch = BdApi.Webpack.getByKeys("Switch", "Button").Switch;
		
		function createSetting(settingDescription, settingKey, switchState) {
			const settingWrapper = document.createElement("div");
			settingWrapper.style = 'display: flex; margin-bottom: 8px;'
			
			const settingLabel = document.createElement("div");
			settingLabel.style = 'flex: 1 1 auto;'
			settingWrapper.append(settingLabel);
			
			const settingSwitch = document.createElement("div");
			settingSwitch.style = 'flex: 0 1 auto;'
			settingWrapper.append(settingSwitch);
			
			settingsPanelWrapper.append(settingWrapper);
		
			const settingsPanelLabel = React.createElement("span", {
				className: "settings_panel_label",
					style: { color: "white" },
				},
				settingDescription
			)
			
			function Settings() {
				var [ checked, setChecked ] = BdApi.React.useState(switchState);
			
				return BdApi.React.createElement(Switch, {
					checked,
					onChange(state) {
						setChecked(state);
						//console.log('Switch Flipped')
						switchState = !switchState
						userSettings[settingKey] = switchState;
						BdApi.Data.save("MemberCounter", "settings", userSettings);
					}
				});
			};
			BdApi.ReactDOM.render(settingsPanelLabel, settingLabel);
			BdApi.ReactDOM.render(BdApi.React.createElement(Settings), settingSwitch);
		}
		
		createSetting("Show Total Members Counter: ", "showTotalCounter", userSettings.showTotalCounter)
		createSetting("Show Online Members Counter: ", "showOnlineCounter", userSettings.showOnlineCounter)
		createSetting("Show Offline Members Counter: ", "showOfflineCounter", userSettings.showOfflineCounter)
		createSetting("Show DMs Counter: ", "showDMsCounter", userSettings.showDMsCounter)
		
		return settingsPanelWrapper;
  }
}

module.exports = MemberCounter