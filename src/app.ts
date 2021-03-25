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

async function start() {
	const [memberCount, memberNames, likes, state] = await new Promise(resolve => {
		firebase.auth().onAuthStateChanged(async (user: any) => {
			const state = user ? true : false;
			let memberCount = 1;
			const memberNames = [...Array(29)].map(() => '');
			const likes = [...Array(29)].map(() => 0);
			if (state) {
				const doc = await firebase.firestore().collection('users').doc(user.uid).get();
				if (doc.exists) {
					const d: any = doc.data();
					memberCount = d.memberCount;
					for (let i: number = 0; i < 29; ++i) {
						memberNames[i] = d['memberName' + i];
						likes[i] = d['like' + i];
					}
				}
			}
			resolve([memberCount, memberNames, likes, state]);
		});
	});

	firebase.auth().getRedirectResult().then((result: any) => {
		if (!result.user) {
			return;
		}
		const uid = result.user.uid;
		const db = firebase.firestore();
		db.collection('users').doc(uid).get().then(doc => {
			if (!doc.exists) {
				const newDoc: {[key: string]: any} = {};
				newDoc['memberCount'] = 1;
				for (let i = 0; i < 30; i++) {
					newDoc['like' + i] = 0;
					newDoc['memberName' + i] = '';
				}
				newDoc['created_at'] = dayjs().format();
				newDoc['updated_at'] = null;
				db.collection('users').doc(uid).set(newDoc);
			}
		});
	}).catch(error => {
		console.log('redirect result error');
		console.log(error);
	});

	new Vue({
		el: '#app',
		components: {
			Host
		},
		data: function() {
			return {
				param: {
					preMemberCount: memberCount,
					preMemberNames: memberNames,
					preLikes: likes,
					preState: state
				}
			};
		},
		template: `<Host v-bind="param" />`
	});
}

start();
