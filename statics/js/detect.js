angular.module('detect_demo',[])
.controller('detect_controller',function detect_controller(){
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
    }
})