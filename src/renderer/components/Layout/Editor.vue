<template>
  
    <markdown-editor v-model="input" ref="markdownEditor" :configs="configs" preview-class="gitbook-markdown-body"></markdown-editor>
</template>

<script>

// const { State } = require('markup-it');
// const markdown = require('markup-it/lib/markdown');
// const html = require('markup-it/lib/html');
// 
const MarkupIt = require('markup-it');
const markdownSyntax = require('markup-it/syntaxes/markdown');
const htmlSyntax = require('markup-it/syntaxes/html');

const fs = require('fs');
const path = require('path');

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
      configs: {
        autofocus: true,
        spellChecker: false,
        status: false,
        toolbar: ['bold', 'italic', 'strikethrough', '|', {
          name: 'link',
          action: () => {
            this.linkModalVisible = true
          },
          className: 'fa fa-link',
          title: '链接'
        }, 'image', 'table', '|', 'heading', 'heading-1', 'heading-2', 'heading-3', '|', 'quote', 'ordered-list', 'unordered-list', 'side-by-side', 'fullscreen'],
        previewRender: function (plainText) {
          const content = markdown.toContent(plainText)
          return html.toText(content)
        }
      }
  	}
  },
  computed: {
    ...mapGetters({
      articlePath: 'getPath'
    }),
    simplemde () {
      return this.$refs.markdownEditor.simplemde
    },
    filePath (val) {
      return path.join('/Users/curly/GitBook/Library/Import/book', '/', this.articlePath)
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
      let filePath = dialog.showOpenDialog({properties: ['openFile'], defaultPath: this.rootPath})

      if (filePath) {
        filePath = filePath[0]
        if (~filePath.indexOf(this.rootPath)) {
          this.articlePath = filePath.replace(this.rootPath, '')
        }
      }
    },
    toggleModal (show) {
      if (show === false) {
        this.linkModalVisible = false
        this.linkTitle = ''
        this.linkPath = ''
      }
    },
    insertLink () {
      this.simplemde.drawLink()
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