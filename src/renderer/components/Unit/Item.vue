<template>
	<li :class="{folder: isFolder}">
    <input type="text" :value="model.title" v-model="renameValue" v-if="editing" @keyup.enter="doRename" @keydown.esc.stop="cancel" @blur="cancel" ref="renameInput">
    <div
    	v-else
    	@contextmenu="context"
    	@click="edit"
      @dblclick="rename"
      :class="{active: activePath === model.path}">
      {{model.introduction ? model.title : model.level + '. ' + model.title}}
      <!-- <span v-if="isFolder">[{{open ? '-' : '+'}}]</span> -->
    </div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        v-for="model in model.articles"
        :model="model" :key="model.level" @update="updateSummary">
      </item>
    </ul>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {

  name: 'Item',
  props: {
  	model: Object
  },
  data () {
    return {
    	open: true,
    	editing: false,
    	renameValue: this.model.title
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
  	rename () {
  		this.editing = true
  		this.$nextTick(function () {
  			this.$refs.renameInput.focus()
  		})
  	},
  	edit () {
  		this.setPath(this.model.path)
  	},
  	context () {
  		console.log('context')
  	},
  	doRename () {
  		if (this.renameValue.length && this.model.title !== this.renameValue) {
  			this.model.title = this.renameValue
  			this.$emit('update')
  		}
  		this.editing = false
  	},
  	cancel () {
  		this.renameValue = this.model.title
  		this.editing = false
  	},
  	updateSummary () {
  		this.$emit('update')
  	}
  }
};
</script>

<style lang="css" scoped>
.folder > div{
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

li > div:hover, li.active > div {
	color: #00C28B;
}

.item {
	padding: 0 10px;
	cursor: pointer;
	color: rgba(0, 0, 0, 0.5);
}

</style>