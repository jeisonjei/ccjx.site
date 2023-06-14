from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from nameof import nameof

from .models import Answer, Question, User

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
        token['email']=user.email
        return token
    
class UserSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    email=serializers.CharField(max_length=52,required=False)
    
class QuestionSerializer(serializers.Serializer):
    id=serializers.IntegerField(required=False)
    user_id=serializers.IntegerField()
    user=UserSerializer(Question.user,required=False)
    topic=serializers.CharField(max_length=255)
    text=serializers.CharField(max_length=1000,required=False)
    def create(self, validated_data):
        question=Question.objects.create(**validated_data)
        return question
        
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Answer
        fields="__all__"