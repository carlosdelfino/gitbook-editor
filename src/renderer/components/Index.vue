<template>
	<div class="container">
		<header>
			<input type="text" placeholder="查找项目" v-model="keyword">
		</header>
		<main>
			<div class="library" v-for="library in filtedLibrarys">
				<div class="content" @click="openLibrary(library)">
					<div class="title">{{library.title}}</div>
					<div class="desc">{{library.path}}</div>
				</div>
				<div class="handle"><span @click.stop="deleteLibrary(library)">删除</span></div>
			</div>
		</main>
		<footer>
			<div class="create-panel" v-if="createPanelVisible">
				<input type="text" placeholder="项目名称" v-model="libraryName">
				<input type="text" placeholder="项目路径" v-model="libraryPath" @click="chooseFile">
			</div>
			<button class="btn-primary" @click="createLibrary" :disabled="createPanelVisible && (!libraryPath || !libraryName)">新建项目</button>
		</footer>
	</div>
</template>

<script>

const Store = require('electron-store');
const store = new Store();
const {dialog} = require('electron').remote;
const {ipcRenderer} = require('electron')

import { mapActions } from 'vuex'

export default {

  name: 'index',

  data () {
    return {
    	keyword: '',
    	librarys: store.get('librarys') || [],
    	libraryName: '',
    	libraryPath: '',
    	createPanelVisible: false
    };
  },
  computed: {
  	filtedLibrarys () {
  		return this.librarys.filter((library) => {
  			return library.title.indexOf(this.keyword) > -1
  		})
  	}
  },
  methods: {
		...mapActions([
	    'setLibrary'
	  ]),
  	chooseFile () {
  	  let filePath = dialog.showOpenDialog({properties: ['openDirectory']})
  	  if (filePath) {
  	  	this.libraryPath = filePath[0]
  	  }
  	},
  	deleteLibrary (library) {
			const index = this.librarys.indexOf(library)
			this.librarys.splice(index, 1)
			store.set('librarys', this.librarys)
  	},
  	createLibrary () {
  		if (this.createPanelVisible) {
  			this.createPanelVisible = false

  			this.librarys.push({
  				title: this.libraryName,
  				path: this.libraryPath
  			})

  			store.set('librarys', this.librarys)
  		} else {
  			this.libraryName = ''
  			this.libraryPath = ''
  			this.createPanelVisible = true
  		}
  	},
  	openLibrary (library) {
  		ipcRenderer.send('openLibrary')
  		this.setLibrary(library)
  		this.$router.push({name: 'main'})
  	}
  },
  mounted () {
  	document.addEventListener('keyup', (e) => {
  		if (e.keyCode === 27) {
  			this.createPanelVisible = false
  		}
  	})
  }
};
</script>

<style lang="css" scoped>
.container {
	padding: 10px;
	width: 100%;
	display: flex;
	flex-direction: column;
}
.btn-primary {
	width: 100%;
}

header {
	box-shadow: 0px 1px rgba(0,0,0,.08);
}
main {
	padding: 10px 0;
	overflow: auto;
}
footer {
	width: 100%;
	bottom: 0;
}
.library {
	padding: 10px 12px;
	height: 60px;
	width: 100%;
	border-radius: 3px;
	position: relative;
	cursor: pointer;
}
.library:hover {
	background-color: rgba(0, 194, 139, 0.1);
}
.library:hover .handle span {
	display: block;
}
.library .content {
	padding-right: 30px;
}
.library .handle {
	position: absolute;
	width: 30px;
	height: 100%;
	right: 12px;
	top: 0;
	text-align: center;
}
.library .handle span {
	display: none;
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	color: rgba(0, 0, 0, 0.5);
	font-size: 12px;
}
.library .title {
	color: #333;
	padding-bottom: 5px;
	font-weight: bold;
}
.library .desc {
	color: #666;
}
button[disabled] {
	opacity: 0.5;
	cursor: default;
}

</style>