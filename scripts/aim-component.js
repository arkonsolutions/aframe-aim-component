const AIM_COMPOMENT_IDENTIFIER = "aim";
AFRAME.registerSystem(AIM_COMPOMENT_IDENTIFIER, {
    init: function() {
        this._entities = [];
        this._frustum = new THREE.Frustum();
    },
    play: function() {
        this.paused = false;
    },
    pause: function() {
        this.paused = true;
    },
    tick: function() {
        this._camera = this.el.sceneEl.camera;
        if (!this.paused && !!this._camera) {
            this._entities.filter(e => !e.paused).forEach((entity, eIdx, eArr) => {
                if (!this._checkIsAtScreen(this._camera, entity.object3D.position)) {
                    this._containerWidth = window.innerWidth;
                    this._containerHeight = window.innerHeight;
    
                    let posViewer = new THREE.Vector3(0, 0, (this._camera.near + this._camera.far / 2) * -1);
                    this._camera.localToWorld(posViewer);
    
                    //find intersections
                    let line3 = new THREE.Line3();
                    line3.set(posViewer, entity.object3D.position);
                    let intersectionPoint = new THREE.Vector3();
    
                    let isValidScreenCoordinates = false;
                    for (let i = 0; i < this._frustum.planes.length; i++) {
                        this._frustum.planes[i].intersectLine(line3, intersectionPoint);
                        if(!!intersectionPoint) {
                            let screenCoordinate = this._vector3ToScreenXY(this._camera, intersectionPoint, this._containerWidth, this._containerHeight);
                            if (!!screenCoordinate) {
    
                                let debouncePercentFactor = 1.05;
                                let debuncedMaxWidth = this._containerWidth * debouncePercentFactor;
                                let debouncedMaxHeight = this._containerHeight * debouncePercentFactor;
                                let debouncedMinWidth = (debuncedMaxWidth - this._containerWidth) * -1;
                                let debouncedMinHeight = (debouncedMaxHeight - this._containerHeight) * -1;
    
                                //normalize
                                if (screenCoordinate.x < 0 && screenCoordinate.x >= debouncedMinWidth)
                                    screenCoordinate.x = 0;
                                if (screenCoordinate.y < 0 && screenCoordinate.y >= debouncedMinHeight)
                                    screenCoordinate.y = 0;
    
    
                                if (screenCoordinate.x > this._containerWidth && screenCoordinate.x <= debuncedMaxWidth)
                                    screenCoordinate.x = this._containerWidth;
                                if (screenCoordinate.y > this._containerHeight && screenCoordinate.y <= debouncedMaxHeight)
                                    screenCoordinate.y = this._containerHeight;
    
    
                                isValidScreenCoordinates = (screenCoordinate.x >= 0) && (screenCoordinate.y >= 0) && (screenCoordinate.x <= this._containerWidth) && (screenCoordinate.y <= this._containerHeight);
                                if (isValidScreenCoordinates) {
                                    this._placePointer(entity, screenCoordinate, this._containerWidth, this._containerHeight);
                                    //display pointer
                                    entity.components[AIM_COMPOMENT_IDENTIFIER].pointerEl.classList.toggle("visible", true);
                                } else {
                                    console.log('not valid', screenCoordinate);
                                }
                            }
                        }
                    }
                } else  {
                    //hide pointer
                    entity.components[AIM_COMPOMENT_IDENTIFIER].pointerEl.classList.toggle("visible", false);
                }
            });
        }
    },
    registerEntity: function(entity) {
        this._entities.push(entity);
    },
    unregisterEntity: function(entity) {
        let index = this._entities.indexOf(entity);
        this._entities.splice(index, 1);
    },
    _checkIsAtScreen(camera, pointVector3) {
        this._frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        return this._frustum.containsPoint(pointVector3);
    },
    _vector3ToScreenXY(camera, vector3, containerWidth, containerHeight) {
        let result = null;
        let pos = vector3.clone();
        let projScreenMat = new THREE.Matrix4();
        projScreenMat.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
        projScreenMat.multiplyVector3( pos );

        let x = ( pos.x + 1 ) * containerWidth / 2;
        let y = ( - pos.y + 1) * containerHeight / 2;

        if (!isNaN(x) && !isNaN(y)) {
            result = { x, y };
        }

        return result;
    },
    _findAimPointerAngle(pointerXYCoordinate, containerWidth, containerHeight) {
        let cx = pointerXYCoordinate.x;
        let cy = pointerXYCoordinate.y;
        let ex = containerWidth / 2;
        let ey = containerHeight / 2;

        let dy = ey - cy;
        let dx = ex - cx;
        let theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    },
    _placePointer(entity, screenCoordinate, containerWidth, containerHeight) {
        let angle = this._findAimPointerAngle(screenCoordinate, containerWidth, containerHeight);
        entity.components[AIM_COMPOMENT_IDENTIFIER].pointerEl.style.left = `${screenCoordinate.x}px`;
        entity.components[AIM_COMPOMENT_IDENTIFIER].pointerEl.style.top = `${screenCoordinate.y}px`;
        entity.components[AIM_COMPOMENT_IDENTIFIER].pointerEl.style.transformOrigin = "0% 0%";
        entity.components[AIM_COMPOMENT_IDENTIFIER].pointerEl.style.transform = `rotate(${angle}deg) translate(0%, -50%)`;
    }
});

AFRAME.registerComponent(AIM_COMPOMENT_IDENTIFIER, {
    schema: {
        color: {type:'color', default: 'orange'}
    },
    init: function() {
        let pointerEl = document.createElement("div");
        pointerEl.textContent = `◄`;
        pointerEl.setAttribute("class", "aim-arrow");
        this.pointerEl = pointerEl;
        document.querySelector("body").appendChild(this.pointerEl);
        this.system.registerEntity(this.el);
    },
    update: function(oldData) {
        this.pointerEl.style.color = this.data.color;
    },
    play: function() {
        this.paused = false;
    },
    pause: function() {
        this.paused = true;
        this.pointerEl.classList.toggle("visible", false);
    },
    remove: function () {
        this.system.unregisterEntity(this.el);
        this.pointerEl.parentElement.removeChild(this.pointerEl);
    }
});