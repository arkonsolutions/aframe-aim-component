(()=>{var t={332:()=>{AFRAME.registerSystem("aim",{init:function(){this._entities=[],this._frustum=new THREE.Frustum},play:function(){this.paused=!1},pause:function(){this.paused=!0},tick:function(){this._camera=this.el.sceneEl.camera,!this.paused&&this._camera&&this._entities.filter((t=>!t.paused)).forEach(((t,e,i)=>{if(this._checkIsAtScreen(this._camera,t.object3D.position))t.components.aim.pointerEl.classList.toggle("visible",!1);else{this._containerWidth=window.innerWidth,this._containerHeight=window.innerHeight;let e=new THREE.Vector3(0,0,-1*(this._camera.near+this._camera.far/2));this._camera.localToWorld(e);let i=new THREE.Line3;i.set(e,t.object3D.position);let n=new THREE.Vector3,r=!1;for(let e=0;e<this._frustum.planes.length;e++)if(this._frustum.planes[e].intersectLine(i,n),n){let e=this._vector3ToScreenXY(this._camera,n,this._containerWidth,this._containerHeight);if(e){let i=1.05,n=this._containerWidth*i,s=this._containerHeight*i,o=-1*(n-this._containerWidth),a=-1*(s-this._containerHeight);e.x<0&&e.x>=o&&(e.x=0),e.y<0&&e.y>=a&&(e.y=0),e.x>this._containerWidth&&e.x<=n&&(e.x=this._containerWidth),e.y>this._containerHeight&&e.y<=s&&(e.y=this._containerHeight),r=e.x>=0&&e.y>=0&&e.x<=this._containerWidth&&e.y<=this._containerHeight,r&&(this._placePointer(t,e,this._containerWidth,this._containerHeight),t.components.aim.pointerEl.classList.toggle("visible",!0))}}}}))},registerEntity:function(t){this._entities.push(t),console.log("registerEntity",t)},unregisterEntity:function(t){let e=this._entities.indexOf(t);this._entities.splice(e,1)},_checkIsAtScreen(t,e){return this._frustum.setFromProjectionMatrix((new THREE.Matrix4).multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse)),this._frustum.containsPoint(e)},_vector3ToScreenXY(t,e,i,n){let r=null,s=e.clone(),o=new THREE.Matrix4;o.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),s.applyMatrix4(o);let a=(s.x+1)*i/2,l=(1-s.y)*n/2;return isNaN(a)||isNaN(l)||(r={x:a,y:l}),r},_findAimPointerAngle(t,e,i){let n=t.x,r=i/2-t.y,s=e/2-n,o=Math.atan2(r,s);return o*=180/Math.PI,o<0&&(o=360+o),o},_placePointer(t,e,i,n){let r=this._findAimPointerAngle(e,i,n);t.components.aim.pointerEl.style.left=`${e.x}px`,t.components.aim.pointerEl.style.top=`${e.y}px`,t.components.aim.pointerEl.style.transformOrigin="0% 0%",t.components.aim.pointerEl.style.transform=`rotate(${r}deg) translate(0%, -50%)`}}),AFRAME.registerComponent("aim",{schema:{color:{type:"color",default:"orange"},glyph:{type:"string",default:"◄"}},init:function(){let t=document.createElement("div");t.setAttribute("class","aim-arrow"),this.pointerEl=t,document.querySelector("body").appendChild(this.pointerEl),this.system.registerEntity(this.el)},update:function(t){this.pointerEl.style.color=this.data.color,this.pointerEl.textContent=this.data.glyph},play:function(){this.paused=!1},pause:function(){this.paused=!0,this.pointerEl.classList.toggle("visible",!1)},remove:function(){this.system.unregisterEntity(this.el),this.pointerEl.parentElement.removeChild(this.pointerEl)}})}},e={};function i(n){var r=e[n];if(void 0!==r)return r.exports;var s=e[n]={exports:{}};return t[n](s,s.exports,i),s.exports}i.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return i.d(e,{a:e}),e},i.d=(t,e)=>{for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";i(332)})()})();