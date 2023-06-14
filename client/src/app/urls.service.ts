import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {

  baseUrl: string = `http://${location.hostname}:5000/api`;
  public DEFAULT_ERROR_MESSAGE = 'Извините, возникла ошибка';
  public URL_TOKEN = `${this.baseUrl}/token/`;
  public URL_TOKEN_REFRESH = `${this.baseUrl}/token/refresh/`;
  public URL_REGISTER = `${this.baseUrl}/account/register/`;
  public URL_EMAIL_VERIFICATION = `${this.baseUrl}/account/register/verify-email-with-token/`;
  public URL_SEND_EMAIL_NEW_PASS = `${this.baseUrl}/account/send-email-new-password/`;
  public URL_NEW_PASS = `${this.baseUrl}/account/new-pass/`;
  public URL_MY_QUESTIONS = `${this.baseUrl}/my-questions/`;
  public URL_ALL_QUESTIONS = `${this.baseUrl}/all-questions/`;
  
  constructor() { }
  getNewQuestionCreateUrl(userId: string) {
    const url = `${this.baseUrl}/user/${userId}/question/`;
    return url;
  }
  getNewQuestionDetailUrl(userId: string, questionId: string) {
    const url = `${this.baseUrl}/user/${userId}/question/${questionId}/`;
    return url;
  }
  getQuestionDetailUrl(questionId: string) {
    const url = `${this.baseUrl}/question/${questionId}/`;
    return url;
  }
  getQuestionAnswers(questionId: string) {
    const url = `${this.baseUrl}/question/${questionId}/answers/`;
    return url;
  }
  
  
}
