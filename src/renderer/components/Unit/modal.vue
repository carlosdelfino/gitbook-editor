<template>
	<div class="mask" v-show="show" @mousedown.stop>
		<div class="popup">
			<div class="header">{{title}}</div>
			<div class="body">
    		<slot></slot>
			</div>
			<div class="footer">
				<button class="btn-secondary" @click="doCancel">{{cancelText}}</button>
				<button class="btn-primary" @click="doConfirm">{{confirmText}}</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {

  name: 'Modal',

  props: {
  	confirmText: {
  		type: String,
  		default: '确定'
  	},
  	cancelText: {
  		type: String,
  		default: '取消'
  	},
  	title: String,
  	show: Boolean
  },
  methods: {
  	doConfirm () {
  		this.$emit('confirm')
  	},
  	doCancel () {
  		this.$emit('update:show', false)
  	}
  },
  mounted () {
  	document.addEventListener('mousedown', () => {
  		this.$emit('update:show', false)
  	})
  }
};
</script>

<style lang="css" scoped>
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.1);
		z-index: 999;
	}
	.popup {
		min-width: 560px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border-radius: 3px;
    font-size: 16px;
    color: #333;
    box-shadow: 0 2px 6px rgba(0,0,0,.16), 0 6px 26px rgba(0,0,0,.3);
	}
	.header {
		padding: 18px 24px;
		min-height: 40px;
	}
	.body {
		padding: 0 24px 18px;
	}
	.footer {
		text-align: right;
		padding: 24px;
	}
	
</style>