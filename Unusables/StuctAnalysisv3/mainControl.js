//external variables
var  //MSC Controls
  shapecontrol, 
  beamtable, 
  dataOBJ, 
  illustrate,
  lastJointObj,
  membercount=0;


var thisDocument = function(){
  var formModal = 'memberForm',
      $modal = $('.' + formModal),
      formName = 'CRmember',
      $form = $('.' + formName),
      mscModal = $('#msc'),

      //dropdowns
      beamtype = 'beamtype',
      $beamDropdown = $('#'+beamtype),
      loadtype = 'loadDD',
      $loadDD = $('#'+loadtype),
      jointStart = 'jointType-s',
      $jointS = $('#'+jointStart),
      jointEnd = 'jointType-e',
      $jointE = $('#'+jointEnd),
      
      //buttons
      $addMember = $('.icon.member.button'),
      checkShape = $('#checkShape'),
      editIcon = '.edit.link.member.icon',
      mscLink = '.selectable.msc'
      // EditMember = $('.edit.link.member.icon') //cant be located
      ;

  //initialize
  $form.form(formValid);
  shapecontrol = new MemberShape();
  beamtable = new beamTable().init();
  dataOBJ = new DataStruct();
  illustrate = new Illustrator();
  $('.menu .item').tab();

  function setupDropdown(){
    $beamDropdown.dropdown({
      // on: 'click',
      onChange: function (value, text, $choice) { 
        if (value!=='basic'){
          $('.dimlabel').show();
          shapecontrol.config(value);
        } else $('.dimlabel').hide();
        url='assets/beamtypes/'+value+'.png';
        $('#beampic').attr("src", url);
        $('.groupDim').hide();
        $(dimensions[value]).each(function(index,name){ //Fixed
          $('.'+name).show();
        });
      }
    });

    checkShape.click(function(){
      shapecontrol.calc();
      shapecontrol.display();
    });

    $loadDD.dropdown({
      // on:'click',
      onChange:function(value, text, $choice){
        url='assets/loadtypes/'+value+'.png';
        field = $form.form('get field', 'loadAmount');
        $('.image.beamload').attr('src', url);
        if(value !== 'noload'){
          if (value ==='equally' || value ==='left_con' || value ==='right_con'){
            field.prop('placeholder', 'in kN/m');
          } else {
            field.prop('placeholder', 'in kN');
          }
          $('.Load').show();
        } 
        else $('.Load').hide();
      }
    });

    $jointS.dropdown({
      // on:'click',
      onChange:function(value,text,$choice){
        url='assets/jointfaces/'+value+'.png';
        $('.image.start.jointImg').attr('src', url);

        $('.start .coor').hide();
        // hideDD(value);
        $(joint[value]).each(function(index,name){
          $('.start .'+name).show();
        });
      }
    });

    $jointE.dropdown({
      // on:'click',
      onChange:function(value,text,$choice){
        url='assets/jointfaces/'+value+'.png';
        $('.image.end.jointImg').attr('src', url);

        $('.end .coor').hide();
        $(joint[value]).each(function(index,name){
          $('.end .'+name).show();
        });
      }
    });
  }

// Buttons
  $addMember.click(function(){
    $form.form('clear');
    $form.form('get field', 'y_bcoor').prop('disabled', false);
    $form.form('get field', 'r_bcoor').prop('disabled', false);
    $('.image.jointImg').attr('src', 'assets/jointfaces/none.png');
    $('.image.beamload').attr('src', 'assets/loadtypes/noload.png');
    $('#beampic').attr('src', 'assets/beamtypes/basic.png');

    if(lastJointObj){
      $form.form('set values', {
        jointBtype: lastJointObj.jointEtype,
        y_bcoor: lastJointObj.y_ecoor,
        r_bcoor: lastJointObj.r_ecoor
      });

      $('.jointBtype').addClass('disabled');
      $form.form('get field', 'y_bcoor').prop('disabled', true);
      $form.form('get field', 'r_bcoor').prop('disabled', true);

      if(lastJointObj.jointEtype ==='endfix'){
        alert('Last joint is type "fix"');
        return;
      }
    }

    $modal
    .modal({
      onShow: function(){
        $('.dimdata').hide();
        setupDropdown();
      },
      onApprove: function(){
        if ($('.CRmember').form('is valid')){
          $('.CRmember').form({
            on:'submit',
            onSuccess: returnSuccess(),
          });
        }
        return false;
      }
    }).modal('show');

  }); //click add button

  illu.click(function(){
     $('#illumodal').modal('show');

    // console.log(illustrate.state());
    if(illustrate.state()){ // add condition.

       var c = dataOBJ.forIlluData();
       console.log('illu called');
       console.log(c);
       illustrate.initIllu(c); //bugged
    }

    var hasdata = dataOBJ.hasData();
    illustrate.showIllu(hasdata);

  }); //end Illu

  //calculator button
  calc.state({ //slightly fixed
    text: {
      // inactive : '<i class="calculator icon"></i>Calculate Beam',
      // loading: 'Loading',
      active: '<i class="check icon"></i>Beam Calculated'
    }
  });

  calc.one('click',function(){
    beamtable.disableEdit();
    // activate react button
    //calculation funciton here.
    var c = dataOBJ.calcAll();
    console.log(c);
    illustrate.addResult(c);
    illustrate.calculate();

    $(this).addClass('positive');
    react.removeClass('disabled');
    illu.removeClass('disabled');
    $addMember.addClass('disabled');
    // return false;
  });

  react.click(function(){
    $('#reaction').modal('show');
    // alert('Reaction');
  });


  $('tbody').on('click', editIcon, function(){
    alert('Disabled function ATM, will be added');
    var row = $(this).closest('tr');
    var id = row.attr('id');
    console.log(id);
  });

  // $('tbody').on('click', '.close.icon', function(){
  //   var row = $(this).closest('tr');
  // });

  $('tbody').on('click', mscLink, function(){
    $('#msc').modal('show');
    var row = $(this).closest('tr');
    var id = row.attr('id');
    console.log(id);
    dataOBJ.getMSC(id);
  });
  // });

  //return after Addbutton
  function returnSuccess(){
    // console.log('success');
    shapecontrol.calc();
    var formData = $form.form('get values'),
        matData = shapecontrol.getCalcValues(),
        matDimData = shapecontrol.getDimValues();
        //***********************
      lastJointObj = $form.form('get values',['jointEtype','y_ecoor','r_ecoor']); //for bugfixing 

    var noshape = $form.form('get values',['Area_','Inertia','Centriod']);

    var dimen, calc;

    if(formData.beamShape === 'basic'){
      dimen = 'Not Applicable';
      calc =  {
        area: noshape.Area_,
        inertia: noshape.Inertia,
        centriod: noshape.Centriod
      };
    } else {
      dimen = shapecontrol.getDimValues();
      calc = shapecontrol.getCalcValues();
    }

    var returnInfo = {
      memberid:++membercount,
      startjoint:{
        jointtype: formData.jointBtype,
        y_coor: formData.y_bcoor,
        r_coor: formData.r_bcoor
      },
      endjoint:{
        jointtype: formData.jointEtype,
        y_coor: formData.y_ecoor,
        r_coor: formData.r_ecoor},
      load:{
        loadtype: formData.loadType,
        loadvalue: formData.loadAmount
      },
      matTypeLength: {
        mattype: formData.beamShape,
        matlength: formData.memlength,
        matelast: formData.elastic
      },
      matDim: {
        shape:formData.beamShape, 
        dimensions: dimen      
      },
      matCalc: calc
    };
    illustrate.state(true);
    dataOBJ.add(returnInfo, formData);
    beamtable.addEntry(returnInfo,true);
    $('#calcubutton').removeClass('disabled');
    $('.memberForm').modal('hide');
  }


} //end $(document)

$(document).ready(thisDocument);