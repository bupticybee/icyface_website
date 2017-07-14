from django.conf.urls import patterns,include,url
from . import views

urlpatterns = [
	url(r'^$',views.index),
	url(r'^index.html$',views.index),
	url(r'^detect.html$',views.detect),
	url(r'^getimage$',views.getimage),
]


