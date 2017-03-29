  var fieldName = ['memberID', 'startjoint','endjoint','memload','length','elast','inersia'];
  var sample = [{
    memberID:0,
    startjoint:{
      photo:'assets/jointfaces/sample.png',
      name: 'Fix',
      forces: 'has Forces'
    },
    endjoint:{
      photo:'assets/jointfaces/sample.png',
      name: 'Fix',
      forces: 'has Forces'
    },
    memload:{
      photo:'assets/jointfaces/sample.png',
      name: 'Concentrate',
      force: 50,
      unit: 'KN'
    },
    length:1000,
    elast:4558,
    inersia:555}];
var bTable;
var bInfo;

$(document).ready(function(){
  // var 
  bTable = new beamTable().config("memTable",fieldName,"This beam has no members");
  bInfo = new BeamInfo();
  //member table


  // var bControl = new BTController().config('memSetting');

  

  $('.ui.accordion').accordion();
  $('.menu .item').tab();

  $('.ui.dropdown').dropdown({ //does work but for all dropdown..
    // on: 'click'
    // action: "select",
    onChange: function (value, text, $choice) { //takes no effect. delete later
        // alert(text); //returns the text inside div item
        // console.log(value); //returns the data-value of choice
    }
  });

  $('.group').hide();
  $('#beamform').show();

  $('#beamDD').dropdown({
    onChange: function (value, text, $choice) {
      // alert(text); //returns the text inside div item
      // console.log(value); //returns the data-value of choice
      url='assets/beamtypes/'+value+'.png';
      $('#beamtitle').text(text);
      $('#beampic').attr("src", url);
      $('#beamImg').attr("src", url);
      
      bInfo.config(value);
      console.log(bInfo);
      // forms 
      $('.group').hide();
      $('#'+value).show();
    }
  });

  //jquery modals
  //buttons
  $('#illustbutton').click(function(){
      $('#drawing')
        .modal({
          onShow:function(){
            $('.grey.button')
            .popup({
              on:'click',
              // inline:true,
              lastResort: 'bottom right',
              setFluidWidth: true,
              popup:'.ui.popup'
            });
          },
          closable:false,
          onApprove : function() {
            //displays info outside modal.
            return false;
          }
        })
      .modal('show');
    });

  $('#calcubutton').state({
    text: {
      inactive : '<i class="calculator icon"></i>Calculate Beam',
      loading: 'Loading',
      active   : '<i class="check icon"></i>Beam Calculated'
    }
  });

  $('#addMem').click(function(e) {
    var data = getDataForm();
    $('#memSetting')
      .modal(
      {
        onShow: function(){
          $(this).children('.header').text('Add Member');
          $(this).find('.cancel.button').hide();
        },
        onApprove : function() {
          //modify data
          bTable.load(data,true);
        }
      })
      .modal('show');
  });

  $('#material').click(function(e) {
    $('#matModal')
      .modal({
        onApprove : function() {
          bInfo.getValues();
          bInfo.getDisplay();
        }
      })
      .modal('show');
  });

}); //end $(document)

  // Non jquery functions
  function closeThis(){
    $('#drawing').modal('hide');
  }
  function change(id){
    var data = getDataForm(); //follow sample data scheme
    var row = $('.member').closest('tr').find('.id'+id).parent().parent();
    sample[0].memberID = id;
    console.log(row.html());
    $('#memSetting')
      .modal(
      {
        onShow: function(){
          $(this).children('.header').text('Edit Member');
          $(this).find('.cancel.button').text('Revert changes');
        },
        closable  : false,
        onDeny    : function(){

        },
        onApprove : function() {
          //modify data
          bTable.edit(sample, row);
        }
      })
      .modal('show');
  };


  function showMsc(id){
    $('#msc')
      .modal({
        onApprove : function() {
          //displays info outside modal.
        }
      })
      .modal('show');
  }
  
  // function deleteRow(obj){ //javascript:deleteRow(this) add this to row button.
  //   // $('#msc')
  //   //   .modal({
  //   //     onApprove : function() {
  //   //       //displays info outside modal.
  //   //     }
  //   //   })
  //   //   .modal('show');
  //   var index = obj.parentNode.parentNode.rowIndex;
  //   var table = document.getElementById("memTable");
  //   table.deleteRow(index);
  //   console.log(index);
  // }

  // 