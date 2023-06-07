from django.urls import path,re_path,include
from .views import index
from .account import register
from .account import verify_email_with_token

urlpatterns = [
    path('account/register/',register),
    path('account/register/verify-email-with-token/',verify_email_with_token)
]