var QueryString = function () {
    var query_string = {}
    var query = window.location.search.substring(1).toLowerCase()
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = decodeURIComponent(pair[1])
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])]
        query_string[pair[0]] = arr
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]))
      }
    }
    return query_string
  }();//// End QueryString

  function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
  }

//   document.createElement('\
//   <script src="assets/js/lib/jquery-3.2.1.min.js"></script>\
//   <script src="assets/js/lib/bootstrap/popper.min.js"></script>\
//   <script src="assets/js/lib/bootstrap/bootstrap.min.js"></script>\
//   <script src="assets/js/lib/bootstrap/bootstrap-datepicker.min.js"></script>\
//   <script src="assets/js/lib/vue/vue.min.js"></script>\
//   <script src="assets/js/lib/vue/vue-resource.min.js"></script>\
//   ');
//   var imported = document.createElement('script');
//   imported.src = 'assets/js/lib/jquery-3.2.1.min.js';
//   document.head.appendChild(imported);
//   imported = document.createElement('script');
//   imported.src = 'assets/js/lib/popper.min.js';
//   document.head.appendChild(imported);
//   imported = document.createElement('script');
//   imported.src = 'assets/js/lib/bootstrap.min.js';
//   document.head.appendChild(imported);
//   imported = document.createElement('script');
//   imported.src = 'assets/js/lib/bootstrap-datepicker.min.js';
//   document.head.appendChild(imported);
//   imported = document.createElement('script');
//   imported.src = 'assets/js/lib/vue.min.js';
//   document.head.appendChild(imported);
//   imported = document.createElement('script');
//   imported.src = 'assets/js/lib/vue-resource.min.js';
//   document.head.appendChild(imported);