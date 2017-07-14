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

@csrf_exempt
def getimage(request):
	try:
		imdata = json.loads(request.body).get('imgurl',None)
		imdata = requests.get(imdata)
		imgfile = Image.open(BytesIO(imdata.content))
		buffer = cStringIO.StringIO()
		imgfile.save(buffer, format="JPEG")
		img_str = base64.b64encode(buffer.getvalue())

		if imgfile.format =='JPEG':
			img_str = 'data:image/jpeg;base64,' + img_str
		else:
			img_str = 'data:image/png;base64,' + img_str
		response = img_str
	except:
		response = '/statics/img/wrong.png'
	response = json.dumps({
		'base64image':response,
	})
	return HttpResponse(response, content_type='application/json')