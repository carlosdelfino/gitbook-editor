<template>
	<header>
		<div class="left-part">
			<a class="fa fa-chevron-left btn-back" @click="backIndex"></a>
			<div class="info">
				<div class="title">{{currentLibrary.title}}</div>
				<div class="path">{{currentLibrary.path}}</div>
			</div>
		</div>
	</header>
</template>

<script>
const {ipcRenderer} = require('electron')

import { mapGetters } from 'vuex'

export default {

  name: 'Navbar',

  data () {
    return {

    };
  },
  computed: {
    ...mapGetters({
      currentLibrary: 'getLibrary'
    })
  },
  methods: {
  	backIndex () {
  		ipcRenderer.send('openIndex')
  		this.$router.push({name: 'index'})
  	}
  }
};
</script>

<style lang="css" scoped>
	header {
		width: 100%;
		height: 60px;
		border-bottom: 1px solid rgba(204, 204, 204, 0.39);
		box-shadow: 0px 1px 1px rgba(204, 204, 204, 0.39);
	}
	.left-part {
		padding-left: 10px;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}
	.btn-back {
		width: 40px;
		line-height: 40px;
		display: inline-block;
		border: 1px solid #eee;
		border-radius: 3px;
		background-color: #2c3e50;
		opacity: 0.6;
		text-align: center;
		color: #fff;
		cursor: pointer;
		font-size: 24px;
	}
	.btn-back:hover {
		opacity: 0.8;
	}
	.info {
		display: inline-block;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 5px;
	}
	.info .title {
		font-weight: bold;
		color: #333;
	}
	.info .path {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.3);
	}
</style>