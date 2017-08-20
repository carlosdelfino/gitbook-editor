<template>
	<div class="menu">
		<div class="tabs">
			<a :class="['tab', {active: active === 'dir'}]" @click="active = 'dir'">目录</a>
			<a :class="['tab', {active: active === 'toc'}]" @click="active = 'toc'">TOC</a>
		</div>
		<div class="main">
			<Toc v-if="active === 'toc'"></Toc>
			<Tree v-else></Tree>
		</div>
	</div>
</template>

<script>
import Toc from './Toc'
import Tree from './Tree'

export default {

  name: 'Sidebar',

  components: {Toc, Tree},

  data () {
    return {
    	active: 'dir'
    };
  }
};
</script>

<style lang="css" scoped>
.menu {
  user-select: none;
  position: relative;
  height: 100%;
}
.tabs {
	display: flex;
  height: 36px;
  line-height: 36px;
  padding: 0 40px;
  box-shadow: 0px 0px 2px #ccc;
  position: absolute;
  width: 100%;
}
.tab {
	font-size: 13px;
	flex: 1;
	float: left;
	padding: 0;
	text-align: center;
	color: #aaa;
	cursor: pointer;
}
.tab.active {
	color: #666;
	box-shadow: inset 0px -1px #00C28B;
}
.main {
  padding-top: 36px;
  height: 100%;
}
</style>