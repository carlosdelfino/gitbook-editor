<template>
  <div class="tree">
    <ul ref="articleList">
      <item :model="chapter" v-for="chapter in summary.chapters" class="item" :key="chapter.title" @context="showContext" @sort="updateSummaryBySort"></item>
    </ul>
    <div class="create-btn" @click="toggleModal(true);actionType='new_section_outer'">新建层级</div>
    <context-menu class="right-menu"
        :show="contextMenuVisible" ref="contextMenu"
        @update:show="toggleContextMenu">
        <a v-if="!contextItem.introduction" @click="editPointer">编辑指向</a>
        <a v-if="!contextItem.introduction" @click="toggleModal(true);actionType='new_article'">新建文章</a>
        <a @click="toggleModal(true);actionType='new_section'">新建同级</a>
        <a v-if="!contextItem.introduction" @click="deleteArticle">删除</a>
    </context-menu>
    <modal :title="'文章配置'" @confirm="createArticle" @update:show="toggleModal" :show="modalVisible">
      <input type="text" placeholder="文章名称" autofocus="true" ref="createInput" v-model="articleName">
      <input type="text" placeholder="文章路径" v-model="articlePath">
      <button class="btn-secondary" @click="chooseFile">选择文件</button>
      <p>{{articleHint}}</p>
    </modal>
  </div>
</template>

<script>

const path = require('path')
const fs = require('fs')
const gitbookParsers = require("gitbook-parsers");
const {dialog} = require('electron').remote;
const Sortable = require('sortablejs');

import Item from '../Unit/Item'
import ContextMenu from '../Unit/context-menu'
import Modal from '../Unit/modal'

import { mapGetters } from 'vuex'

export default {

  name: 'Tree',

  components: { Item, ContextMenu, Modal },

  data () {
  	return {
  		summary: {},
      contextItem: {},
      contextMenuVisible: false,
      modalVisible: false,
      articleName: '',
      articlePath: '',
      articleHint: '',
      actionType: '',
      sortable: null
  	}
  },
  mounted () {
  	const content = fs.readFileSync(
  		path.join(this.currentLibrary.path, 'SUMMARY.md'),
  		'utf8'
  	)
    this.parseSummary(content)
  },
  watch: {
    summary () {
      this.initSortable()
    }
  },
  computed: {
    ...mapGetters({
      currentLibrary: 'getLibrary'
    })
  },
  methods: {
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
          filter: ".introduction",
          animation: 150,
          onStart (evt) {
            const regexp = evt.to.parentNode.querySelector('.block').innerText.match(/([\d\.]+)\.\s/)
            fromSection = regexp && regexp[1]
          },
          onEnd (evt) {
            self.updateSummaryBySort({
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
    },
    updateSummaryBySort (data) {
      this.sortHandle(data.fromLevel, data.toLevel, data.oldIndex, data.newIndex)
    },
  	updateSummary () {
  		let lines = []
  		if (this.summary.chapters && this.summary.chapters.length) {
  			this.summary.chapters.forEach((chapter) => {
  				this.buildDirectory(chapter, lines, 0)
  			})
  		}
  		lines.unshift('# Summary')

      const content = lines.join('\n')

      fs.writeFileSync(
        path.join(this.currentLibrary.path, 'SUMMARY.md'),
        content,
        'utf8'
      )
      this.parseSummary(content)
  	},
    parseSummary (content) {
      const parser = gitbookParsers.get('markdown')
      const self = this
      parser.summary(content).then(function (summary) {
        self.summary = summary
      })
    },
  	buildDirectory (directory, result, level) {
  		const _this = this;
      if (directory.path) {
        const template = '* [title](path)'

        result.push(
          new Array(level + 1).join('  ') + 
          template.replace('title', directory.title)
                  .replace('path', directory.path)
        )  
      } else {
        const template = '* title'
        result.push(
          new Array(level + 1).join('  ') + template.replace('title', directory.title)
        )
      }  		

			directory.articles.forEach(function (article) {
				_this.buildDirectory(article, result, level + 1)
			})
  	},
    showContext (item) {
      this.contextItem = item.model
      this.contextMenuVisible = true
      this.$refs.contextMenu.contextMenuHandler(item.event)
    },
    toggleContextMenu (show) {
      this.contextMenuVisible = show
    },
    toggleModal (show) {
      this.contextMenuVisible = false
      this.modalVisible = show
      if (show === false) {
        this.articleName = ''
        this.articlePath = ''
        this.articleHint = ''
      } else {
        this.$nextTick(() => {
          this.$refs.createInput.focus()
        })
      }
    },
    chooseFile () {
      let filePath = dialog.showOpenDialog({properties: ['openFile'], defaultPath: this.currentLibrary.path})

      if (filePath) {
        filePath = filePath[0]
        if (~filePath.indexOf(this.currentLibrary.path)) {
          this.articlePath = filePath.replace(this.currentLibrary.path, '')
        }  
      }
      
    },
    createArticle () {
      if (this.articleName) {
        let result;
        if (this.actionType === 'new_section_outer') {
          result = this.actionHandle({level: this.summary.chapters.length})
        } else {
          result = this.actionHandle(this.contextItem)
        }
        if (!result) {
          this.articleName = ''
          this.articlePath = ''
          this.articleHint = ''
          this.contextMenuVisible = false
          this.modalVisible = false
        } else {
          this.articleHint = result
        }
      } else {
        this.articleHint = '文章名称和文章路径不能为空'
      }
    },
    deleteArticle () {
      this.actionType = 'delete'
      this.actionHandle(this.contextItem)
      this.contextMenuVisible = false
    },
    editPointer () {
      this.toggleModal(true);
      this.actionType = 'edit_article';
      this.articleName = this.contextItem.title
      this.articlePath = this.contextItem.path 
    },
    findArticle (levelString) {
      if (!levelString) {
        return {
          parent: null,
          article: this.summary.chapters,
          level: 0
        }
      }
      let levels = levelString.split('.')
      let level = levels.shift()
      let article = this.summary.chapters[level]
      let parent = this.summary.chapters

      while (levels.length) {
        level = levels.shift() - 1
        parent = article.articles
        article = article.articles[level]
      }

      return {
        parent,
        article,
        level
      }

    },
    sortHandle (fromLevel, toLevel, oldIndex, newIndex) {
      if (fromLevel == toLevel && oldIndex == newIndex) return;
      let fromResult = this.findArticle(fromLevel)
      let toResult = this.findArticle(toLevel)

      let fromSection = fromResult.parent ? fromResult.article.articles : fromResult.article
      let toSection = toResult.parent ? toResult.article.articles : toResult.article


      const article = {
        title: fromSection[oldIndex].title,
        path: fromSection[oldIndex].path,
        articles: fromSection[oldIndex].articles,
        level: toResult.article.level + '.' + newIndex
      }
      if (fromSection == toSection) {
        fromSection.splice(oldIndex, 1)
        toSection.splice(newIndex, 0, article)
      } else {
        fromSection.splice(oldIndex, 1)
        toSection.splice(newIndex, 0, article)
      }
      this.updateSummary()
    },
    actionHandle (target) {
      const levels = target.level
      const result = this.findArticle(levels)
      
      let parent = result.parent,
          article = result.article,
          level = result.level;
      if (this.actionType === 'delete') {
        // 底下没有文章,把自个删了；底下有文章，把文章移到父级下，把自个删了
        if (article.articles.length === 0) {
          parent.splice(level, 1)
        } else {
          parent.splice(level, 1)
          article.articles.forEach(function (article, index) {
            parent.splice(level + index, 0, article)
          })
        }  
      }

      if (~['new_article', 'new_section', 'new_section_outer', 'edit_article'].indexOf(this.actionType)) {
        const filePath = path.join(this.currentLibrary.path, this.articlePath);
        let createResult;

        if (!fs.existsSync(filePath)) {
           createResult = fs.closeSync(fs.openSync(filePath, 'w'))
        }

        if (createResult) {
          return createResult
        } else {
          if (this.actionType === 'new_article') {
            article.articles.push({
              title: this.articleName,
              path: this.articlePath,
              articles: []
            })
          }
          if (this.actionType === 'new_section' || this.actionType === 'new_section_outer') {
            parent.splice(parseInt(level) + 1, 0, {
              title: this.articleName,
              path: this.articlePath,
              articles: []
            })
          }
          if (this.actionType === 'edit_article') {
            article.title = this.articleName
            article.path = this.articlePath
          }
        }          
      }
      this.updateSummary()
    }
  }
}
</script>

<style lang="css" scoped>
  .tree {
    position: relative;
    height: 100%;
  }
  .tree > ul {
    overflow-y: auto; 
    height: 100%;
    padding-bottom: 38px;
  }
  .right-menu {
    min-width: 100px;
    max-width: 120px;
    padding: 5px 0;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0px 0px 2px 0px #999;
    position: fixed;
    z-index: 999;
    color: rgba(0, 0, 0, 0.8);
  }
  .right-menu a {
    display: block;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    cursor: pointer;
  }
  .right-menu a:hover {
    background: #00C28B;
    color: #fff;
  }
  .create-btn {
    text-align: center;
    padding: 10px;
    background-color: #00C28B;
    color: #fff;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>