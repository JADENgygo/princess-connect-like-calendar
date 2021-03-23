import UIkit from 'uikit';
import Vue from 'vue';
import './uikit.min.css';
import Host from './Host';

new Vue({
	el: '#app',
	components: {
		Host
	},
	template: `
		<Host/>
	`
});
