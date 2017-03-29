/*This collect data from forms. also return data to forms if required.*/
/*Also used to connect with femcalculator.*/

var BTController = (function(){
	var members = [];
 	var fieldName = ['memberID', 'startjoint','endjoint','memload','length','elast','inersia'];
	var bTable = new beamTable().config("memTable",fieldName,"This beam has no members");
	var form, formname;
	function collectAdd(){
		//collect data from form using jquery.

	}

	function collectFromTable(id){
		//recollect data from table.

	}

	return {
		config:function(_form){
			formname = _form;
			form = $('#'+ _form);
		}
	}
});

// function makeActive(){
// 	//load dropdown
//   $('.loadDD').dropdown({
//     onChange: function(value, text, $choice){
//       url='assets/loadtypes/'+value+'.png';
//       $('.beamload').attr('src', url);
//       if(value!=='noload') $('.field.load').show();
//       else $('.field.load').hide();
//     }
//   });
//   //joint dropdown
//   $('.start.jointDD').dropdown({
//     onChange: function(value, text, $choice){
//       url='assets/jointfaces/'+value+'.png';
//       $('.start.jointImg').attr('src', url);
//       switch(value){
//         case 'none':
//         $('.field.start').show();
//         $('.start .y-coor').show();
//         break;
//         case 'startfix':
//         $('.field.start').hide();
//         break;
//         case 'roller':
//         $('.field.start').show();
//         $('.start .y-coor').hide();
//         break;
//         case 'pin':
//         $('.field.start').show();
//         $('.start .y-coor').hide();
//         break;
//         default:
//         $('.y-coor').show();
//         $('.field.start').show();
//         break;
//       }
//     }
//   });
  
//   $('.end.jointDD').dropdown({
//     onChange: function(value, text, $choice){
//       url='assets/jointfaces/'+value+'.png';
//       $('.end.jointImg').attr('src', url);
//         switch(value){
//         case 'none':
//         $('.field.end').show();
//         $('.end .y-coor').show();
//         break;
//         case 'endfix':
//         $('.field.end').hide();
//         break;
//         case 'roller':
//         $('.field.end').show();
//         $('.end .y-coor').hide();
//         break;
//         case 'pin':
//         $('.field.end').show();
//         $('.end .y-coor').hide();
//         break;
//         default:
//         $('.y-coor').show();
//         $('.field.end').show();
//         break;
//       }
//     }
//   });

// }