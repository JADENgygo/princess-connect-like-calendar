import UIkit from 'uikit';
import Vue from 'vue';
import './uikit.min.css';
import host from './host';

new Vue({
	el: '#app',
	components: {
		'host': host
	},
	template: `
		<host></host>
	`
});
