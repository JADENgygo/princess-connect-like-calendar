import UIkit from 'uikit';
import Vue from 'vue';
import './uikit.min.css';
import Host from './Host';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import dayjs from 'dayjs';

const firebaseConfig = {
	apiKey: "AIzaSyCq4XJ_ClTwdxtMUITQ0Xb7Ot7d30c4nL8",
	authDomain: "princess-connect-like-counter.firebaseapp.com",
	projectId: "princess-connect-like-counter",
	storageBucket: "princess-connect-like-counter.appspot.com",
	messagingSenderId: "108980150403",
	appId: "1:108980150403:web:3265738e3bef923af33bb6",
	measurementId: "G-X28TXM2SV3"
};

firebase.initializeApp(firebaseConfig);

new Vue({
	el: '#app',
	components: {
		Host
	},
	template: `<Host/>`
});
