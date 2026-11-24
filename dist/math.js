/* Equal-area sphere patches: dA = r² d(longitude) d(z/r).
   6 equal-height bands × 8 longitudes = 48 patches.
   Each patch has area πr²/12, represented by one of 12 equal disk sectors. */
(function(root){
  'use strict';
  const BANDS=6, LONGITUDES=8, TOTAL=BANDS*LONGITUDES, PER_CIRCLE=12;
  function patchAt(z,longitude){const b=Math.min(BANDS-1,Math.max(0,Math.floor((1-z)*BANDS/2)));const a=((longitude%(2*Math.PI))+2*Math.PI)%(2*Math.PI);return b*LONGITUDES+Math.min(LONGITUDES-1,Math.floor(a/(2*Math.PI)*LONGITUDES));}
  function patchArea(radius){return radius*radius*(2/BANDS)*(2*Math.PI/LONGITUDES);}
  function sectorArea(radius){return Math.PI*radius*radius/PER_CIRCLE;}
  function circleArea(radius){return Math.PI*radius*radius;}
  function surfaceArea(radius){return 4*circleArea(radius);}
  function capacity(count){return count*PER_CIRCLE;}
  function balance(count){return TOTAL-capacity(count);}
  function mosaicPoint(q,a){const twist=.19*Math.sin(15*q)+.06*Math.sin(39*q),rho=Math.sqrt(q);return [rho*Math.cos(a+twist),rho*Math.sin(a+twist)];}
  const api={mosaicPoint,BANDS,LONGITUDES,TOTAL,PER_CIRCLE,patchAt,patchArea,sectorArea,circleArea,surfaceArea,capacity,balance};
  root.OrangeMath=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
