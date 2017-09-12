<template>
	<li :class="{introduction: model.introduction}">
    <div
      @contextmenu.stop.prevent="showContext"
    	@click="edit"
      @dblclick="edit"
      :class="{block: true, folder: isFolder, active: activePath === model.path, disabled: invalidPath}">
      {{model.introduction ? model.title : model.level + '. ' + model.title}}
    </div>
    <ul v-show="open" v-if="isFolder" class="articles" ref="articleList">
      <item
        class="item"
        v-for="model in model.articles"
        :model="model" :key="model.title" @sort="sortSummary" @context="showContext">
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
  	},
    invalidPath () {
      return !this.model.path || !this.model.path.endsWith('.md')
    }
  },
  watch: {
    'model.articles' () {
      this.initSortable()
    }
  },
  mounted () {
    this.initSortable()
  },
  methods: {
  	...mapActions([
      'setPath'
    ]),
  	toggle () {
  		this.open = !this.open
  	},
  	edit () {
      if (this.invalidPath) {
        return;
      } else {
        this.setPath(this.model.path)        
      }
  	},
    showContext (event) {
      this.$emit('context', {
        model: event.model || this.model,
        event: event.event || event
      })
    },
    sortSummary (data) {
      this.$emit('sort', data)
    },
    initSortable () {
      if (this.$refs.articleList) {
        if (this.sortable) {
          this.sortable.destroy()
          this.sortable = null
        }
        const self = this
        let oldRelated = null
        let toSection = ''
        let fromSection = ''
        this.sortable = new Sortable(this.$refs.articleList, {
          group: "articles",
          animation: 150,
          onStart (evt) {
            const regexp = evt.to.parentNode.querySelector('.block').innerText.match(/([\d\.]+)\.\s/)
            fromSection = regexp && regexp[1]
          },
          onEnd (evt) {
            self.$emit('sort', {
              fromLevel: fromSection, 
              toLevel: toSection, 
              oldIndex: evt.oldIndex, 
              newIndex: evt.newIndex
            })
          },
          onMove: function (/**Event*/evt, /**Event*/originalEvent) {
            const regexp = evt.to.parentNode.querySelector('.block').innerText.match(/([\d\.]+)\.\s/)
            toSection = regexp && regexp[1]
          }
        })  
      }
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

li > div.disabled:hover {
  color: inherit;
}

.item {
	padding: 0 10px;
	cursor: pointer;
	color: rgba(0, 0, 0, 0.5);
}

</style>