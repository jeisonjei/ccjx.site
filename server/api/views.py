from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Answer, Comment, Topic
from .serializers import AnswerSerializer, CommentSerializer, TopicSerializer
from django.db.models import F
import itertools

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
    queryset=Topic.objects.filter(is_private=False)
    serializer_class=TopicSerializer

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field='id'    
    serializer_class=TopicSerializer
    queryset=Topic.objects.all()
    
class TopicLastList(generics.ListAPIView):
    lookup_field='id'
    serializer_class=TopicSerializer
    def get_queryset(self):
        amount = self.kwargs['amount']
        queryset=Topic.objects.filter(is_private=False).order_by('date_created').order_by(F('id').desc())[:amount]
        return queryset
            
class AnswerListCreate(generics.ListCreateAPIView):
    lookup_field='id'
    serializer_class=AnswerSerializer
    queryset=Answer.objects.all()
    
class AnswerDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field='id'
    serializer_class=AnswerSerializer
    queryset=Answer.objects.all()

class CommentListCreate(generics.ListCreateAPIView):
    lookup_field='id'        
    serializer_class=CommentSerializer
    queryset=Comment.objects.all()
    
class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field='id'
    serializer_class=CommentSerializer
    queryset=Comment.objects.all()
    

