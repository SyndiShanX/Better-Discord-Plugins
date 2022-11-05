/**
 * @name MemberCounter
 * @author SyndiShanX
 * @description Displays the Member Count of a Server at the top of the Member List (Can be Styled using .member-counter-wrapper and .member-counter-text).
 * @version 1.0.0
 */

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
			counterNum.textContent = 'Members - ' + membersNum;
			counterNum.style.color = 'var(--channels-default)';
			counterWrapper.append(counterNum);
			
			membersWrap.prepend(counterWrapper);
		}
	}
}

let memberUpdater;

module.exports = () => ({
	start() {
		memberUpdater = setInterval(createCounter, 1000);
	},
	stop() {
		clearInterval(memberUpdater);
		document.getElementsByClassName('member-counter-wrapper')[0].remove();
  }
});