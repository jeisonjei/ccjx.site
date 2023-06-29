from django.http import Http404
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import AnonymousUser
from nameof import nameof
from .service_functions import get_error_object
from .models import Answer, Comment, Topic, User
from .serializers import AnswerSerializer, CommentSerializer, TopicSerializer, UserSerializer

class MyQuestionList(generics.ListAPIView):
    '''
    Пока что класс используется для отображения списка вопросов, принадлежащих пользователю на странице 'Мои вопросы'
    '''
    serializer_class = TopicSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Topic.objects.all()
        return queryset.filter(user=user)

class TopicListCreate(generics.ListCreateAPIView):
    lookup_field='id'
    queryset=Topic.objects.all()
    serializer_class=TopicSerializer

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field='id'    
    queryset=Topic.objects.all()
    serializer_class=TopicSerializer
            
class AnswerListCreate(generics.ListCreateAPIView):
    lookup_field='id'
    serializer_class=AnswerSerializer
    queryset=Topic.objects.all()

class CommentListCreate(generics.ListCreateAPIView):
    lookup_field='id'        
    serializer_class=CommentSerializer
    queryset=Comment.objects.all()


