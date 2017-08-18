<template>
	<ul>
		<item :model="chapter" v-for="chapter in summary.chapters" class="item" :key="chapter.level" @update="updateSummary"></item>
	</ul>
</template>

<script>

const path = require('path')
const fs = require('fs')
const gitbookParsers = require("gitbook-parsers");

import Item from '../Unit/Item'

export default {

  name: 'Tree',

  components: { Item },

  data () {
  	return {
			// chapters: [
			// 	{
			// 		articles: [],
			// 		exists: bool,
			// 		external: bool,
			// 		introduction: bool,
			// 		level: "1.1",
			// 		path: '',
			// 		title: ''			
			// 	}
			// ]
  		summary: {}
  	}
  },
  mounted () {
  	const content = fs.readFileSync(
  		path.join('/Users/curly/GitBook/Library/Import/book', 'SUMMARY.md'),
  		'utf8'
  	)
  	const parser = gitbookParsers.get('markdown')
  	const _this = this

  	parser.summary(content).then(function (summary) {
  		_this.summary = summary
  	})
  },
  methods: {
  	updateSummary (msg) {
  		let lines = []
  		if (this.summary.chapters && this.summary.chapters.length) {
  			this.summary.chapters.forEach((chapter) => {
  				this.buildDirectory(chapter, lines, 0)
  			})
  		}
  		lines.unshift('# Summary')
  		
  		fs.writeFileSync(
				path.join('/Users/curly/GitBook/Library/Import/book', 'SUMMARY.md'),
				lines.join('\n'),
				'utf8'
  		)
  	},
  	buildDirectory (directory, result, level) {
  		const _this = this;
  		let template = '* [title](path)'

  		result.push(
  			new Array(level + 1).join('  ') + 
  			template.replace('title', directory.title)
  							.replace('path', directory.path)
  		)

			directory.articles.forEach(function (article) {
				_this.buildDirectory(article, result, level + 1)
			})
  	}
  }
};
</script>

<style lang="css" scoped>

</style>