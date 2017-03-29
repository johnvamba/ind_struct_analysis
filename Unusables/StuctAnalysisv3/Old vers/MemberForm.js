var MemberForm = (function(){
	// var impForm, _impform, loadForm, lform, sjointForm, sjform, ejointForm, ejform;
var 
	//dropdowns
	beamtype = 'beamtype',
	$beamDropdown = $('#'+beamtype),
	loadtype = 'loadDD',
	$loadDD = $('#'+loadtype),
	jointStart = 'jointType-s',
	$jointS = $('#'+jointStart),
	jointEnd = 'jointType-e',
	$jointE = $('#'+jointEnd),

	//form 
	formModal = 'memberForm',
	$modal = $('.'+formModal),
	formName = 'CRmember',
	$form = $('.ui.form.'+formName);

	//constants
var	formValid = {
	on:'submit',
	inline:true,
		fields: {
			beamtype:{
			  identifier: 'beamShape',
			  rules: [
			  {
				type: 'empty',
				prompt: 'Enter a beam type!'
			  }]
			},
			length:{
			  identifier: 'length',
			  rules:[{
				type:'empty',
				prompt: 'Member has no length!'
			  },
			  {
				type:'number',
				prompt: 'length overbounce, only (atm) 1-100'
			  }]
			},
			loadtype:{
			  identifier: 'loadType',
			  rules: [
			  {
				type: 'empty',
				prompt: 'Enter a Load type!'
			  }]
			},
			elastic:{
			  identifier: 'elastic',
			  rules:[{
				type: 'empty',
				prompt: 'Member has no elasticity!'
			  }]
			},
			jointBtype:{
			  identifier: 'jointBtype',
			  rules: [
			  {
				type: 'empty',
				prompt: 'Enter a Joint type for beginning joint!'
			  }]
			},    
			jointEtype:{
			  identifier: 'jointEtype',
			  rules: [
			  {
				type: 'empty',
				prompt: 'Enter a Joint type for end joint!'
			  }]
			}
		}
	},
	setting = {
		onSuccess : function(event) {
		    //Hides modal on validation success
		    alert("Valid Submission, modal will close.");

		    $('.memberForm').modal('hide');
		  },
	}

	dimensions = {
		square: ['Base'],
		rec: ['Base','Height'],
		ibeam: ['Base','Height','Web','Flange'],
		tbeam: ['Base','Height','Web','Flange'],
		circle: ['Diameter']
	},
	shape = {
		Base: null,
		Height: null,
		Web: null,
		Flange: null,
		Diameter: null
	}

;
	//console.log(formValid);
	function initiate(){
		
	}

	function onClear(){
		$form.form('clear');
	}

	function thisSuccess(){
		console.log($form.form('get values'));
		$modal.modal('hide');
	}

	// function showDimensions(_shape)

	function showModal(){
		$modal.modal({
			onShow: function(){
				initiate();
			},
			onApprove:function(){
				//onSuccess();
				// $form.form(formValid);
				$form.form({
					on:'approve',
					onValid: formValid,
					onSuccess: thisSuccess()
				});

				return false;
			}
		}).modal('show');
	}
	

	return {
		init:function(){
			$form.form(formValid,setting);
			return this;
		},
		setBeamtype: function(_beamtype){
			beamtype = _beamtype;
			return this;
		},
		clear: function(){
			onClear();
			return this;
		},
		showAddModal: function(){
			onClear();
			showModal();
			return this;
		},
		getValues: function(){
			return this;
		}
	}
});