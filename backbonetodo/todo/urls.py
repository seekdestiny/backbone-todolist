from django.conf.urls import patterns, include, url
from todo.api import ItemResource

from . import views

item_resource = ItemResource()

urlpatterns = patterns('',
    url(r'^$', views.ItemView.as_view(), name='index'),
    url(r'^api/', include(item_resource.urls)),
)
