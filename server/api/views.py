from django.shortcuts import resolve_url
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
from urllib.parse import urljoin
from django.core.mail import send_mail
import threading


# redis_connection = redis.StrictRedis(host=settings.REDIS_HOST,
#                                          port=settings.REDIS_PORT, db=0, decode_responses=True)

class MyQuestionList(generics.ListAPIView):
    '''
    Пока что класс используется для отображения списка вопросов, принадлежащих пользователю на странице 'Мои вопросы'
    '''
    serializer_class = TopicSerializerMy

    def get_queryset(self):
        tag_names=self.request.GET.getlist('tags')
        user = self.request.user
        if len(tag_names)>0:
            topics=Topic.objects.filter(tags__name__in=tag_names,user=user).distinct()
        else:
            topics=Topic.objects.filter(user=user)
        queryset=topics
        return queryset

class TopicListCreate(generics.ListCreateAPIView):
    lookup_field='slug'
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
    lookup_field='slug'    
    serializer_class=TopicSerializer
    queryset=Topic.objects.all()
    def get(self, request, *args, **kwargs):
        user = request.user
        topic_slug = kwargs.get('slug')
        try:
            topic = self.queryset.get(slug=topic_slug)
        except Topic.DoesNotExist:
            return Response({'public_message':"Запись не найдена"}, status=status.HTTP_404_NOT_FOUND)
        if topic.is_private and not user==topic.user:
            return Response({'public_message':"Запись не найдена"}, status=status.HTTP_404_NOT_FOUND)
        return super().get(request, *args, **kwargs)
    
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
        topics_with_custom_field=topics_ordered_by_scores.values('id','slug','title','scores')
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
    
class EmailThread(threading.Thread):
    def __init__(self, subject, message, recipient_list):
        self.subject = subject
        self.message = message
        self.recipient_list = recipient_list
        threading.Thread.__init__(self)

    def run(self):
        send_mail(self.subject, self.message, settings.DEFAULT_FROM_EMAIL, self.recipient_list)

class CommentListCreate(generics.ListCreateAPIView):
    '''
    Класс для создания комментариев
    '''
    lookup_field='id'        
    serializer_class=CommentSerializer
    queryset=Comment.objects.all()
    def perform_create(self, serializer):
        instance = serializer.save()
        user = instance.topic.user
        topic_slug = instance.topic.slug
        href_origin = self.request.META.get('HTTP_REFERER')
        topic_url = urljoin(href_origin,f'topics/{topic_slug}')
        subject = f"Новый комментарий к вашей записи \"{instance.topic.title}\""
        message = (f"Здравствуйте, к вашей записи \"{instance.topic.title}\" оставлен новый комментарий. " 
                   f"Посмотреть свою запись можно по ссылке {topic_url}.")
                   # TODO f"Чтобы больше не получать подобных уведомлений перейдите по ссылке.")
                   # TODO f"Также вы можете настроить уведомления в своём профиле на сайте") TODO url профиля
        print(f'topic.notify_me {instance.topic.notify_me}')
        if instance.topic.notify_me:
            EmailThread(subject,message,[user.email]).start()
        return super().perform_create(serializer)

    
    
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
    Класс для создания тэгов и получения списка.
    Все тэги, у которых is_private=False считаются публичными и 
    их могут использовать все пользователи для маркировки своих записей. В этом случае
    если кто-то создал тэг, которого ещё не было, этот тэг появляется в полях поиска у всех пользователей.
    В то же время у пользователя могут быть личные тэги, которые он не хотел бы показывать всем, но которые также
    сможет использовать для маркировки своих записей (возможно в том числе публичных). 
    По умолчанию с клиентской стороны все создаваемые тэги публичные, поэтому при создании
    проверяется только, существует ли тэг с таким id среди публичных.
    Предполагается, что пользователь не должен желать использовать публичный тэг в качестве личного, так как
    в этом случае можно просто пользоваться публичным тэгом.
    В то же время пользователь может создать тэг, которого нет среди публичных и сделать его личным. 
    В этом случае задействуется класс TagDetail.
    Уникальность тэгов в модели будет отключена, так как у разных пользователей могут быть 
    личные тэги с одинаковыми именами. Проверки выполняются в классах этого модуля.
    '''
    lookup_field='id'
    serializer_class=TagSerializer
    def get_queryset(self):
        tags=Tag.objects.filter(is_private=False).annotate(topics_count=Count('topics'))
        queryset=tags
        return queryset
    def create(self, request, *args, **kwargs):
        '''
        По умолчанию при нажатии Enter в поле тэгов создаются публичные тэги
        '''
        tag_name=request.data.get('name')
        # Проверить, существует ли тэг с таким именем среди публичных тэгов
        if Tag.objects.filter(name=tag_name,is_private=False).exists():
            return Response({'public_message':f'Извините, тэг {tag_name} уже существует среди публичных тэгов'},status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
class TagMyList(generics.ListCreateAPIView):
    '''
    Класс используется для отображения списка тэгов в поле поиска при создании или редактировании записи.
    К этот список будут включаться все публичные тэги плюс личные тэги пользователя.
    '''    
    lookup_field='id'
    serializer_class=TagSerializer
    def get_queryset(self):
        user = self.request.user
        tags = Tag.objects.filter(Q(is_private=False) | Q(is_private=True,user=user))
        queryset = tags
        return queryset
    
class TagMyPrivateList(generics.ListAPIView):
    lookup_field="id"
    serializer_class=TagSerializer
    def get_queryset(self):
        user=self.request.user
        tags = Tag.objects.filter(is_private=True,user=user)
        queryset = tags
        return queryset
    
class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Класс для получения одного конкретного тэга
    '''
    lookup_field='id'
    serializer_class=TagSerializer
    queryset=Tag.objects.all()
    def patch(self, request, *args, **kwargs):
        user = request.user
        tag_id=kwargs['id']
        tag = Tag.objects.get(id=tag_id)
        tag_name=request.data.get('name',tag.name)
        make_private=request.data.get('is_private')
        if make_private and not tag.is_private:
            # Check if the user already has a tag with the same name
            if Tag.objects.filter(name=tag_name,user=user,is_private=True).exists():
                return Response({'public_message':f"Извините, у вас уже есть тэг '{tag_name}'."},status=status.HTTP_400_BAD_REQUEST)
            # Check if the tag is already used by someone else as public
            if tag.topics.exclude(user=user).exists():
                return Response({'public_message':f"Извините, тэг '{tag_name}' уже кем-то использовался как публичный для маркировки записей. Пожалуйста, возьмите другое имя для нового личного тэга."}, status=status.HTTP_400_BAD_REQUEST)
        if not make_private and tag.is_private:
            if Tag.objects.filter(name=tag_name,is_private=False).exists():
                return Response({'public_message':f"Извините, '{tag_name} уже существует среди публичных тэгов.'"})
        return super().patch(request, *args, **kwargs)