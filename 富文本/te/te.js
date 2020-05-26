var app = getApp();
Page({
  data: {
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '介绍一下你的详情吧，支持文字和图片...',
    _focus: false,
    images:[]
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
 
  },
  // 编辑器初始化完成时触发
  onEditorReady() {
    const that = this;
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
    }).exec();
  },
  undo() {
    this.editorCtx.undo();
  },
  redo() {
    this.editorCtx.redo();
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset;
    if (!name) return;
    // console.log('format', name, value)
    this.editorCtx.format(name, value);
  },
  // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
  onStatusChange(e) {
    const formats = e.detail;
    this.setData({
      formats
    });
  },
  // 插入分割线
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    });
  },
  // 清除
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    });
  },
  // 移除样式
  removeFormat() {
    this.editorCtx.removeFormat();
  },
  // 插入当前日期
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    });
  },
  // 插入图片
  insertImage() {
    var that=this;
    console.log("插入图片");
    wx.chooseImage({
      count: 1,
      success: (res) => {
        that.setData({
          images:that.data.images.concat(res.tempFilePaths)
        })
        var img=that.data.images;
        // that.data.images = images.length <= 3 ? images : images.slice(0, 3);
        for (let index = 0; index < img.length; index++) {
          this.editorCtx.insertImage({
            src:that.data.images[index],
            data: {
              id: 'abcd',
              role: 'god'
            },
            success: () => {
              console.log('insert image success')
            }
          })
        }
  
      }
    });
  },
  //选择图片
  chooseImage(e) {
    console.log("选择图片");
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths);
        this.data.images = images.length <= 3 ? images : images.slice(0, 3);
      }
    })
  },
  //查看详细页面
  toDeatil() {
    this.editorCtx.getContents({
      success: (res) => {
        console.log(res.html)
        app.globalData.html = res.html
      },
      fail: (res) => {
        console.log("fail：", res);
      }
    });
  },
 
  // 当是博客本人点击编辑时，进行事件触发
  onEdit(){
    
  }
})