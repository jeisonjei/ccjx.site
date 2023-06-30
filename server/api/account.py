from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User
from .models import EmailVerificationToken
from .models import NewPasswordToken
from .service_functions import *

@api_view(['POST'])
def register(request):
    print(f'=== {nameof(request)}:{request.data}')
    result=get_user_credentials(request,'register')
    if type(result)==Response:
        return result
    email=result['email']
    password=result['password']
    try:
        existing_user=User.objects.get(email=email)
        if existing_user!=None:
            pubm=f'Пользователь с адресом {email} уже зарегистрирован'
            privm=pubm
            error=get_error_object(pubm,privm)
            return Response(error,status=status.HTTP_400_BAD_REQUEST)
    except ObjectDoesNotExist:
        try:
            inactive_user=User.objects.create_user(email,password)
            inactive_user.is_active=False
            subject="Регистрация в ccjx.community"
            token=PasswordResetTokenGenerator().make_token(inactive_user)
            link=request.scheme+'://'+request.get_host()+'/'+'account/register/success/'+token
            link=link_adaptto_client(link)
            body=f"Здравствуйте, вы зарегистрировались на веб-сайте ccjx.community. Для работы с веб-сайтом требуется подтвердить свой адрес электронной почты. Вы можете сделать это перейдя по ссылке {link}"
            inactive_user.email_user(subject,body)
            verify_email_token=EmailVerificationToken()
            verify_email_token.user=inactive_user
            verify_email_token.token=token
            verify_email_token.save()
            print(f'✓ эл.сообщение отправлено на адрес {inactive_user.email}')
        except Exception as e:
            inactive_user.delete()
            return Response(e.args,status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_201_CREATED)

@api_view(['GET'])
def verify_email_with_token(request,token):
    try:
        token=EmailVerificationToken.objects.get(token=token)
    except ObjectDoesNotExist as e:
        pubm='Пользователь с таким токеном подтверждения не зарегистрирован'
        privm=e.args
        error=get_error_object(pubm,privm)
        return Response(error,status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        pubm='Извините, возникла ошибка'
        privm=e.args
        error=get_error_object(pubm,privm)
        return Response(error,status=status.HTTP_400_BAD_REQUEST)
    user=token.user
    user.is_active=True
    user.save()
    token.delete()
    return Response(user.email)

@api_view(['POST'])
def new_password(request):
    data=request.data
    token=data['token']
    new_password=data['new-password']
    new_password_confirmation=data['new-password-confirmation']
    if(new_password!=new_password_confirmation):
        pubm='Пароли не совпадают'
        privm=pubm
        error=get_error_object(pubm,privm)
        return Response(error,status=status.HTTP_400_BAD_REQUEST)
    try:
        reset_password_token=NewPasswordToken.objects.get(token=token)
    except Exception as e:
        pubm='Учётная запись не найдена'
        privm=e.args
        error=get_error_object(pubm,privm)
        return Response(error,status=status.HTTP_400_BAD_REQUEST)
    user=reset_password_token.user
    try:
        user.set_password(new_password)
        user.save()
    except Exception as e:
        pubm="Извините, возникла ошибка"
        privm="При назначении пользователю нового пароля возникла ошибка"
        error=get_error_object(pubm,privm)
        return Response(error,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    reset_password_token.delete()
    return Response(user.email)

@api_view(['POST'])
def send_email_new_password(request):
    form=request.data
    userEmail=form['email']
    # проверить, если ли такой пользователь в базе данных
    try:
        user=User.objects.get(email=userEmail)
    except ObjectDoesNotExist as e:
        pubm="Не найдено активной учетной записи с указанным адресом эл.почты"
        privm=e.args
        error=get_error_object(pubm,privm)
        return Response(error,status=status.HTTP_400_BAD_REQUEST)
    try:
        reset_password_token=NewPasswordToken.objects.get(user=user)
        reset_password_token.delete()
    except:
        pass
    # если пользователь найден, сформировать токен и отправить эл.сообщение
    token=PasswordResetTokenGenerator().make_token(user)
    reset_password_token=NewPasswordToken()
    reset_password_token.user=user
    reset_password_token.token=token
    reset_password_token.save()
    link=request.scheme+'://'+request.get_host()+'/'+'account/new-pass/'+token
    link=link_adaptto_client(link)
    subject='Сброс пароля в ccjx.comminity'
    body=f'Для создания нового пароля перейдите по ссылке {link}'
    user.email_user(subject,body)
    print(f'✓ эл.сообщение отправлено на адрес {user.email}')
    return Response()


@api_view(['POST'])
def my_login(request):
    result=get_user_credentials(request,'login')
    if type(result)==Response:
        return result
    try:
        username=result['email']
        password=result['password']
        user=authenticate(request,username=username,password=password)
        if user is None:
            pubm='Пользователь с указанным именем или паролем не найден'
            privm='Пользователь с указанными именем или паролем не найден'
            error=get_error_object(pubm,privm)
            return Response(error,status=status.HTTP_400_BAD_REQUEST)
        elif user is not None:
            try:
                login(request,user)
            except Exception as e:
                pubm='При попытке входа возникла ошибка'
                privm=e.args
                error=get_error_object(pubm,privm)
                return Response(error,status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(e.args,status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def my_logout(request):
    try:
        logout(request)
    except Exception as e:
        privm=e.args
        error=get_error_object(settings.ERROR_DEFAULT_PUBM,privm)
        return Response(error,status=status.HTTP_400_BAD_REQUEST)
    return Response()

