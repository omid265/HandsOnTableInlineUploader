Vue.component('modal', {
    template: '\
    <transition name="modal">\
      <div class="modal-mask">\
        <div class="modal-wrapper">\
          <div class="modal-container">\
              <div class="modal-header" :style="Message.Header.Visibility==false?\'display:none;\':\'\'">\
              <div name="header" v-html="Message.Header.Text"></div>\
            </div>\
              <div class="modal-body" :style="Message.Body.Visibility==false?\'display:none;\':\'\'">\
              <div name="body" v-html="Message.Body.Text"></div>\
            </div>\
              <div class="modal-footer"  :style="Message.Footer.Visibility==false?\'display:none;\':\'\'">\
              <slot name="footer">\
                <button class="btn btn-primary" @click="$emit(\'close\')">\
                {{Message.Footer.Button.Text}}\
                </button>\
              </slot>\
            </div>\
          </div>\
        </div>\
      </div>\
    </transition>'
    ,props:{
      Message:{type:Object}
    }
});

var modal=new Vue({
    el: '#modalApp'
    ,methods:{
      close(beforeClose,afterClose){
        
          if(beforeClose!=undefined){
            if(beforeClose.length>0){
              beforeClose.call(this);
            }
          }

          this.showModal=false;

          if(afterClose!=undefined){
              afterClose.call(this);
          }
        
        
      }/// end close function
    }
    ,data: {
      showModal: false
      ,Message:{
        Header:{
          Text:'blablabla'
          ,Visibility:false
        }
        ,Body:{
          Text:'<img class="loading" src="http://pdms.thinkxpert.ir/_layouts/15/images/gears_anv4.gif?rev=23"> Working on it..'
          ,Visibility:false
        }
        ,Footer:{
          Text:''
          ,Visibility:false
          ,Button:{
            Text:''
            ,Visibility:false
          }
        }
      }
    }
  });