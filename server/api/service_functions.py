from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from nameof import nameof
import re
import os

def get_user_credentials(request,operation_type):
    obj=request.data
    # проверку ключей можно не выполнять - если в форме регистрации Angular существует поле, то будет и ключ
    email=obj['email']
    password=obj['password']
    if 'login' in operation_type:
        if email=='' or password=='':
            pubm='Пароль или эл.почта не указаны'
            privm='Пароль или эл.почта не указаны'
            error=get_error_object(pubm,privm)
            return Response(error,status=status.HTTP_400_BAD_REQUEST)
    elif 'register' in operation_type:
        passwordConfirmation=obj['passwordConfirmation']
        if email=='' or password=='':
            pubm='Пароль или эл.почта не указаны'
            privm='Пароль или эл.почта не указаны'
            error=get_error_object(pubm,privm)
            return Response(error,status=status.HTTP_400_BAD_REQUEST)
        if passwordConfirmation=='':
            pubm='Подтверждение пароля не указано'
            privm=pubm
            error=get_error_object(pubm,privm)
            return Response(error,status=status.HTTP_400_BAD_REQUEST)
        if password!=passwordConfirmation:
            pubm='Введённые пароли не сопадают'
            privm=pubm
            error=get_error_object(pubm,privm)
            return Response(error,status=status.HTTP_400_BAD_REQUEST)
    return obj

def get_error_object(pubm,privm):
    error={
        settings.PUBM:pubm,
        settings.PRIVM:privm
    }
    return error

def join_url(parts: list):
    '''
    Функция соединяет части url. Косая черта на конце части может указываться или не указываться, части всё равно будут разделены косой чертой.
    Функция предусматривалась для объединения частей url, но может использоваться и для объединения локальных путей
    
    parts: список строк с частями пути
    '''
    url='/'.join(parts)
    url=re.sub('(?<!:\/)(?<!:)\/+','/',url)
    url=re.sub('\/+$','',url)
    return url

def link_adaptto_client(link):
    if 'posix' in os.name:
        link=link.replace(':5000','')
    elif 'nt' in os.name:
        link=link.replace('5000','4200')
    link=link.replace('/api','')
    return link
