from django.urls import path,re_path,include
from .views import index

urlpatterns = [
    path('accounts/',include('rest_registration.api.urls'))
]