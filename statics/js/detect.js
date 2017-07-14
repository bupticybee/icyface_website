angular.module('detect_demo',[])
.controller('detect_controller',function detect_controller($scope,$http){
    that = this
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
    function run(input_file,get_data){
        /*input_file：文件按钮对象*/
        /*get_data: 转换成功后执行的方法*/
        if ( typeof(FileReader) === 'undefined' ){
            alert("抱歉，你的浏览器不支持 FileReader，不能将图片转换为Base64，请使用现代浏览器操作！");
        } else {
            try{
                /*图片转Base64 核心代码*/
                var file = input_file.files[0];
                //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
                if(!/image\/\w+/.test(file.type)){
                    alert("请确保文件为图像类型");
                    return false;
                }
                var reader = new FileReader();
                reader.onload = function(){
                    get_data(this.result);
                }
                reader.readAsDataURL(file);
            }catch (e){
                alert('图片转Base64出错啦！'+ e.toString())
            }
        }
    }
    this.init = function(){
        console.log('inited');
        $(".image-input").change(function () {
            run(this, function (data) {
                that.imageurls.unshift(data);
                that.click(data);
                console.log(that.imageurls)
            });
        });
        this.click(this.selected)
    }
    function toDataURL(src, callback, outputFormat) {
        var img = new Image();
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
    /**
     * json美化
     *   jsonFormat2(json)这样为格式化代码。
     *   jsonFormat2(json,true)为开启压缩模式
     * @param txt
     * @param compress
     * @returns {string}
     */
    function jsonFormat(txt,compress){
        var indentChar = '    ';
        if(/^\s*$/.test(txt)){
            console.log('数据为空,无法格式化! ');
            return;
        }
        try{var data=eval('('+txt+')');}
        catch(e){
            console.log('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');
            return;
        };
        var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;
    
        var notify=function(name,value,isLast,indent/*缩进*/,formObj){
            nodeCount++;/*节点计数*/
            for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */
            tab=compress?'':tab;/*压缩模式忽略缩进*/
            maxDepth=++indent;/*缩进递增并记录*/
            if(value&&value.constructor==Array){/*处理数组*/
                draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
                for (var i=0;i<value.length;i++)
                    notify(i,value[i],i==value.length-1,indent,false);
                draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
            }else   if(value&&typeof value=='object'){/*处理对象*/
                draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/
                var len=0,i=0;
                for(var key in value)len++;
                for(var key in value)notify(key,value[key],++i==len,indent,true);
                draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/
            }else{
                if(typeof value=='string')value='"'+value+'"';
                draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
            };
        };
        var isLast=true,indent=0;
        notify('',data,isLast,indent,false);
        return draw.join('');
    }
    this.json_ret = 'no response'
    function setJsonRes(resjson){
        retstr = jsonFormat(JSON.stringify(resjson)).trim();
        return retstr;
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
        canvas = document.getElementById('coveringCanvas')
        ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.selected = one;
        that.json_ret = 'processing api server...'
        this.getBase64(one).then(function(imgbase64){
            data = {'img':imgbase64};
            $http.post('/face/face_detect',JSON.stringify(data)).then(function (data){
                update_canvas(data.data['boxes']);
                that.json_ret = setJsonRes(data.data)
            },function errfun(e){
                that.json_ret = 'error while processing api service, try later perpahs~'; 
                console.log('error during api');
            })
            

        })

    }
})

