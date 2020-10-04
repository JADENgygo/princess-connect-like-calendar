document.addEventListener('DOMContentLoaded', () => {
	const calendar = {
		created: function() {
			for (let i = 0; i < 29; ++i) {
				this.memberNames[i] = this.$set(this.memberNames, i, localStorage.getItem('memberName' + i) ?? '');
			}
			this.memberCount = parseInt(localStorage.getItem('memberCount') ?? 1);
			for (let i = 0; i < 29; ++i) {
				this.likes[i] = this.$set(this.likes, i, parseInt(localStorage.getItem('likes' + i) ?? 0));
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
				console.log(event.keyCode);
				this.$set(this.memberNames, index, event.target.value);
				localStorage.setItem('memberName' + index, event.target.value);
			},
			moveFocus: function(event, index) {
				if (event.keyCode === 13) {
					let i = index;
					if (index === 28) {
						i = -1;
					}
					document.getElementById('memberName' + (i + 1)).focus();
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
			}
		},
		template: `
			<div class="uk-container uk-text-center">
				<div class="uk-text-lead uk-text-center uk-margin-top">いいねカウンター</div>
				<div class="uk-margin-top">プリコネRのクラン用<br>(データはブラウザに保存されます)</div>
				<select class="uk-select uk-form-small uk-form-width-xsmall uk-margin-top" v-on:change="saveMemberCount($event)">
					<option v-for="i in 29" v-bind:value="i" v-bind:selected="i === memberCount">{{ i }}</option>
				</select>
				<button class="uk-button uk-button-danger uk-button-small uk-margin-top uk-margin-left" uk-toggle="target: #modal-example">いいねのリセット</button>
				<div id="modal-example" uk-modal>
					<div class="uk-modal-dialog uk-modal-body">
						<div class="uk-margin-bottom">いいねをリセットしますか</div>
						<div>
							<button class="uk-button uk-button-default uk-button-small uk-modal-close">キャンセル</button>
							<button class="uk-button uk-button-danger uk-button-small uk-margin-left" v-on:click="resetLikes()">リセット</button>
						</div>
					</div>
				</div>
				<div class="uk-margin-small-top" v-for="i in  29">
					<span v-if="i <= 9" v-bind:class="{hidden : memberCount < i}">&nbsp;&nbsp;{{ i }}&nbsp;</span>
					<span v-else v-bind:class="{hidden : memberCount < i}">{{ i }}&nbsp;</span>
					<input v-bind:id="'memberName' + (i - 1)" v-bind:class="{hidden : memberCount < i}" class="uk-input uk-form-small uk-form-width-small" type="text" v-on:input="saveMemberNames($event, i - 1)" v-on:keydown="moveFocus($event, i - 1)" v-bind:value="memberNames[i - 1]" v-bind:tabindex="i">
					<button v-bind:class="{hidden : memberCount < i}" class="uk-button uk-button-default uk-button-small" v-on:click="incrementLike(i - 1)">+</button>
					<button v-bind:class="{hidden : memberCount < i}" class="uk-button uk-button-default uk-button-small" v-on:click="decrementLike(i - 1)">-</button>
					<span v-bind:class="{hidden : memberCount < i}" id="like" class="uk-badge">{{ likes[i - 1] }}</span>
				</div>
				<div class="uk-margin-top uk-margin-bottom"><span class="uk-text-muted">サイト作成者:&nbsp;</span><a class="uk-text-muted" href="https://twitter.com/JADENgygo">@JADENgygo</a></div>
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