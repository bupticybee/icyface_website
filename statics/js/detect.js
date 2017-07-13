angular.module('detect_demo',[])
.controller('detect_controller',function detect_controller($scope,$http){
    function toDataURL(src, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);

            callback(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = src;
        }
    }
    this.getBase64 = function(URL){
        return new Promise(
            function(resolve,reject) {
                toDataURL(
                    URL,
                    function(dataUrl) {
                        resolve(dataUrl);
                    }
                );
            }
        );
    }
    this.selected = "statics/img/faces/face_1.jpg";
    this.imageurls = [
        "statics/img/faces/face_1.jpg",
        "statics/img/faces/face_2.jpg",
        "statics/img/faces/face_3.jpg",
        "statics/img/faces/face_4.jpg",
        "statics/img/faces/face_5.jpg",
        "statics/img/faces/face_6.jpg",
        "statics/img/faces/face_7.jpg"
    ]
    function update_canvas(retdata){
        canvas = document.getElementById('coveringCanvas')
        ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas_width = canvas.clientWidth
        canvas_height = canvas.clientHeight

        image_big = document.getElementById('image-holder-right')
        ori_height = image_big.naturalHeight;
        ori_width = image_big.naturalWidth;
        act_height = image_big.height;
        act_width = image_big.width;

        begin_with_x = 0;
        /**
         * [-[]-]
         */
        if (canvas_width > act_width){ 
            begin_with_x = (canvas_width - act_width) / 2
        }
        for(var cords in retdata){
            cords = retdata[cords]
            left_c = cords[0];
            top_c = cords[1];
            right_c = cords[2];
            bottom_c = cords[3];

            left_c = left_c * act_width / ori_width;
            right_c = right_c * act_width / ori_width;
            
            top_c = top_c * act_height / ori_height;
            bottom_c = bottom_c * act_height / ori_height;
            left_c += begin_with_x;
            right_c += begin_with_x;
            
            y = top_c * 150 / canvas_height;
            x = left_c * 300 / canvas_width;

            recty = (bottom_c - top_c) * 150 / canvas_height;
            rectx = (right_c - left_c) * 300 / canvas_width;
            ctx.strokeRect(x,y,rectx,recty);

        }

    }
    this.click = function(one){
        this.selected = one;
        this.getBase64(one).then(function(imgbase64){
            data = {'img':imgbase64};
            $http.post('/face/face_detect',JSON.stringify(data)).then(function (data){
                update_canvas(data);

            },function errfun(e){
                console.log('error during api');
            })
            

        })

    }
})
