<template>
  <div class="editor">
    <markdown-editor v-model="input" ref="markdownEditor" :configs="configs" preview-class="gitbook-markdown-body"></markdown-editor>
    <modal :title="'添加链接'" @confirm="insertLink" @update:show="toggleModal" :show="linkModalVisible">
      <input type="text" placeholder="标题" autofocus="true" v-model="linkTitle">
      <input type="text" placeholder="URL" v-model="linkPath">
    </modal>
    <modal :title="'添加图片'" @confirm="insertImage" @update:show="toggleModal" :show="imageModalVisible">
      <input type="text" placeholder="标题" autofocus="true" v-model="imageTitle">
      <input type="text" placeholder="图片URL" v-model="imagePath">
      <button class="btn-secondary" @click="chooseFile">选择文件</button>
    </modal>
  </div>
</template>

<script>
const MarkupIt = require('markup-it');
const markdownSyntax = require('markup-it/syntaxes/markdown');
const htmlSyntax = require('markup-it/syntaxes/html');

const fs = require('fs');
const path = require('path');
const {dialog} = require('electron').remote;

const markdown = new MarkupIt(markdownSyntax);
const html = new MarkupIt(htmlSyntax);

import markdownEditor from './markdown-editor'
import Modal from '../Unit/modal'
import { mapGetters } from 'vuex'

export default {

  name: 'Editor',

  components: { markdownEditor, Modal },

  data () {
  	return {
    	input: '',
      timer: null,
      linkModalVisible: false,
      linkPath: '',
      linkTitle: '',
      imageModalVisible: false,
      imagePath: '',
      imageTitle: '',
      configs: {
        autoDownloadFontAwesome: false,
        autofocus: true,
        spellChecker: false,
        status: false,
        insertTexts: {
          horizontalRule: ["", "\n\n-----\n\n"],
          image: ["![](http://", ")"],
          link: ["[", "]()"],
        },
        toolbar: ['bold', 'italic', 'strikethrough', '|', {
          name: 'link',
          action: () => {
            this.linkModalVisible = true
          },
          className: 'fa fa-link',
          title: '链接'
        }, {
          name: 'image',
          action: () => {
            this.imageModalVisible = true
          },
          className: 'fa fa-picture-o',
          title: '插入图片'
        }, 'table', '|', 'heading', 'heading-1', 'heading-2', 'heading-3', '|', 'quote', 'ordered-list', 'unordered-list', 'side-by-side', 'fullscreen'],
        previewRender: function (plainText) {
          const content = markdown.toContent(plainText)
          return html.toText(content)
        }
      }
  	}
  },
  computed: {
    ...mapGetters({
      articlePath: 'getPath',
      currentLibrary: 'getLibrary'
    }),
    simplemde () {
      return this.$refs.markdownEditor.simplemde
    },
    filePath (val) {
      return path.join(this.currentLibrary.path, this.articlePath)
    }
  },
  watch: {
    filePath: function (val) {
      this.input = fs.readFileSync(
        val,
        'utf8'
      )
    },
    input: function (val) {
      if (!this.timer) {
        this.timer = setTimeout(this.doSave, 10000)
      }
    }
  },
  methods: {
    chooseFile () {
      let filePath = dialog.showOpenDialog({properties: ['openFile'], defaultPath: this.currentLibrary.path})

      if (filePath) {
        filePath = filePath[0]
        if (~filePath.indexOf(this.currentLibrary.path)) {
          this.imagePath = filePath.replace(this.currentLibrary.path, '')
        }
      }
    },
    toggleModal (show) {
      if (show === false) {
        this.linkModalVisible = false
        this.imageModalVisible = false
        this.linkTitle = ''
        this.linkPath = ''
        this.imageTitle = ''
        this.imagePath = ''
      }
    },
    insertLink () {
      if (this.linkPath) {
        this.simplemde.options.insertTexts.link = ["[" + this.linkTitle, "](" + this.linkPath + ")"]
        this.simplemde.drawLink()
        this.linkModalVisible = false
        this.linkTitle = ''
        this.linkPath = ''  
      }
    },
    insertImage () {
      if (this.imagePath) {
        this.simplemde.options.insertTexts.image = ["![" + this.imageTitle + "](" + this.imagePath, ")"]
        this.simplemde.drawImage()
        this.imageModalVisible = false
        this.imageTitle = ''
        this.imagePath = ''  
      }
    },
    doSave () {
      fs.writeFileSync(
        this.filePath,
        this.input,
        'utf8'
      )
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  mounted () {
    this.simplemde.toggleSideBySide()
    this.simplemde.codemirror.on('keydown', (codemirror, event) => {
      event = event || window.event;
      if (event.keyCode === 83 && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        event.stopPropagation()
        this.doSave()
      }
    })
  }
};
</script>

<style lang="css">
.markdown-editor .editor-toolbar {
  border: none;
  right: 0;
  position: fixed;
  width: 50%;
  text-align: right;
  left: 100%;
  /*top: 30px;*/
  top: 5px;
  transform: translateX(-100%);
}
.markdown-editor .CodeMirror, .markdown-editor .editor-preview-side {
  border: none;
  position: absolute !important;
  top: 0;
  color: #333;
}
.markdown-editor .editor-preview-side {
  border-left: 1px solid #ddd;
}

.CodeMirror {
  line-height: 1.7;
}

.editor-toolbar a  {
  opacity: 0.6;
}

.editor-toolbar .fa-arrows-alt {
  display: none;
}
</style>