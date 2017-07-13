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
    this.click = function(one){
        this.selected = one;
        this.getBase64(one).then(function(imgbase64){
            data = {'img':imgbase64};
            $http.post('/face/face_detect',data).then(function (data){
                console.log(data);
            },function errfun(e){
                console.log('error during api');
            })
        })

    }
})