from django.urls import path,re_path,include
from .account import register
from .account import verify_email_with_token
from .account import send_email_new_password
from .account import new_password
from .views import NewQuestionCreate,NewQuestionDetail
from .views import QuestionDetail
from .views import MyQuestionList
from .views import AllQuestionList
from .views import AnswerListCreate
# коллекции с параметрами указываются в единственном числе, это поможет избежать путаницы
# коллекции без параметров указываются во множественном числе
urlpatterns = [
    path('account/register/',register),
    path('account/register/verify-email-with-token/<str:token>',verify_email_with_token),
    path('account/send-email-new-password/',send_email_new_password),
    path('account/new-pass/',new_password),
    path('user/<int:user_id>/question/',NewQuestionCreate.as_view()),
    path('user/<int:user_id>/question/<int:id>/',NewQuestionDetail.as_view()),
    path('question/<int:id>/',QuestionDetail.as_view()),
    path('my-questions/',MyQuestionList.as_view()),
    path('all-questions/',AllQuestionList.as_view()),
    path('question/<int:id>/answers/',AnswerListCreate.as_view())
]