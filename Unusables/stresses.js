var areaForce = { 
      equally:function(l,ld,x,x2){
        return ld*(x-x2);
      },left_con:function(l,ld,x,x2){
        var area = (ld + (ld * ((x2+l - x)/l) ))/2;
        return area;
      },right_con:function(l,ld,x,x2){
        var area = (ld * (x-x2))/l;
        return ld*(x-x2);
      },c_point:function(l,ld,x,x2){ //sayop?
        var mid = l/2;
        if ((x-x2) >= mid) return ld;
        return 0;
      },two_point:function(l,ld,x,x2){
        var _x = (x-x2);
        var point = l/3;
        if (_x >= point && _x < point*2) return ld;
        else if (_x >= point*2) return ld+ld;
        return 0;
      },noload:function(l,ld,x,x2){
        return 0;
      }
    }

    var shear = function(){
      var allData = sample;
      var total=0,
        tLength = 0;
      $(allData.reactions).each(function(ind,obj){
        // console.log(total);
        if(tLength>x) {
          return total;
        } 
        total += obj.y;
        // console.log(total);
        if(allData.memb[ind] !== undefined){
          var c = allData.memb[ind];
          if (c.ltype !== 'noload'){ 
            if (x>c.len+tLength) 
              total -= areaForce[c.ltype](c.len,c.load,c.len,0);
            else 
              total -= areaForce[c.ltype](c.len,c.load,x,tLength);
          }
          // console.log(c.ltype);
          tLength += c.len;
        }
      });
      total = parseFloat(total.toFixed(2));
      return total; //kN
    }

    /*
      MomentForce Step
    */
    var momentArm = { // l=length, ld = load, x = position, x2 = travelled
      equally:function(l,ld,x,x2){ // kani lang ata sakto.
        var arm = x - [(l/2) + x2];
        return arm;
      },left_con:function(l,ld,x,x2){
          // var area = (ld + (ld * ((x2+l - x)/l) ))/2;
          return x - ((l/3) + x2);
        },right_con:function(l,ld,x,x2){
          // var area = (ld * (x-x2))/l;
          return x - ((2*l/3) + x2);
        },c_point:function(l,ld,x,x2){ //sayop?
          // var mid = l/2;
          // if ((x-x2) >= mid) return ld;
          return x-((l/2) + x2);
        },two_point:function(l,ld,x,x2){
          var _x = (x-x2);
          // var point = l/3;
          // if (_x >= point && _x < point*2) return ld;
          // else if (_x >= point*2) return ld+ld;
          return _x;
        },noload:function(l,ld,x,x2){
          return x-x2;
        }
    }
    var moment = function(){
          var allData = sample;
      var momentF=0;
        tLength = 0;
      $(allData.reactions).each(function(ind, obj){
        if(tLength>x) {
          return momentF;
        } 
        if(ind===0){
          momentF -= obj.r;
        }
          
        if(allData.memb[ind] !== undefined ){
          var c = allData.memb[ind],
            force,
            arm;
          momentF -= (-obj.y * (x-tLength));
          if(c.ltype !== 'noload'){
            if(x>=c.len + tLength){
              force = areaForce[c.ltype](c.len,c.load,c.len,0);
            } else {
              force = areaForce[c.ltype](c.len,c.load,x,tLength);
            }
            arm = momentArm[c.ltype](c.len,c.load,x,tLength);
            momentF -= (force * arm);
          }

          tLength += c.len;
        }
      });
      momentF = parseFloat(momentF.toFixed(2));
      return momentF; //kN-m
    }

    /*
      Miscellaneous functions
    */
    function findMemberOn(){
      var l=0,ob;
      $(sample.memb).each(function(ind, obj){
        if(x>=l && x<=l+obj.len) {
          ob = obj;
        }
        l+= obj.len;
      });
      return ob;
    }

    function getTotalLength(){ // return full length of beam
      var total = 0;
      $(sample.memb).each(function(ind,obj){
        total += obj.len;
      });
      return total;
    }

    function bend(){
      return 'bend';
    }
    function deflect(){
      var mem = findMemberOn();
      return (moment() * 1000000) / (mem.shape.elast * mem.shape.inertia);
    }
    function shearStr(){
      return 'shearStress';
    }
    // return {
    //   shearforce: shear()
    //   ,momentforce: moment()
    //   ,deflection:deflect()
    //   ,bendingStress:bend()
    //   ,shearStress: shearStr()
    // }