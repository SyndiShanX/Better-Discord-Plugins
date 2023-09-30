// Define BdApi Functions
const { Webpack: {getModule, getStore, Filters}, React, Patcher } = BdApi;

// Fetch SelectedGuildStore and GuildMemberCountStore to get Member Count
const SelectedGuildStore = Webpack.getStore('SelectedGuildStore')
const GuildMemberCountStore = Webpack.getStore('GuildMemberCountStore')
GuildMemberCountStore.getMemberCount(SelectedGuildStore.getGuildId());

// Fetch SelectedChannelStore and ChannelStore to get Thread Member Count
const SelectedChannelStore = Webpack.getStore('SelectedChannelStore')
const ChannelStore = Webpack.getStore('ChannelStore')
ChannelStore.getChannel(SelectedChannelStore.getChannelId())

// Alternate way of Fetching Thread Member Count
const ThreadMembersStore = Webpack.getStore("ThreadMembersStore")
ThreadMembersStore.getMemberCount(SelectedChannelStore.getChannelId())

// Fetches the Store for a Given Function
function getFunctionStore(functionString) {
	dispatchToken = Webpack.getModule(Webpack.Filters.byKeys(functionString))._dispatchToken
	console.log(Webpack.getModule(Webpack.Filters.byKeys(functionString))._dispatcher._actionHandlers._dependencyGraph.nodes[dispatchToken].name)
}
// Ex: getFunctionStore('getLastSelectedChannelId') >>> SelectedChannelStore

// Switch Themes
Webpack.getModule(x=>x.updateTheme).updateTheme("light")
Webpack.getModule(x=>x.updateTheme).updateTheme("dark")

// Show Toast
const { createToast, showToast } = BdApi.Webpack.getModule(x => x.createToast);
showToast(createToast("Message Here!", 1));