jQuery.fn.extend({
    contentCube: function (options) {
        $(this).addClass("contentCube");
        cubeSystem.init($(this), options);
    }
});

cubeSystem = {
    elements: [],
    states: {
        index: 0,
        zDistance: 0,
        rotateCurrent: 0,
        height: 0,
        width: 0,
        total: 0,
        minHeight: 0,
        maxIndex: 0
    },
    init: function (element, options) {
        var elementIndex = element.find("> div").length;
        element.data("cc-index", elementIndex);

        var speed = cubeSystem.checkOptions(options);
        cubeSystem.elements.push({ "element": element, "speed": speed })
        this.setViewport();

    },
    checkOptions: function (options) {
        //For future options for now just speed

        var speed = 8;
        if (typeof options.speed === 'number' || options.speed != null) {
            speed = options.speed
        }
        //Eventually all will be set up from here
        return speed;
    },
    setViewport: function () {
        //This is where we set up the area for the 3D to take place
        var element = cubeSystem.elements[0].element;

        var blockwidth = element.width();
        var blockheight = element.find("> *").height();

        cubeSystem.states.total = element.find("> *").length;
        cubeSystem.states.zDistance = blockwidth / 2;
        cubeSystem.states.height = blockheight / 2;
        cubeSystem.states.width = blockwidth / 2;
        cubeSystem.states.maxIndex = (element.find("> *").length - 1);
        //This is for initializing the first 2 
        var index = 0;
        element.find("> *").each(function () {
            if (index == 0) {
                $(this).addClass("current");
            } else if (index == 1) {
                $(this).addClass("after");
            }
            $(this).data("box-index", index);
            index++;
        });


        //Cube faces
        this.layoutCube();
    },
    layoutCube: function () {
        var front = true;
        var right = false;
        var back = false;
        var left = false;
        var zDistance = cubeSystem.states.zDistance;
        var element = cubeSystem.elements[0].element;

        var rotate = 0;

        //Here we iterate over all the faces of the cube to overlay them in a cube like slider
        element.find("> *").each(function () {
            if (front) {
                cubeSystem.writeTransforms($(this), zDistance, 0, rotate);
                rotate += 90;
                front = false;
                right = true;
            } else if (right) {
                cubeSystem.writeTransforms($(this), 0, 50, rotate);
                rotate += 90;
                right = false;
                back = true;
            } else if (back) {
                cubeSystem.writeTransforms($(this), -zDistance, 0, rotate);
                rotate += 90;
                back = false;
                left = true;
            } else if (left) {
                cubeSystem.writeTransforms($(this), 0, -50, rotate);
                rotate += 90;
                left = false;
                front = true;
            }
        });
        this.setHeights(element);

    },
    setHeights: function () {
        var element = cubeSystem.elements[0].element;

        var max = 0;
        element.find("> *").each(function () {
            if ($(this).height() > max) {
                max = $(this).height();
            }
        })
        element.find("> *").css("min-height", max);
        element.css("min-height", max + 10);
        cubeSystem.states.minHeight = max;
    },
    rotate: function (requestIndex) {
        if (requestIndex < 0) {
            console.log(requestIndex + "Rotate input not a positive number");
            return false;
        }
        var element = cubeSystem.elements[0].element;
        var lastIndex = cubeSystem.states.maxIndex;
        var currentIndex = cubeSystem.states.index;
        var currentRotate = cubeSystem.states.rotateCurrent;
        if (requestIndex > currentIndex) {
            //This runs the rotation in steps and swaps the classes so the right faces get opacity 1
            if (requestIndex <= lastIndex) {
                for (var i = currentIndex; i < requestIndex; i++) {

                    element.find("> .before").removeClass("before");

                    element.find("> .current").addClass("before").removeClass("current");

                    element.find("> .after").addClass("current").removeClass("after");

                    element.find("> .current").next().addClass("after");
                    currentRotate -= 90;
                    this.rotateCube(currentRotate);
                    cubeSystem.states.rotateCurrent = currentRotate;
                    cubeSystem.states.index = element.find("> div.current").data("box-index");


                }
            } else {
                console.log("Requested index invalid: Slide does not exist");
            }
        } else if (requestIndex < currentIndex) {
            for (var i = currentIndex; i > requestIndex; i--) {
                element.find("> .after").removeClass("after");

                element.find("> .current").addClass("after").removeClass("current");

                element.find("> .before").addClass("current").removeClass("before").prev().addClass("before");

                cubeSystem.states.index = element.find("> .current").data("box-index");
                currentRotate += 90;
                this.rotateCube(currentRotate);
                cubeSystem.states.rotateCurrent = currentRotate;
                cubeSystem.states.index = element.find("> .current").data("box-index");
            }
        }
    },
    rotateCube: function (rotate) {
        var element = cubeSystem.elements[0].element;

        element.css("-moz-transform", "rotateY(" + rotate + "deg)");
        element.css("-ms-transform", "rotateY(" + rotate + "deg) ");
        element.css("-o-transform", "rotateY(" + rotate + "deg)");
        element.css("-webkit-transform", "rotateY(" + rotate + "deg)");
        element.css("transform", "rotateY(" + rotate + "deg)");
    },
    writeTransforms: function (object, zVar, xVar, yVar) {
        //For setting up the cube faces
        object.css("-moz-transform", "translateZ(" + zVar + "px) translateX(" + xVar + "%) rotateY(" + yVar + "deg)");
        object.css("-ms-transform", "translateZ(" + zVar + "px) translateX(" + xVar + "%) rotateY(" + yVar + "deg)");
        object.css("-o-transform", "translateZ(" + zVar + "px) translateX(" + xVar + "%) rotateY(" + yVar + "deg)");
        object.css("-webkit-transform", "translateZ(" + zVar + "px)  translateX(" + xVar + "%) rotateY(" + yVar + "deg)");
        object.css("transform", "translateZ(" + zVar + "px) translateX(" + xVar + "%) rotateY(" + yVar + "deg)");

    }
}