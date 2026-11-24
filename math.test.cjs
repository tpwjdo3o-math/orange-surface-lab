const assert=require('node:assert/strict');
const M=require('./dist/math.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
for(const r of [2,3,4,5]){
  // Sphere area is independently integrated in coordinates (latitude, longitude).
  let integrated=0;const n=100000,da=Math.PI/n;
  for(let i=0;i<n;i++)integrated+=2*Math.PI*r*r*Math.sin((i+.5)*da)*da;
  assert.ok(Math.abs(integrated-M.surfaceArea(r))<1e-7);
  near(M.patchArea(r),M.sectorArea(r));
  near(M.patchArea(r)*M.TOTAL,4*Math.PI*r*r);
  near(M.surfaceArea(2*r)/M.surfaceArea(r),4);
  near(M.surfaceArea(r)/M.circleArea(r),4);
}
for(let b=0;b<M.BANDS;b++)for(let a=0;a<M.LONGITUDES;a++){
  assert.equal(M.patchAt(1-(b+.5)*2/M.BANDS,(a+.5)*2*Math.PI/M.LONGITUDES),b*M.LONGITUDES+a);
}
for(const z of [-1,-.999,0,.999,1])for(const a of [-8*Math.PI,-.001,0,2*Math.PI,8*Math.PI]){
  const id=M.patchAt(z,a);assert.ok(Number.isInteger(id)&&id>=0&&id<M.TOTAL);
}
assert.equal(M.balance(1),36);assert.equal(M.balance(3),12);assert.equal(M.balance(4),0);assert.equal(M.balance(5),-12);assert.equal(M.balance(8),-48);
console.log('PASS: numerical surface integration, area conservation, scale law, all 48 patches, pole/seam boundaries, 1–8 circle balances.');

// Check curved tile areas through independently sampled polygon boundaries.
for(let ring=0;ring<4;ring++)for(let col=0;col<12;col++){
 const q1=ring/4,q2=(ring+1)/4,a1=col*2*Math.PI/12,a2=(col+1)*2*Math.PI/12,pts=[],n=2000;
 for(let k=0;k<=n;k++)pts.push(M.mosaicPoint(q1,a1+(a2-a1)*k/n));
 for(let k=1;k<=n;k++)pts.push(M.mosaicPoint(q1+(q2-q1)*k/n,a2));
 for(let k=1;k<=n;k++)pts.push(M.mosaicPoint(q2,a2-(a2-a1)*k/n));
 for(let k=1;k<=n;k++)pts.push(M.mosaicPoint(q2-(q2-q1)*k/n,a1));
 let twice=0;pts.forEach((p,i)=>{const b=pts[(i+1)%pts.length];twice+=p[0]*b[1]-b[0]*p[1];});
 assert.ok(Math.abs(Math.abs(twice)/2-Math.PI/48)<1e-6);
}
console.log('PASS: all 48 curved mosaic cells preserve equal area (independent polygon integration).');
