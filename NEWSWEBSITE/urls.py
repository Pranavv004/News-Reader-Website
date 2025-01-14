from django.urls import path

from . import views

urlpatterns = [
    
    path('',views.home,name="home"),
    path('search_news/',views.search_news,name="search_news"),
    path('get_summary/', views.get_summary, name='get_summary'),
    #path('<str:category>/',views.category,name="category")
]