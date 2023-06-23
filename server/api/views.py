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


class NewQuestionCreate(APIView):
    def post(self, request, user_id):
        try:
            question=Topic.objects.create(
                user_id=request.data['user']['id'],
                topic=request.data['topic']
            )
            serializer=TopicSerializer(question)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            pubm='Извините, возникла ошибка'
            privm=e.args
            error=get_error_object(pubm,privm)
            return Response(error, status=status.HTTP_400_BAD_REQUEST)


class NewQuestionDetail(APIView):
    def get(self, request, user_id, id):
        try:
            question = Topic.objects.get(id=id)
            serializer = TopicSerializer(question)
            return Response(serializer.data)
        except Topic.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, user_id, id):
        try:
            question = Topic.objects.get(id=id)
            question.title = request.data['topic']
            question.text = request.data['text']
            question.save()
            serializer = TopicSerializer(question)
            return Response(serializer.data)
        except:
            raise


class MyQuestionList(generics.ListAPIView):
    '''
    Пока что класс используется для отображения списка вопросов, принадлежащих пользователю на странице 'Мои вопросы'
    '''
    serializer_class = TopicSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Topic.objects.all()
        return queryset.filter(user=user)
    
class AllQuestionList(generics.ListAPIView):
    '''
    Класс возвращает коллекцию всех вопросов, независимо от владельца. Пока что используется как коллекция поля поиска
    '''
    serializer_class=TopicSerializer
    queryset=Topic.objects.all()


class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field='id'    
    queryset=Topic.objects.all()
    serializer_class=TopicSerializer
            
class AnswerListCreate(generics.ListCreateAPIView):
    lookup_field='id'
    serializer_class=AnswerSerializer
    def get_queryset(self):
        question_id = self.kwargs['id']
        queryset=Answer.objects.filter(question=question_id)
        return queryset

class CommentListCreate(generics.ListCreateAPIView):
    lookup_field='id'        
    serializer_class=CommentSerializer
    queryset=Comment.objects.all()


