document.addEventListener('DOMContentLoaded', () => {
	const calendar = {
		created: function() {
			for (let i = 0; i < 29; ++i) {
				this.$set(this.memberNames, i, localStorage.getItem('memberName' + i) === null ? '' : localStorage.getItem('memberName' + i));
			}
			this.memberCount = parseInt(localStorage.getItem('memberCount') === null ? 1 : localStorage.getItem('memberCount'));
			for (let i = 0; i < 29; ++i) {
				this.$set(this.likes, i, parseInt(localStorage.getItem('likes' + i)  === null ? 0 : localStorage.getItem('likes' + i)));
			}
		},
		data: function() {
			return {
				memberNames: [...Array(29)].map(() => ''),
				memberCount: 1,
				likes: [...Array(29)].map(() => 0)
			}
		},
		methods: {
			saveMemberCount: function(event) {
				this.memberCount = event.target.value;
				localStorage.setItem('memberCount', event.target.value);
			},
			saveMemberNames: function(event, index) {
				this.$set(this.memberNames, index, event.target.value);
				localStorage.setItem('memberName' + index, event.target.value);
			},
			moveFocus: function(event, index) {
				event.preventDefault();
				if (event.keyCode === 13) {
					let i = index;
					if (index === 28) {
						i = -1;
					}
					document.getElementById('member-name' + (i + 1)).focus();
				}
			},
			incrementLike: function(index) {
				this.$set(this.likes, index, this.likes[index] + 1);
				localStorage.setItem('likes' + index, this.likes[index]);
			},
			decrementLike: function(index) {
				this.$set(this.likes, index, this.likes[index] === 0 ? 0 : this.likes[index] - 1);
				localStorage.setItem('likes' + index, this.likes[index]);
			},
			resetLikes: function() {
				for (let i = 0; i < 29; ++i) {
					this.$set(this.likes, i, 0);
					localStorage.setItem('likes' + i, 0);
				}
				UIkit.notification({
					message: 'いいねをリセットしました',
					pos: 'top-center',
					timeout: 1000
				});
			}
		},
		template: `
			<div class="uk-container uk-text-center">
				<div class="uk-text-lead uk-text-center uk-margin-top">いいねカウンター</div>
				<div class="uk-margin-top">プリコネRのクランメンバーのいいね管理ツール (データはブラウザに保存されます)</div>
				<div style="display: inline-block; text-align: left">
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
						<form class="uk-form-stacked uk-margin-small-top" v-if="i <= memberCount">
							<label class="uk-form-label" v-bind:for="'member-name' + (i - 1)">{{ 'メンバー' + i }}</label>
							<div class="uk-form-controls">
								<input v-bind:id="'member-name' + (i - 1)" class="uk-input uk-form-small uk-form-width-small" type="text" v-on:input="saveMemberNames($event, i - 1)" v-on:keydown="moveFocus($event, i - 1)" v-model="memberNames[i - 1]" v-bind:tabindex="i">
								<button type="button" class="uk-button uk-button-default uk-button-small" v-on:click="incrementLike(i - 1)">+</button>
								<button type="button" class="uk-button uk-button-default uk-button-small" v-on:click="decrementLike(i - 1)">-</button>
								<span id="like" class="uk-badge">{{ likes[i - 1] }}</span>
							</div>
						</form>
					</template>
					<div class="uk-margin-top uk-margin-bottom"><span class="uk-text-muted">サイト作成者: </span><a class="uk-text-muted" href="https://twitter.com/JADENgygo">@JADENgygo</a></div>
				</div>
			</div>
		`
	};

	new Vue({
		el: '#app',
		components: {
			'calendar': calendar
		},
		template: `
			<calendar></calendar>
		`
	});
});
