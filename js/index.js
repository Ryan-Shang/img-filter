const originImgSrc = 'img/origin.png';

const app = new Vue({
  el: '#app',
  data: {
    originImgSrc: originImgSrc,
    filterImgSrc: originImgSrc,
    isUpLoading: false,
    isDone: false,
    isError: false,
    isPageLoaded: false,
    isRendered: false
  },
  methods: {
    selectFile () {
      this.$refs.file.click();
    },
    getFile () {
      if (this.$refs.file.files[0]) {
        this.isRendered = false;
        const file = this.$refs.file.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadstart = () => {
          this.isUpLoading = true;
        }
        reader.onload = (e) => {
          this.isUpLoading = false;
          this.showSuccess();
          if (e.target.result) {
            this.originImgSrc = this.filterImgSrc = e.target.result
            this.$refs.filterImg.onload = () => {
              this.isRendered = true;
              this.screenshot(this.$refs.filterImg);
              this.$refs.filterImg.onload = null;
            }
          } else {
            this.showError();
          }
        }
      }
    },
    downloadImg () {
      this.screenshot(this.$refs.filterImg).download();
    },
    showSuccess () {
      this.isDone = true;
      window.setTimeout(() => { this.isDone = false; }, 3000);
    },
    showError () {
      this.isError = true;
      window.setTimeout(() => { this.isError = false; }, 3000);
    },
    download (url, fullName) {
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.style.display = 'none'
      anchor.setAttribute('download', fullName)
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
    },
    screenshot(imgNode, format = 'png', quality = 0.97) {
      const canvas = document.createElement('canvas')
      canvas.width = imgNode.width
      canvas.height = imgNode.height
      const context = canvas.getContext('2d')
      context.filter = getComputedStyle(imgNode).filter
      imgNode.setAttribute('crossOrigin', 'anonymous')
      context.drawImage(imgNode, 0, 0, canvas.width, canvas.height)
      const url = canvas.toDataURL(`image/${format}`, quality)
      this.filterImgSrc = url
      // 下载方案，兼容性问题
      // return {
      //   url,
      //   then: (cb) => {
      //     cb(url)
      //   },
      //   download: (name = 'image') => {
      //     // 下载方案1
      //     canvas.toBlob(blob => {
      //       saveAs(blob, `${name}.${format}`);
      //     })
      //     // 下载方案2
      //     // this.download(url, `${name}.${format}`)
      //   }
      // }
    }
  },
  mounted () {
    this.isPageLoaded = true
    this.$refs.filterImg.onload = () => {
      this.screenshot(this.$refs.filterImg);
      this.$refs.filterImg.onload = null;
    }
  }
})