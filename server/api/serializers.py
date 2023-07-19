from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from nameof import nameof

from .models import Answer, Topic, User,Comment

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
        token['email']=user.email
        return token
    
class UserSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    email=serializers.CharField(max_length=52,required=False)
    
                
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
    class Meta:
        model=Answer
        fields=['id','user','topic','text','type','comments']
        depth=0
    def to_representation(self, instance):
        representation=super(AnswerSerializer,self).to_representation(instance)
        representation['user']=UserSerializer(instance.user).data
        return representation
        
class TopicSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True,required=False)
    comments = CommentSerializer(many=True,required=False)
    class Meta:
        model=Topic
        fields=['id','user','title','text','type','answers','comments','is_article','is_private','date_created']   
        depth=0    
    def to_representation(self, instance):
        representation=super(TopicSerializer,self).to_representation(instance)
        representation['user']=UserSerializer(instance.user).data
        return representation
    
class TopicSerializerShort(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id','title','date_created']    