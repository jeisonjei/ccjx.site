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
    
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Answer
        fields="__all__"
    def to_representation(self, instance):
        representation=super(AnswerSerializer,self).to_representation(instance)
        representation['user']=UserSerializer(instance.user).data
        return representation
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields="__all__"        
    def to_representation(self, instance):
        representation=super(CommentSerializer,self).to_representation(instance)
        representation['user']=UserSerializer(instance.user).data
        representation['question']=TopicSerializer(instance.question).data
        representation['answer']=AnswerSerializer(instance.answer).data
        return representation
        
class TopicSerializer(serializers.Serializer):
    id=serializers.IntegerField(required=False)
    user_id=serializers.IntegerField()
    user=UserSerializer(Topic.user,required=False)
    topic=serializers.CharField(max_length=255)
    text=serializers.CharField(max_length=1000,required=False)
    type=serializers.CharField(max_length=52,required=False)
    def create(self, validated_data):
        question=Topic.objects.create(**validated_data)
        return question
        