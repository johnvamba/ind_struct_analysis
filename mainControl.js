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
  // illustrate = new Illustrator();
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

  /*
    // Buttons
  */
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

  }); //add member button

  var test = $('#test');
  test.click(function(){
    $('#testmodal').modal('show');
  });

  //illu modal settings
  $('.illuset.button').click(function(){
    $('.settings.segment').transition('slide left');
  });

  $('.graph.checkbox').checkbox({
    onChange:function(){
      // console.log();
      thisGlobal.showPath($(this).attr('data-value'));
    }
  });

  $('.input.testOn .ui.button').on('click',function(e){
      var limit = dataOBJ.tlength();
      var val=$('#testOn').val()
      if(limit==undefined||!limit||limit<val||val<0){
        alert('Out of bounce input')
      }
      thisGlobal.entry(val);
      // thisGlobal.showPath($(this).attr('data-value'));
    });

  illu.click(function(){
    var hasdata = dataOBJ.hasData(); //depreciated

    thisGlobal.showGraph(); //initialize graph

    if(hasdata){
      $('#illumodal').modal({
        onShow:function(){
        }
      }).modal('show');
      
    }


  }); //end Illu

    // console.log($('#illumodal').modal('cache sizes'));

  // var guide = $('#guidebutton');
  // guide.click(function(){
  //   $('#guide').modal('show');
  // });

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
    var c = dataOBJ.calcAll(); //put to global variable //depreciate later

    $(this).addClass('positive');
    react.removeClass('disabled');
    illu.removeClass('disabled');
    $addMember.addClass('disabled');
    $('.input.testOn').show();
  });

  react.click(function(){
    $('#reaction').modal('show');
    // alert('Reaction');
  });


  $('tbody').on('click', editIcon, function(){
    alert('Disabled function ATM, will be added');
    var row = $(this).closest('tr');
    var id = row.attr('id');
    // console.log(id);
  });

  // $('tbody').on('click', '.close.icon', function(){ //remove function.. Inc.
  //   var row = $(this).closest('tr');
  // });

  // $('tbody').on('click', mscLink, function(){
  //   $('#msc').modal('show');
  //   var row = $(this).closest('tr');
  //   var id = row.attr('id');
  //   // console.log(id);
  //   dataOBJ.getMSC(id);
  // });
  // });

  //return after Addbutton
  function returnSuccess(){
    // console.log('success');
    shapecontrol.calc();
    var formData = $form.form('get values');
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
    dataOBJ.add(returnInfo, formData);
    beamtable.addEntry(returnInfo,true);
    $('#calcubutton').removeClass('disabled');
    $('.memberForm').modal('hide');
  }


/* TEST AREA*/

$('.ui.radio.checkbox').checkbox();
$('.testsetting').form('clear');

$('.testload').click(function(){
  var x = $('.testsetting').form('get value', ['testsample']);
  //add condition if table is occupied disable next step.
  if(beamtable.size()>0){
    alert('table is occupied');
    return;
  }

  if(examples[x] !== undefined){
    loader.load(examples[x]);
  } else {
    location.reload();
  }
});

var loader = {
  load:function(varsam){
    //create formdata object: rely on note.js formdata
    $(varsam.members).each(function(ind,obj){
      var //form = formStruct;
      form = {
        Area_: obj.Area_,
        Base: obj.dimensions.Base,
        Centriod: obj.Centriod,
        Diameter: obj.dimensions.Diameter,
        Flange: obj.dimensions.Flange,
        Height: obj.dimensions.Height,
        Inertia: obj.Inertia,
        Web: obj.dimensions.Web,
        beamShape: obj.shape,
        elastic: obj.elast,
        loadAmount: varsam.loads[ind].loadvalue,
        loadType: varsam.loads[ind].loadtype,
        memlength: obj.mlength,
        r_bcoor: varsam.joints[ind].r_coor,
        r_ecoor: varsam.joints[ind+1].r_coor,
        y_bcoor: varsam.joints[ind].y_coor,
        y_ecoor: varsam.joints[ind+1].y_coor,
      }

      if(varsam.joints[ind].jointtype ==='fix' && ind=== 0){
        form.jointBtype = 'startfix'
      } else {
        form.jointBtype = varsam.joints[ind].jointtype;
      }

      if(varsam.joints[ind+1].jointtype ==='fix' && ind>0){
        form.jointEtype = 'endfix';
      } else {
        form.jointEtype = varsam.joints[ind+1].jointtype;
      }

    //initiate shapecalc
    var shapeCon = shapecontrol.toSample(obj.dimensions,obj.shape);
    //create returninfo object: rely on returnsuccess function
    var dimen, calc;

    if(form.beamShape === 'basic'){
      dimen = 'Not Applicable';
      calc =  {
        area: form.Area_,
        inertia: form.Inertia,
        centriod: form.Centriod
      };
    } else {
      dimen = shapeCon.getDimValues();
      calc = shapeCon.getCalcValues();
    }

    var retInfo = {
      memberid:++membercount,
      startjoint:{
        jointtype: form.jointBtype,
        y_coor: form.y_bcoor,
        r_coor: form.r_bcoor
      },
      endjoint:{
        jointtype: form.jointEtype,
        y_coor: form.y_ecoor,
        r_coor: form.r_ecoor},
      load:{
        loadtype: form.loadType,
        loadvalue: form.loadAmount
      },
      matTypeLength: {
        mattype: form.beamShape,
        matlength: form.memlength,
        matelast: form.elastic
      },
      matDim: {
        shape:form.beamShape, 
        dimensions: dimen      
      },
      matCalc: calc
    };
    dataOBJ.add(retInfo, form);
    beamtable.addEntry(retInfo,true);
    $('#calcubutton').removeClass('disabled');
    $('.memberForm').modal('hide');
    });
    return this;
  }
}

} //end $(document)

$(document).ready(thisDocument);



// sampleGlobal = {
 
// }