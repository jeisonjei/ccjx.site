from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from nameof import nameof

from .models import Answer, Tag, Topic, User,Comment, Vote

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
        token['email']=user.email
        return token
    
class UserSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    email=serializers.CharField(max_length=52,required=False)
    
class VoteSerializer(serializers.ModelSerializer):
    '''
    Сериализатор голосов. Так как больших данных эта модель не хранит, будет одна версия сериализатора
    '''
    class Meta:
        model = Vote
        fields = "__all__"
                
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields="__all__"  
    def to_representation(self, instance):
        representation=super(CommentSerializer,self).to_representation(instance)
        representation['user']=UserSerializer(instance.user).data
        return representation     

class AnswerSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True,required=False)
    votes = VoteSerializer(many = True, required = False)
    class Meta:
        model=Answer
        fields=['id','user','topic','text','type','comments','votes']
        depth=0
    def to_representation(self, instance):
        representation=super(AnswerSerializer,self).to_representation(instance)
        representation['user']=UserSerializer(instance.user).data
        return representation

class TagSerializer(serializers.ModelSerializer):
    '''
    Сериализатор тэгов
    '''
    class Meta:
        model = Tag
        fields = ['id','user','name','is_private','description','topics']
                
class TopicSerializer(serializers.ModelSerializer):
    '''
    Этот сериалайзер пока что используется для отображения конкретного вопроса,
    так как здесь присутствуют все поля и их получение затратно
    '''
    answers = AnswerSerializer(many=True,required=False)
    comments = CommentSerializer(many=True,required=False)
    votes = VoteSerializer(many = True, required = False)
    tags = TagSerializer(many = True, required = False)
    class Meta:
        model=Topic
        fields=['id','slug','user','title','text','type','answers','comments','is_article','is_private','date_created','votes','tags','notify_me']   
        depth=0    
    def to_representation(self, instance):
        representation=super(TopicSerializer,self).to_representation(instance)
        representation['user']=UserSerializer(instance.user).data
        return representation
    
class TopicSerializerShort(serializers.ModelSerializer):
    '''
    Этот сериалайзер используется для загрузки всех вопросов в поле поиска (компонент search-bar)
    '''
    tags = TagSerializer(many = True,required=False)
    class Meta:
        model = Topic
        fields = ['id','slug','title','is_article','tags']   
        
class TopicSerializerLists(serializers.ModelSerializer):
    '''
    Этот сериалайзер используется для списков, которые отображаются на главной странице и боковой панели.
    Возможно он заменит собой TopicSerializerShort - тот, что выше, так как
    оба созданы для получения легковесных порций данных.
    Причина, по которой создаётся этот новый сериализатор в том, что в предыдущем нет поля 'scores', 
    которое назначается динамически в классе представления при помощи метода annotate
    ''' 
    scores = serializers.IntegerField()
    tags = TagSerializer(many = True,required=False)

    class Meta:
        model = Topic
        fields = ['id','slug','title','tags','scores']

class TopicSerializerMy(serializers.ModelSerializer):
    '''
    Этот сериалайзер используется для загрузки вопросов для страницы "Мои записи"
    '''
    tags = TagSerializer(many = True, required = False)
    class Meta:
        model = Topic
        fields = ['id','slug','title','date_created','tags','is_article','is_private']    
