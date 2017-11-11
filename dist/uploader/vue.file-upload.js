/* globals FormData, Promise, Vue */
// define
var uploadList = []
var siteUrl = $(location)[0].origin + '/' + $(location)[0].pathname.split('/')[1] + '/' + $(location)[0].pathname.split('/')[2] + '/'

var Uploader = new Vue({
  el: '#app',
  data: {
    fileProgress: 0 // global progress
    ,allFilesUploaded: false // is everything done?
    ,uploadForms: []
    ,uploadFormsStatus:{
      pdf:false
      ,native:false
    }
    ,taskLoadStatus:false
    ,IDS:[]
    ,idCounter:0
    ,UploadForm:{
        UploadZone:{
            Enable:true
            ,Text:'Upload'
            ,Visibility:true
        }
        ,AddNew:{
            Text:'+ Add'
            ,Enable:true
            ,Visibility:true
        }
      ,AfterUpload:{
        addNewUploader:true
      }
    }
    ,UploadList:{
        Delete:{
            Text:'Delete'
            ,Enable:true
        }
    }
  },
  created() {
    this.CreateUploader()
  },
  watch:{
    taskLoadStatus:function(){
      if(this.getTask()==true){
        this.fetchData();
      }
	}
	,idCounter:function(nv){
		//this.idCounter++;
	  }
  },
  methods: {
    DisableAll:function(){
        this.UploadList.Delete.Enable=false;
        this.UploadForm.UploadZone.Enable=false;
        this.UploadForm.AddNew.Enable=false;
    },
    EnableAll:function(){
        this.UploadList.Delete.Enable=true;
        this.UploadForm.UploadZone.Enable=true;
        this.UploadForm.AddNew.Enable=true;
    },
    getFilesIDS:function(){
      this.IDS=[];
      uploadList.forEach(function(element) {
        this.IDS.push(element.Id);
      }, this);
      return this.IDS;
    }
    ,getTask:function () {
        if(task.task.Entity.Id!=undefined){
          return true;
        }
    }
    ,fetchData() {

      return;


      var t = this
      // if (QueryString.ppid == undefined) {
      //   t.$http.get(siteUrl + '/_vti_bin/thinkxpert.pdms/PDMSBase.svc/GetEntityDocuments/' + task.task.Entity.Id)
      //     .then(result => {
      //       try {
      //         var result = result.data
      //         // console.log('Data length'+result.length)
      //         if (result.length != undefined) {
      //           var UploadResult = JSON.parse(result)
      //           $.each(UploadResult, function (index, value) {
      //             uploadList.push(value)
      //           })
      //         }
      //       } catch(rr) {
      //         console.log(rr)
      //       }
      //     });/// End Ajax Query
      // // }
      // t.addUploader()
    }
    ,removeUploader:function(key){
      this.uploadForms.splice(key,1);
    }
    ,addUploader: function (r1,c1,callBack) {
        if(Uploader.UploadForm.AddNew.Enable==false){
            return false;
        }
        
        this.idCounter++;
        // console.log(Uploader.uploadForms.length);

        Uploader.uploadForms.push(0);
        var newID = Uploader.uploadForms.length;
        if(callBack!=undefined){
          setTimeout(function() {
            callBack(newID);
          }, 100);

        }


        return newID;
    }
    ,CreateUploader: function () {
      var FileUploadComponent = Vue.component('upload-list', {
        template: '\
        <div class="text-left" style="margin:0px;padding:0px;" v-if="uploadList.length>0">\
          <table class="table table-hover">\
            <thead><tr class="row"><th class="my-sm-col">#</th><th class="col-sm-1">Actions</th><th class="col-sm-1">type</th><th class="col-sm-7">File Name</th><th class="col-sm-1">Size</th></tr></thead>\
            <tbody>\
                <tr class="row" v-for="(item,key) in uploadList">\
                  <td class="my-sm-col">{{rowCounter(key)}}</td>\
                  <td class="col-sm-1"><button :disabled="Uploader.UploadList.Delete.Enable==false" v-on:click="deleteItem(item,key)" class="btn btn-link delete deleteFile" :itemID="item.Id" v-if="fileDeletable(item)===true" style="text-align:left;padding:0px;">{{Uploader.UploadList.Delete.Text}}</button></td>\
                  <td class="col-sm-1">{{item.ftype}}</td>\
                  <td class="col-sm-7"><img :src="generateIconURL(item.iconUrl)" class="icon"><a :href="item.FileURL">{{item.FileName}}</a></td>\
                  <td class="text-right col-sm-1"><span v-html="getFileSize(item.FileSize)">{{getFileSize(item.FileSize)}}</span></td>\
                </tr>\
            </tbody>\
          </table>\
        </div>\
        '
        ,props:{
          deletable:{
            type:String
            ,default:'always'
          }
        }
        ,data: function () {
          return {
            uploadList
          }
        }
        ,methods: {
          rowCounter:function(key){
            return key+1;
          }
          ,fileDeletable:function(item){
            if(this.deletable=='validate'){
              return true;
            }
            return false;
          }
          ,getFileSize: function (fileSize) {
            if (fileSize > 1024) {
              fileSize = (fileSize / 1024)
            }
            // fileSize=Math.round(fileSize);
            if(fileSize<1024){
              fileSize=roundUp(fileSize,1);
              fileSize+=' <span style="color:gray;">KB</span>';
            }else{
              fileSize=(fileSize/1024);
              if(fileSize<1024){
                fileSize=roundUp(fileSize,1);
                fileSize+=' <span style="color:gray;">MB</span>';
              }
              if(fileSize<1024){
                fileSize=roundUp(fileSize,1);
                fileSize+=' <span style="color:gray;">GB</span>';
              }
            }

            return fileSize;
          },
          generateIconURL: function (fname) {
            return '/_layouts/15/images/' + fname
          },
          deleteItem: function (item, index) {
            var currentEl = $("[itemID='" + item.Id + "']");
            var mf=$(currentEl).closest('tbody').find('tr');
            mf=mf[index];
            $(mf).find('a.delete').text('Deleting...');

            // this.$http.get(siteUrl + '/_vti_bin/thinkxpert.pdms/PDMSBase.svc/DeleteEntityDocuments/' + item.Id)
            this.$http.get('http://localhost/revisionStartUp/delete.php')
              .then(result => {
                var result = result.data
                if (result != '') {
                  if (result == 'ok') {
                    // uploadList.splice(index, 1);
                    $(mf).animate({opacity:'0','backgroundColor':'red'},'slow',function(){
                      $(mf).animate({opacity:'1','backgroundColor':'green'},'slow',function(){
                        let i = uploadList.map(item => item.Id).indexOf(item.Id) // find index of your object
                        uploadList.splice(i, 1) // remove it from array
                        $(mf).find('a.delete').text('Delete');
                        switch(item.ftype){
                          case'pdf':
                            Uploader.uploadFormsStatus.pdf=false;
                          break;
                          case'native':
                            Uploader.uploadFormsStatus.native=false;
                        break;
                        }
                        
                      });
                    });
                    // Uploader.addUploader();
                  }
                }
              });
          }
        }
      })

      FileUploadComponent += Vue.component('file-upload', {
        template: '<div style="display:none;" v-if="visibilityControler()==true">\
		<button style="display:none;" v-on:click="$emit(\'removeElement\')">X {{ikey}}</button>\
          <div class="fg form-group" id="drop_zone" @dragover="handleFileDragOver" @drop="handleFileDrop" :st="uploaderVisibility" >\
            <input type="file" style="display:none;"  class="form-control" id="file" name="file" v-on:click="fileInputClick" v-on:change="fileInputChange" :isUploaded="updone" drop="" >\
            <button class="browse btn" :disabled="fmx.UploadZone.Enable==false" v-if="DropZoneVisibility()==true" v-on:click="openBrowser">{{UploadZoneText}}</button>\
            <div class="cancel" style="display:none;"><input type="button" class="btn" value="Cancel" v-on:click="CancelUpload"/></div>\
            <div v-if="progressVisibility==true">\
            <div class="progress" style="margin-bottom:0px;" v-if="fileProgress>0">\
              <div class="progress-bar progress-bar-striped active" role="progressbar" :aria-valuenow="fileProgress" aria-valuemin="0"aria-valuemax="100" style="width:0%" :style="{width:fileProgress+\'%\'}">\
                {{fileProgress}}%\
              </div>\
            </div>\
          </div>\
          </div>\
        </div>\
		</div>\
      ',
	  events:{
      removeElement:function(elIndex){
        console.log('Event run');
      }
    }
    ,props: {
        ftype:{
          type:String
        }
        ,ikey:{
          type:String
        }
        ,fmx:{
          type:Object
        }
        ,au2:{
          type:Object
        }
       ,name: {
          type: String,
          required: true
        },
        Myonp:{
          type:Object
        }
        ,id: String,
        action: {
          type: String,
          required: true
        },
        headers: Object,
        method: String
      }
      ,data: function () {
        return {
          thisCells:{},
          myFiles: [], // a container for the files in our field
          fileProgress: 0,
          updone: false,
          UploadZoneText: this.fmx.UploadZone.Text,
          BrowseStatus: 'ready',

          Enable: this.fmx.UploadZone.Enable,
          uploaderVisibility: true,
          progressVisibility: true,
          UploadedLists: [],
          UploadedIds: []
        }
      },
        methods: {
          
          callBackProgress:function(nc,progressStatus){
            var tc=this;
            var cb=tc.Myonp;
            cb(tc.thisCells,progressStatus);
          }
          ,getKey:function(){
            return "dd"+ikey;
          }
          ,AfterUploadCallBack:function(f,d,c){
            var tc=this;
            var au2=tc.au2;
            if(au2!=undefined){
              au2(f,d,c);
            }
          }
          ,DropZoneVisibility:function(){
              var tc=this;
              return tc.fmx.UploadZone.Visibility;
          },
          DropZoneEnable:function(){
              var tc=this;
              return tc.fmx.UploadZone.Enable;
          },
          visibilityControler:function(){
            var tc=this;
            if(tc.uploaderVisibility==false){
              console.log($('.fg').attr('st'));
            }
            return tc.uploaderVisibility;
          }
          ,handleFileDragOver: function (evt) {
            evt.stopPropagation()
            evt.preventDefault()
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
          },
          handleFileDrop: function (evt) {
            var tc=this;
            evt.stopPropagation()
            evt.preventDefault()

            var files = evt.dataTransfer.files; // FileList object.

            // files is a FileList of File objects. List some properties.
            var output = []
            

            for (var i = 0, f; f = files[i]; i++) {
              if (i > 0) {
                break
              }
              tc.myFiles.push(f)
              tc.fileUpload();
              tc.myFiles = [];
            }
          },
            openBrowser: function (cells) {
              var tc=this;              
              // if(cells!=null){
              //   tc.cell.row=cells.row
              //   tc.cell.col=cells.col
              //   // console.log(cells);
              // }
              tc.thisCells=cells;
              // console.log('this is a cells');
              // console.log(tc.thisCells);
              if(tc.DropZoneEnable()==false){
                  return false;
              }
              if (tc.BrowseStatus == 'ready') {
                try{
                  // tc.$el.lastChild.parentNode.lastChild.children.file.click();
                  tc.$el.children.drop_zone.children.file.click();
                  // console.log(tc.cell.row+' - '+tc.cell.col);
                }catch(e){
                  console.log(tc);
                }
              
              //this.$el.lastChild.parentNode.children.file.click()
            // this.$el.children.drop_zone.children.file.click()
              }
          },
          CancelUpload: function () {},
          fileUpload: function () {
            var tc=this;
            tc.progressVisibility = true
            if (tc.myFiles.length > 0) {
              // a hack to push all the Promises into a new array
              console.log(tc);
              var arrayOfPromises = Array.prototype.slice.call(tc.myFiles, 0).map(function (file) {
                return tc._handleUpload(file,tc.thisCells);
              }.bind(this))
              // wait for everything to finish
              Promise.all(arrayOfPromises).then(function (allFiles) {
                tc.$emit('onAllFilesUploaded', allFiles);
              }.bind(this)).catch(function (err) {
                console.log(err);
                tc.$emit('onFileError', this.myFiles, err)
              }.bind(this))
            } else {
              // someone tried to upload without adding files
              var err = new Error('No files to upload for this field')
              tc.$emit('onFileError', tc.myFiles, err)
            }
          },
          fileInputClick: function () {
            // click actually triggers after the file dialog opens
            // console.log(this)
            this.$emit('onFileClick', this.myFiles)
          },
          fileInputChange: function () {
            var tc=this;
            tc.fileProgress = 0
            var ident = 'file'
            var files = document.getElementsByName(ident)
            tc.myFiles = []

            var cvm = this;
            Array.prototype.forEach.call(files, function (element) {
              if (typeof (element.files[0]) != 'undefined') {
                tc.myFiles.push(element.files[0])
                tc.fileUpload();
                element.value = ''
                tc.myFiles = [];
              }
            })
            tc.$emit('onFileChange', tc.myFiles)
          },
          AfterUpload: function (file, res,c) {
            var tc=this;
            tc.BrowseClickEvent = ''
            tc.progressVisibility = false

            var UploadResult =JSON.parse(res);

            if(UploadResult.result=="failed"){
              tc.uploaderVisibility = false;
              tc.BrowseStatus = 'ready';
              modal.Message.Header.Text="Error";
              modal.Message.Header.Visibility=true;
              modal.Message.Body.Text=UploadResult.message+"<br/>Please try again";
              modal.Message.Body.Visibility=true;
              modal.Message.Footer.Visibility=true;
              modal.Message.Footer.Button.Text="Ok";
              modal.Message.Footer.Button.Visibility=true;

            }else{
              tc.uploaderVisibility = false;
              tc.UploadedLists.push(res)
              tc.BrowseStatus = 'ready';

              // console.log(this.aue);

              if(tc.ftype=='pdf'){
                Uploader.uploadFormsStatus.pdf=true;
              }else if(tc.ftype=='native'){
                Uploader.uploadFormsStatus.native=true;
              }
              uploadList.push(UploadResult);


              console.log(c.row+" , "+c.col);
              tc.AfterUploadCallBack(c.row,c.col,UploadResult);
              //tc.$emit('AfterUploadCallBack()');
              // Uploader.uploadForms.pop();
              if(Uploader.UploadForm.AfterUpload==true){
                //Uploader.addUploader();
              }
              // Uploader.$el.children[0].children[0].children[0].children[this.ikey].remove();
              // Uploader.uploadForms.splice(this.ikey,1);
              // console.log(this.ikey);
            }
            tc.UploadZoneText =tc.fmx.UploadZone.Text
          },
          _onProgress: function (e,cc) {
            var tc=this;
            // this is an internal call in XHR to update the progress
            e.percent = (e.loaded / e.total) * 100
            // console.log('onFileProgress', e.percent)
            // update our progress bar
            var pr=Math.round(e.percent);
            tc.fileProgress = pr;
            console.log(cc);
            tc.callBackProgress(cc.thisCells,pr);
            
            if (tc.fileProgress == 100) {
              tc.UploadZoneText = 'Saving...'
              tc.BrowseStatus = 'saving'
            } else {
              tc.UploadZoneText = 'Sending...'
              tc.BrowseStatus = 'sending'
            }
            tc.$emit('onFileProgress', e);
          },
          _handleUpload: function (file,c) {
            var tc=this;
            tc.$emit('beforeFileUpload', file)
            var form = new FormData()
            var xhr = new XMLHttpRequest()
            try {
              form.append('Content-Type', file.type || 'application/octet-stream')
              // our request will have the file in the ['file'] key
              form.append('file', file)
            } catch (err) {
              tc.$emit('onFileError', file, err)
              return
            }
            
            return new Promise(function (resolve, reject) {
              // xhr.upload.addEventListener('progress', tc._onProgress, false);
              xhr.upload.addEventListener('progress',function(){
                tc._onProgress(event,tc);
              }, false);
             xhr.onreadystatechange = function () {
                if (xhr.readyState < 4) {
                  return
                }
                if (xhr.status < 400) {
                  var res = JSON.parse(xhr.responseText)
                  tc.$emit('onFileUpload', file, res)
                  resolve(file);
                  tc.AfterUpload(file, res,c);
                } else if (xhr.status == 404) {
                  alert('404 Error')
                  tc.UploadZoneText = tc.fmx.UploadZone.Text
                  tc.BrowseStatus = 'ready'
                  tc.fileProgress = 0
                } else {
                  var err = JSON.parse(xhr.responseText)
                  err.status = xhr.status
                  err.statusText = xhr.statusText
                  tc.$emit('onFileError', file, err)
                  reject(err)
                }
              }.bind(this)

              xhr.onerror = function () {
                var err = JSON.parse(xhr.responseText)
                err.status = xhr.status
                err.statusText = xhr.statusText
                this.$emit('onFileError', file, err)
                reject(err)
              }.bind(this)
              var d=Date.now();
              var uploadUrl = 'upload.php?ftype='+tc.ftype+'&'+d+'='+d;
              if (QueryString.ppid == undefined){
                // uploadUrl = siteUrl + '_vti_bin/thinkxpert.pdms/Upload.svc/FileUpload/' + task.task.Entity.Id + '/' + task.task.DisciplineId + '/' + file.name; // entityId,disciplineId
              }else{
                // uploadUrl = siteUrl + '_vti_bin/thinkxpert.pdms/Upload.svc/FileUploadNewEntity/' + QueryString.vendoraccountid + '/' + QueryString.ppid + '/' + file.name; // vaid,ppid
              }

              xhr.open(tc.method || 'POST', uploadUrl, true)
              if (tc.headers) {
                for (var header in tc.headers) {
                  xhr.setRequestHeader(header, tc.headers[header])
                }
              }
              xhr.send(form)
              // this.$emit('afterFileUpload', file)
              tc.$emit('afterFileUpload', file)
            }.bind(this))
          } // / End _handleUpload
        }
      })
    }//// End Create Uploader
  }//// methods end
})

// register
// Vue.component('file-upload', FileUploadComponent)
