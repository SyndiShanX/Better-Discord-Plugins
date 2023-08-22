// Define BdApi Functions
const { React, getModule, Filters, Webpack, Patcher } = BdApi;

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