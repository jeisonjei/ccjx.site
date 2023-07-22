from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from nameof import nameof

from .models import Answer, Topic, User,Comment, Vote

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
        
class TopicSerializer(serializers.ModelSerializer):
    '''
    Этот сериалайзер используется для отображения конкретного вопроса
    '''
    answers = AnswerSerializer(many=True,required=False)
    comments = CommentSerializer(many=True,required=False)
    votes = VoteSerializer(many = True, required = False)
    class Meta:
        model=Topic
        fields=['id','user','title','text','type','answers','comments','is_article','is_private','date_created','votes']   
        depth=0    
    def to_representation(self, instance):
        representation=super(TopicSerializer,self).to_representation(instance)
        representation['user']=UserSerializer(instance.user).data
        return representation
    
class TopicSerializerShort(serializers.ModelSerializer):
    '''
    Этот сериалайзер используется для загрузки всех вопросов в поле поиска (компонент search-bar)
    '''
    class Meta:
        model = Topic
        fields = ['id','title']    

class TopicSerializerMy(serializers.ModelSerializer):
    '''
    Этот сериалайзер используется для загрузки вопросов для страницы "Мои записи"
    '''
    class Meta:
        model = Topic
        fields = ['id','title','date_created']    

