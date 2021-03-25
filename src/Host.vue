<template>
	<div class="uk-container uk-text-center">
		<div class="uk-margin-small-top uk-text-left"><span class="uk-text-muted">サイト作成者: </span><a class="uk-text-muted" href="https://twitter.com/JADENgygo">@JADENgygo</a></div>
		<div class="uk-margin-small-top uk-text-right" v-if="state">
			<button type="button" class="uk-button uk-button-primary uk-button-small" v-on:click="logout()">ログアウト</button>
		</div>
		<div class="uk-text-lead uk-margin-top">いいねカウンター</div>
		<div class="uk-margin-top">プリコネRのクランメンバーのいいね管理ツール</div>
		<div v-if="state">
			<div class="content">
				<select class="uk-select uk-form-small uk-form-width-xsmall uk-margin-top" v-model="memberCount" v-on:change="saveMemberCount($event)">
					<option v-for="i in 29">{{ i }}</option>
				</select>
				<button class="uk-button uk-button-danger uk-button-small uk-margin-top uk-margin-left" uk-toggle="target: #dialog">いいねのリセット</button>
				<div id="dialog" uk-modal>
					<div class="uk-modal-dialog uk-modal-body">
						<div class="uk-margin-bottom">いいねをリセットしますか</div>
						<div class="uk-text-right">
							<button class="uk-button uk-button-default uk-button-small uk-modal-close">キャンセル</button>
							<button class="uk-button uk-button-danger uk-button-small uk-modal-close uk-margin-left" v-on:click="resetLikes()">リセット</button>
						</div>
					</div>
				</div>
				<template v-for="i in 29">
					<div class="uk-form-stacked uk-margin-small-top uk-margin-bottom" v-if="i <= memberCount">
						<label class="uk-form-label" v-bind:for="'member-name' + (i - 1)">{{ 'メンバー' + i }}</label>
						<div class="uk-form-controls">
							<input v-bind:id="'member-name' + (i - 1)" class="uk-input uk-form-small uk-form-width-small" type="text" v-on:input="saveMemberNames($event, i - 1)" v-on:keydown="moveFocus($event, i - 1)" v-model="memberNames[i - 1]" v-bind:tabindex="i">
							<button class="uk-button uk-button-default uk-button-small" v-on:click="incrementLike(i - 1)">+</button>
							<button class="uk-button uk-button-default uk-button-small" v-on:click="decrementLike(i - 1)">-</button>
							<span id="like" class="uk-badge">{{ likes[i - 1] }}</span>
						</div>
					</div>
				</template>
			</div>
		</div>
		<div v-else>
			<div class="uk-text-small uk-margin-top">ログイン</div>
			<input class="uk-margin-small-top" type="image" v-on:click="login()" v-bind:src="loginIconPath" width="40" height="40">
		</div>
	</div>
</template>
<script lang="ts">
import UIkit from 'uikit';
import Vue from 'vue';
import Component from 'vue-class-component';
import dayjs from 'dayjs';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const Props = Vue.extend({
	props: {
		preMemberCount: Number,
		preMemberNames: Array,
		preLikes: Array,
		preState: Boolean,
	}
});

@Component
export default class Host extends Props {
	memberCount: number = this.preMemberCount;
	memberNames: string[] = [];
	likes: number[] = [];
	state: boolean = this.preState;
	db = firebase.firestore();
	loginIconPath: string = './twitter_icon.svg';

	created(): void {
		for (let i: number = 0; i < 29; ++i) {
			this.$set(this.memberNames, i, this.preMemberNames[i]);
			this.$set(this.likes, i, this.preLikes[i]);
		}
	}

	login(): void {
		const provider = new firebase.auth.TwitterAuthProvider();
		firebase.auth().signInWithRedirect(provider).catch(error => {
			const errorCode = error.code;
			const errorMessage = error.message;
			const credential = error.credential;
			console.log('login error');
			console.log(errorCode, errorMessage, credential);
		});
	}

	logout(): void {
		firebase.auth().signOut().then(() => {
			this.state = false;
		}).catch((error: any) => {
			console.log('logout error');
			console.log(error);
		});;
	}

	saveMemberCount(event: any): void {
		this.memberCount = parseInt(event.target.value);
		const user = firebase.auth().currentUser;
		if (user) {
			this.db.collection('users').doc(user.uid).update({memberCount: this.memberCount, updated_at: dayjs().format()});
		}
	}

	saveMemberNames(event: any, index: number): void {
		this.$set(this.memberNames, index, event.target.value);
		const d: {[key: string]: any} = {};
		d['memberName' + index] = event.target.value;
		d.updated_at = dayjs().format();
		const user = firebase.auth().currentUser;
		if (user) {
			this.db.collection('users').doc(user.uid).update(d);
		}
	}

	moveFocus(event: any, index: number): void {
		if (event.keyCode === 13) {
			let i: number = index;
			if (index === 28) {
				i = -1;
			}
			document.getElementById('member-name' + (i + 1))?.focus();
			event.preventDefault();
		}
	}

	incrementLike(index: number): void {
		const like = this.likes[index] + 1;
		this.$set(this.likes, index, like);
		const d: {[key: string]: any} = {};
		d['like' + index] = like;
		d.updated_at = dayjs().format();
		const user = firebase.auth().currentUser;
		if (user) {
			this.db.collection('users').doc(user.uid).update(d);
		}
	}

	decrementLike(index: number): void {
		const like = this.likes[index] === 0 ? 0 : this.likes[index] - 1;
		this.$set(this.likes, index, like);
		const d: {[key: string]: any} = {};
		d['like' + index] = like;
		d.updated_at = dayjs().format();
		const user = firebase.auth().currentUser;
		if (user) {
			this.db.collection('users').doc(user.uid).update(d);
		}
	}

	resetLikes(): void {
		const doc: {[key: string]: any} = {};
		for (let i: number = 0; i < 29; ++i) {
			this.$set(this.likes, i, 0);
			doc['like' + i] = 0;
			doc.updated_at = dayjs().format();
		}
		const user = firebase.auth().currentUser;
		if (user) {
			this.db.collection('users').doc(user.uid).update(doc);
		}

		UIkit.notification({
			message: 'いいねをリセットしました',
			pos: 'top-center',
			timeout: 1000
		});
	}
}
</script>
<style scoped>
.content {
	display: inline-block;
	text-align: left;
}
</style>
