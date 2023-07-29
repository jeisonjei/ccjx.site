from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Answer, Comment, Tag, Topic, Vote
from .serializers import AnswerSerializer, CommentSerializer, TagSerializer, TopicSerializer, TopicSerializerShort, TopicSerializerMy, VoteSerializer
from django.db.models import F
import itertools
from nameof import nameof

class MyQuestionList(generics.ListAPIView):
    '''
    Пока что класс используется для отображения списка вопросов, принадлежащих пользователю на странице 'Мои вопросы'
    '''
    serializer_class = TopicSerializerMy

    def get_queryset(self):
        user = self.request.user
        queryset = Topic.objects.all()
        return queryset.filter(user=user)

class TopicListCreate(generics.ListCreateAPIView):
    lookup_field='id'
    serializer_class=TopicSerializer
    queryset=Topic.objects.filter(is_private=False)
    
class TopicListShort(generics.ListAPIView):
    permission_classes=[AllowAny]
    lookup_field='id'
    serializer_class=TopicSerializerShort
    queryset=Topic.objects.filter(is_private=False)

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field='id'    
    serializer_class=TopicSerializer
    queryset=Topic.objects.all()
    
class TopicLastList(generics.ListAPIView):
    permission_classes=[AllowAny]
    lookup_field='id'
    serializer_class=TopicSerializerShort
    def get_queryset(self):
        amount = self.kwargs['amount']
        queryset=Topic.objects.filter(is_private=False).order_by('date_created').order_by(F('id').desc())[:amount]
        return queryset
    
class TopicCount(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        return Response(Topic.objects.filter(is_private=False).values_list('id',flat=True))

class TopicTagList(generics.ListAPIView):
    lookup_field='id'
    serializer_class=TopicSerializer
    def get_queryset(self):
        topic_id=self.kwargs['id']
        queryset=Topic.objects.filter(id=topic_id)
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
    
class VoteListCreate(generics.ListCreateAPIView):
    lookup_field = 'id'
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

class TagListCreate(generics.ListCreateAPIView):
    lookup_field='id'
    serializer_class=TagSerializer
    queryset=Tag.objects.all()
    

class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field='id'
    serializer_class=TagSerializer
    queryset=Tag.objects.all()