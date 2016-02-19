app = {
    para: {

    },
    fn: {
        init: function () {
            $(document).ready(function () {
                app.fn.activate();
                app.fn.rotate();
                app.fn.clickTest();
            });
        },
        activate: function () {
            $(".activate").on("click", function () {
                if (!$(".content").hasClass("contentCube")) {
                    $(".content").contentCube({
                        "speed": 10
                    });
                    $(this).slideUp();
                    $(".controls").slideDown();
                }
               
            });
        },
        rotate: function(){
            $(".controls select").on("change", function () {
                cubeSystem.rotate($(".controls select").val());
            });
        },
        clickTest:function(){
            $(".clickevent").on("click", function () {
                alert("Click events remain intact");
            });
        }
    }
}