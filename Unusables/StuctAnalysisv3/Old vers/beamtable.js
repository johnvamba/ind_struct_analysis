//instantiate on document


var beamTable = (function(){
  var _memberID, _table, _fields, _headers, _default;

  function _buildRowColumn (names, item) {
    var row = '<tr>';
    if(names && names.length > 0){
      $.each(names, function(index, name){
        var c= item ? item[name+''] : name;
        switch(name){
          case 'memberID':
            c='<i class="edit link member id'+c+' icon" onclick="javascript:change('+c+')"></i><a class="selectable" onclick="showMsc()">Member '+c+'</a>';
          break;
          case 'length':
            c=item ? item[name+''] : name;
          break;
          case 'elast':
            c=item ? item[name+''] : name;
          break;
          case 'inersia':
            c=item ? item[name+''] : name;
          break;
          case 'startjoint':
            c ='<h5 class="ui header"><img class="ui rounded image" src='
              +c.photo+'><div class="content">'
              +c.name+'<div class="sub header">'
              +c.forces+'</div></div></h5>';
          break;
          case 'endjoint':
            c ='<h5 class="ui header"><img class="ui rounded image" src='
              +c.photo+'><div class="content">'
              +c.name+'<div class="sub header">'
              +c.forces+'</div></div></h5>';
          break;
          case 'memload':
          // console.log(c);
            c ='<h5 class="ui header"><img class="ui rounded image" src='
              +c.photo+'><div class="content">'
              +c.name+'<div class="sub header">'
              +c.force+' '
              +c.unit+'</div></div></h5>';
          break;
        }

        row += '<td>' + c + '</td>';
      });
    }
    row += '</tr>';
    return row;
  }

  function _editData(names, item){
    var row = ''; 
    if(names && names.length > 0){
      $.each(names, function(index, name){
        var c= item ? item[name+''] : name;
        switch(name){
          case 'memberID':
            c='<i class="edit link member id'+c+' icon" onclick="javascript:change('+c+')"></i><a class="selectable" onclick="showMsc('+c+')">Member '+c+'</a>';
          break;
          case 'length':
            c=item ? item[name+''] : name;
          break;
          case 'elast':
            c=item ? item[name+''] : name;
          break;
          case 'inersia':
            c=item ? item[name+''] : name;
          break;
          case 'startjoint':
            c ='<h5 class="ui header"><img class="ui rounded image" src='
              +c.photo+'><div class="content">'
              +c.name+'<div class="sub header">'
              +c.forces+'</div></div></h5>';
          break;
          case 'endjoint':
            c ='<h5 class="ui header"><img class="ui rounded image" src='
              +c.photo+'><div class="content">'
              +c.name+'<div class="sub header">'
              +c.forces+'</div></div></h5>';
          break;
          case 'memload':
          // console.log(c);
            c ='<h5 class="ui header"><img class="ui rounded image" src='
              +c.photo+'><div class="content">'
              +c.name+'<div class="sub header">'
              +c.force+' '
              +c.unit+'</div></div></h5>';
          break;
        }

        row += '<td>' + c + '</td>';
      });
    }
    return row;
  }

  function _setHeaders(){
    _headers = (_headers == null || _headers.length < 1) ? _fields : _headers; 
    var h = _buildRowColumn(_headers);
    if (_table.children('thead').length < 1) _table.prepend('<thead></thead>');
    _table.children('thead').html(h);
  }

  function _setNoItemsInfo() {
    if (_table.length < 1) return; //not configured.
    var content = '<tr class="no-items disabled"><td colspan="7" style="text-align:center">' + 
      _default + '</td></tr>';
    if (_table.children('tbody').length > 0)
      _table.children('tbody').html(content);
    else _table.append('<tbody>' + content + '</tbody>');
  }

  function _removeNoItemsInfo() {
    var c = _table.children('tbody').children('tr');
    if (c.length == 1 && c.hasClass('no-items disabled')) _table.children('tbody').empty();
  }

  return {
    /** Configures the dynamic table. */
    config: function(tableId, fields, defaultText) {
      _memberID = tableId;
      _table = $('#' + tableId);
      _fields = fields || null;
      _default = defaultText || 'No items to list...';
      _setNoItemsInfo();
      return this;
    },
    /** Loads the specified data to the table body. */
    load: function(data, append) {
      if (_table.length < 1) return; //not configured.
      _removeNoItemsInfo();
      if (data && data.length > 0) {
        var rows = '';
        $.each(data, function(index, item) {
          rows += _buildRowColumn(_fields, item);
        });
        var mthd = append ? 'append' : 'html';
        _table.children('tbody')[mthd](rows);
      }
      else {
          _setNoItemsInfo();
      }
      return this;
    },
    // overwrite
    edit: function(data, row){
      var some = '';
        $.each(data, function(index, item) {
          some += _editData(_fields, item);
        });
      row.html(some);
    },
    delete: function(row){
      // _setNoItemsInfo();

    },
    /** Clears the table body. */
    clear: function() {
      _setNoItemsInfo();
      return this;
    },
    disableEdit:function(){
      //hides edit button
    }
  };

});

// function addBtn(){
//   var data = getDataForm();
// }
var count=0;

function getDataForm(){
  var _memID, sjoint, ejoint, mload, l,e,i;
  _memID=count++;


  //jquery

  //load dropdown
  $('.loadDD').dropdown({
    onChange: function(value, text, $choice){
      url='assets/loadtypes/'+value+'.png';
      $('.beamload').attr('src', url);
      if(value!=='noload') $('.field.load').show();
      else $('.field.load').hide();

    }    
  });
  //joint dropdown
  $('.start.jointDD').dropdown({
    onChange: function(value, text, $choice){
      url='assets/jointfaces/'+value+'.png';
      $('.start.jointImg').attr('src', url);
      switch(value){
        case 'none':
        $('.field.start').show();
        $('.start .y-coor').show();
        break;
        case 'startfix':
        $('.field.start').hide();
        break;
        case 'roller':
        $('.field.start').show();
        $('.start .y-coor').hide();
        break;
        case 'pin':
        $('.field.start').show();
        $('.start .y-coor').hide();
        break;
        default:
        $('.y-coor').show();
        $('.field.start').show();
        break;
      }
    }
  });
  
  $('.end.jointDD').dropdown({
    onChange: function(value, text, $choice){
      url='assets/jointfaces/'+value+'.png';
      $('.end.jointImg').attr('src', url);
        switch(value){
        case 'none':
        $('.field.end').show();
        $('.end .y-coor').show();
        break;
        case 'endfix':
        $('.field.end').hide();
        break;
        case 'roller':
        $('.field.end').show();
        $('.end .y-coor').hide();
        break;
        case 'pin':
        $('.field.end').show();
        $('.end .y-coor').hide();
        break;
        default:
        $('.y-coor').show();
        $('.field.end').show();
        break;
      }
    }
  });




  return [{
    memberID: _memID,
    startjoint:{
      photo:'assets/jointfaces/startfix.png',
      name: 'Fix',
      forces: 'has Forces'
    },
    endjoint:{
      photo:'assets/jointfaces/endfix.png',
      name: 'Fix',
      forces: 'has Forces'
    },
    memload:{
      photo:'assets/jointfaces/sample.png',
      name: 'Concentrate',
      force: 503,
      unit: 'KN'
    },
    length:1000,
    elast:4558,
    inersia:555
  }];
}