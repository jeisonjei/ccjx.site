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

class AnswerSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True,required=False)
    user=UserSerializer(read_only=True)
    class Meta:
        model=Answer
        fields="__all__"
        depth=0
        
class TopicSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True,required=False,read_only=True)
    user=UserSerializer(read_only=True)
    class Meta:
        model=Topic
        fields=['id','user','topic','text','type','answers','comments']   
        depth=1    