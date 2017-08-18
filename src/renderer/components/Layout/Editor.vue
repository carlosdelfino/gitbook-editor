<template>
		<!-- <textarea :value="input" @input="update"></textarea> -->
		<!-- <div class="preview gitbook-markdown-body" v-html="compiledMarkdown"></div> -->
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
import { mapGetters } from 'vuex'

export default {

  name: 'Editor',

  components: { markdownEditor },

  data () {
  	return {
    	input: '',
      timer: null,
      configs: {
        spellChecker: false,
        status: false,
        toolbar: ['bold', 'italic', 'strikethrough', '|', 'link', 'image', 'table', '|', 'heading', 'heading-1', 'heading-2', 'heading-3', '|', 'quote', 'ordered-list', 'unordered-list', 'side-by-side', 'fullscreen'],
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

.editor-toolbar .fa-columns {
  display: none;
}

.editor-toolbar .fa-arrows-alt {
  display: none;
}
</style>