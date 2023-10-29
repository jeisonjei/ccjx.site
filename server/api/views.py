from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Answer, Comment, Tag, Topic, Vote
from .serializers import AnswerSerializer, CommentSerializer, TagSerializer, TopicSerializer, TopicSerializerLists, TopicSerializerShort, TopicSerializerMy, VoteSerializer
from django.db.models import F
from django.db.models import Q
import itertools
from nameof import nameof
from django.db.models import Count
from django.db.models import Sum
from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator
import random
import redis
from django.conf import settings

redis_connection = redis.StrictRedis(host=settings.REDIS_HOST,
                                         port=settings.REDIS_PORT, db=0, decode_responses=True)

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
    '''
    Класс используется для загрузки вопросов в форму поиска
    '''
    permission_classes=[AllowAny]
    lookup_field='id'
    serializer_class=TopicSerializerShort
    queryset=Topic.objects.filter(is_private=False)

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Класс используется для получения и отображения одного вопроса
    '''
    lookup_field='id'    
    serializer_class=TopicSerializer
    queryset=Topic.objects.all()
    
class TopicRecentList(generics.ListAPIView):
    '''
    Класс предназначен для получения какого-то количества самых свежих вопросов. 
    Сейчас используется для списков '10 новых записей' на главной странице и 'Новые записи' на странице Topic
    '''
    permission_classes=[AllowAny]
    lookup_field='id'
    serializer_class=TopicSerializerShort
    def get_queryset(self):
        tag_names = self.request.GET.getlist('tags')
        count = self.kwargs['count']
        if len(tag_names)>0:
            topics = Topic.objects.filter(is_private=False,tags__name__in=tag_names).distinct()
        else:
            topics = Topic.objects.filter(is_private=False)
        queryset=topics[:count]
        return queryset
    
class TopicNonAnsweredList(generics.ListAPIView):
    '''
    Класс для возвращения вопросов, у которых нет ответа. Планируется использовать для отображения
    списка таких вопросов на главной странице сайта.
    Нужно, чтобы была возможность вернуть какое-то определённое количество вопросов.
    Сортировка по дате добавления, НО (!) При каждом запросе область выборки должна смещаться,
    для того, чтобы потенциально были показаны все вопросы без ответа.
    '''
    permission_classes=[AllowAny]
    lookup_field='id'
    serializer_class = TopicSerializerLists
    counter=0
    def get_queryset(self):
        tag_names = self.request.GET.getlist('tags')
        count=self.kwargs['count']
        if len(tag_names)>0:
            topics = Topic.objects.filter(is_article=False,is_private=False,tags__name__in=tag_names).distinct()
        else:
            topics = Topic.objects.filter(is_article=False,is_private=False)
        topics = topics.annotate(scores=Sum('votes__score')).annotate(answers_count=Count('answers')).exclude(answers_count__gt=0)            
        i = redis_connection.get('counter')
        if i==None:
            self.counter=0
        else:
            self.counter=int(i)
        self.counter+=1
        paginator = Paginator(topics,count)
        if self.counter>paginator.num_pages:
            self.counter=1
        redis_connection.set('counter',self.counter)
        page = paginator.get_page(self.counter)
        queryset = page.object_list
        return queryset

class TopicPopularArticlesList(generics.ListAPIView):
    '''
    Класс для возвращения популярных статей. Планируется использовать для отображения
    статей на главной странице сайта.
    Сортировка по дате добавления,
    но каким образом оценивать популярность статьи? По количеству просмотров или по количеству оценок?
    Наверное всё же по количеству оценок. Оценки конечно отражают степень популярности статьи, несмотря на то,
    что голосовать могут только зарегистрированные пользователи. И кажется, что это проще реализовать.
    Если у двух статей одинаковые оценки, то они сортируются по дате добавления.
    Получится, что если ни у каких статей нет оценок, будут отображатся просто самые новые статьи.
    '''
    permission_classes=[AllowAny]
    lookup_field='id'
    serializer_class=TopicSerializerLists
    def get_queryset(self):
        tag_names = self.request.GET.getlist('tags')
        count = self.kwargs['count']
        if len(tag_names)>0:
            topics = Topic.objects.filter(is_private=False,is_article=True,tags__name__in=tag_names).distinct()
        else:
            topics = Topic.objects.filter(is_private=False,is_article=True)
        topics = topics.annotate(scores=Sum('votes__score'))
        topics_ordered_by_scores=topics.exclude(scores=None).order_by('-scores')[:count]
        topics_with_custom_field=topics_ordered_by_scores.values('id','title','scores')
        queryset = topics_with_custom_field
        return queryset

class TopicCount(APIView):
    '''
    Класс использовался для отображения случайного вопроса на главной странице.
    -OBSOLETE-
    '''
    permission_classes=[AllowAny]
    def get(self, request):
        return Response(Topic.objects.filter(is_private=False).values_list('id',flat=True))

class TopicTagList(generics.ListAPIView):
    '''
    Назначение пока не ясно. Вроде бы нигде не используется
    -OBSOLETE-
    '''
    lookup_field='id'
    serializer_class=TopicSerializer
    def get_queryset(self):
        topic_id=self.kwargs['id']
        queryset=Topic.objects.filter(id=topic_id)
        return queryset
            
class AnswerListCreate(generics.ListCreateAPIView):
    '''
    Класс для создания ответов
    '''
    lookup_field='id'
    serializer_class=AnswerSerializer
    queryset=Answer.objects.all()
    
class AnswerDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Класс для получения одного конкретного ответа
    '''
    lookup_field='id'
    serializer_class=AnswerSerializer
    queryset=Answer.objects.all()

class CommentListCreate(generics.ListCreateAPIView):
    '''
    Класс для создания комментариев
    '''
    lookup_field='id'        
    serializer_class=CommentSerializer
    queryset=Comment.objects.all()
    
class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Класс для получения одного конкретного комментария
    '''
    lookup_field='id'
    serializer_class=CommentSerializer
    queryset=Comment.objects.all()
    
class VoteListCreate(generics.ListCreateAPIView):
    lookup_field = 'id'
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

class TagListCreate(generics.ListCreateAPIView):
    '''
    Класс для создания тэгов
    '''
    lookup_field='id'
    serializer_class=TagSerializer
    tags=Tag.objects.annotate(topics_count=Count('topics'))
    queryset=tags.filter(topics_count__gt=0)
    
    
class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Класс для получения одного конкретного тэга
    '''
    lookup_field='id'
    serializer_class=TagSerializer
    queryset=Tag.objects.all()