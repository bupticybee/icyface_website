from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.http import JsonResponse
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
import base64
import requests
import urllib
import cStringIO
from PIL import Image
from io import BytesIO

# Create your views here.
def index(request):
	return render_to_response('web/index.html',{})

def detect(request):
	return render_to_response('web/detect.html',{})

def compair(request):
	return render_to_response('web/compair.html',{})


@csrf_exempt
def getimage(request):
	errmsg = ''
	try:
		imdata = json.loads(request.body).get('imgurl',None)
		imdata = requests.get(imdata)
		byteimg = BytesIO(imdata.content)
		byteimg.seek(0)
		imgfile = Image.open(byteimg)
		buffer = cStringIO.StringIO()
		imgfile.save(buffer, format="JPEG")
		img_str = base64.b64encode(buffer.getvalue())

		if imgfile.format =='JPEG':
			img_str = 'data:image/jpeg;base64,' + img_str
		else:
			img_str = 'data:image/png;base64,' + img_str
		response = img_str
	except Exception,e:
		response = '/statics/img/wrong.png'
		errmsg = str(e)
	response = json.dumps({
		'base64image':response,
		'errmsg':errmsg,
	})
	return HttpResponse(response, content_type='application/json')