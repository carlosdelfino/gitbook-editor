<template>
	<div class="toc">
    <ul ref="articleList">
      <item :model="file" v-for="file in files" class="item" :key="file.title"></item>
		</ul>
	</div>
</template>

<script>
const path = require('path')
const fs = require('fs')

import Item from '../Unit/Item'
import { mapGetters } from 'vuex'

export default {

  components: { Item },

  name: 'Toc',

  data () {
    return {
    	files: [{
    		title: 'SUMMARY.md',
    		path: 'SUMMARY.md',
    		level: '',
    		articles: []
    	}]
    };
  }
};
</script>

<style lang="css" scoped>
	.toc {
	  position: relative;
	  height: 100%;
	}
	.toc > ul {
	  overflow-y: auto; 
	  height: 100%;
	  padding-bottom: 38px;
	}
</style>