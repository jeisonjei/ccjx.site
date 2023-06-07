from django.urls import path,re_path,include
from .views import index
from .account import register
from .account import verify_email_with_token
from .account import send_email_new_password
from .account import new_password

urlpatterns = [
    path('account/register/',register),
    path('account/register/verify-email-with-token/<str:token>',verify_email_with_token),
    path('account/send-email-new-password/',send_email_new_password),
    path('account/new-pass/',new_password)
]