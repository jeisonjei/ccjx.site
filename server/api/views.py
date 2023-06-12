from django.http import Http404
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import AnonymousUser
from nameof import nameof
from .service_functions import get_error_object
from .models import Question, User
from .serializers import QuestionSerializer, UserSerializer


class NewQuestionCreate(APIView):
    def get(self, request, user_id):
        pass

    def post(self, request, user_id):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewQuestionDetail(APIView):
    def get(self, request, user_id, id):
        try:
            q = Question.objects.get(id=id)
            serializer = QuestionSerializer(q)
            return Response(serializer.data)
        except Question.DoesNotExist:
            raise Http404

    def patch(self, request, user_id, id):
        try:
            q = Question.objects.get(id=id)
            q.title = request.data['topic']
            q.text = request.data['text']
            q.save()
            serializer = QuestionSerializer(q)
            return Response(serializer.data)
        except:
            raise


class MyQuestionList(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Question.objects.all()
        return queryset.filter(user=user)
    
class AllQuestionList(generics.ListAPIView):
    serializer_class=QuestionSerializer
    queryset=Question.objects.all()


class QuestionDetail(APIView):
    def get(self, request, id):
        try:
            q = Question.objects.get(id=id)
            serializer = QuestionSerializer(q)
            return Response(serializer.data)
        except:
            raise
