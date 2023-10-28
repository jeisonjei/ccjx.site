from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Answer, Comment, Tag, Topic, Vote
from .serializers import AnswerSerializer, CommentSerializer, TagSerializer, TopicSerializer, TopicSerializerLists, TopicSerializerShort, TopicSerializerMy, VoteSerializer
from django.db.models import F
import itertools
from nameof import nameof
from django.db.models import Count
from django.db.models import Sum

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
        amount = self.kwargs['amount']
        queryset=Topic.objects.filter(is_private=False).order_by('date_created').order_by(F('id').desc())[:amount]
        return queryset
    
class TopicNonAnswered(generics.ListAPIView):
    '''
    Класс для возвращения вопросов, у которых нет ответа. Планируется использовать для отображения
    списка таких вопросов на главной странице сайта.
    Нужно, чтобы была возможность вернуть какое-то определённое количество вопросов.
    Сортировка по дате добавления, НО (!) При каждом запросе область выборки должна смещаться,
    для того, чтобы потенциально были показаны все вопросы без ответа.
    '''
    pass    

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
        count = self.kwargs['count']
        topics = Topic.objects.all().filter(is_private=False).filter(is_article=True).annotate(scores=Sum('votes__score'))
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
    queryset=Tag.objects.all()
    
class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Класс для получения одного конкретного тэга
    '''
    lookup_field='id'
    serializer_class=TagSerializer
    queryset=Tag.objects.all()