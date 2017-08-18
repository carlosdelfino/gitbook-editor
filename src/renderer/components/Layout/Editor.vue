<template>
		<!-- <textarea :value="input" @input="update"></textarea> -->
		<!-- <div class="preview gitbook-markdown-body" v-html="compiledMarkdown"></div> -->
    <markdown-editor v-model="input" ref="markdownEditor" :configs="configs" preview-class="gitbook-markdown-body"></markdown-editor>
</template>

<script>

const { State } = require('markup-it/src/index');
const markdown = require('markup-it/src/markdown');
const html = require('markup-it/src/html');

import markdownEditor from './markdown-editor'

export default {

  name: 'Editor',

  components: { markdownEditor },

  data () {
  	return {
    	input: '',
      configs: {
        spellChecker: false,
        status: false,
        toolbar: ['bold', 'italic', 'strikethrough', '|', 'link', 'image', 'table', '|', 'heading', 'heading-1', 'heading-2', 'heading-3', '|', 'quote', 'ordered-list', 'unordered-list', 'side-by-side', 'fullscreen'],
        previewRender: function (plainText) {
          const document = State.create(markdown).deserializeToDocument(plainText);
          return State.create(html).serializeDocument(document)
        }
      }
  	}
  },
  computed: {
    simplemde () {
      return this.$refs.markdownEditor.simplemde
    }
  },
  mounted () {
    this.simplemde.toggleSideBySide()
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