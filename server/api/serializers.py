from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers

from .models import Question, User

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
        token['email']=user.email
        return token
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields="__all__"

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Question
        fields="__all__"
    