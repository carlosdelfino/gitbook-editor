<template>
	<li :class="{introduction: model.introduction}">
    <div
      @contextmenu.stop.prevent="showContext"
    	@click="edit"
      @dblclick="edit"
      :class="{block: true, folder: isFolder, active: activePath === model.path}">
      {{model.introduction ? model.title : model.level + '. ' + model.title}}
    </div>
    <ul v-show="open" v-if="isFolder" class="articles" ref="articleList">
      <item
        class="item"
        v-for="model in model.articles"
        :model="model" :key="model.level" @context="showContext">
      </item>
    </ul>
  </li>
</template>

<script>
const Sortable = require('sortablejs');

import { mapActions, mapGetters } from 'vuex'

export default {

  name: 'Item',
  props: {
  	model: Object
  },
  data () {
    return {
    	open: true,
      sortable: null
    };
  },
  computed: {
  	...mapGetters({
  		activePath: 'getPath'
  	}),
  	isFolder () {
  		return this.model.articles.length > 0
  	}
  },
  methods: {
  	...mapActions([
      'setPath'
    ]),
  	toggle () {
  		this.open = !this.open
  	},
  	edit () {
  		this.setPath(this.model.path)
  	},
    showContext (event) {
      this.$emit('context', {
        model: event.model || this.model,
        event: event.event || event
      })
    }
  },
  mounted () {
    if (this.$refs.articleList) {
      if (this.sortable) {
        this.sortable.destroy()
        this.sortable = null
      }
      this.sortable = new Sortable(this.$refs.articleList, {
        group: "articles"
      })  
    }
  }
};
</script>

<style lang="css" scoped>
.folder{
	font-weight: bold;
}

.active {
	color: #00C28B;
}

li > input {
	font-size: 14px;
	box-shadow: 1px solid rgba(0, 0, 0, 0.8);
	outline: none;
	width: 100%;
}

li > div, li > input {
	padding: 10px;
}

li > div:hover {
	color: #00C28B;
}

.item {
	padding: 0 10px;
	cursor: pointer;
	color: rgba(0, 0, 0, 0.5);
}

</style>