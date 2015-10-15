from django.shortcuts import render
from django.views import generic
from .models import Item

# Create your views here.
class ItemView(generic.TemplateView):
    model = Item
    template_name = 'todo/index.html'
