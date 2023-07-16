import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {

  baseUrl: string = `http://${location.hostname}:5000/api`;
  DEFAULT_ERROR_MESSAGE = 'Извините, возникла ошибка';
  URL_TOKEN = `${this.baseUrl}/token/`;
  URL_TOKEN_REFRESH = `${this.baseUrl}/token/refresh/`;
  URL_REGISTER = `${this.baseUrl}/account/register/`;
  URL_EMAIL_VERIFICATION = `${this.baseUrl}/account/register/verify-email-with-token/`;
  URL_SEND_EMAIL_NEW_PASS = `${this.baseUrl}/account/send-email-new-password/`;
  URL_NEW_PASS = `${this.baseUrl}/account/new-pass/`;

  URL_MY_QUESTIONS = `${this.baseUrl}/my-questions/`;
  URL_ALL_QUESTIONS = `${this.baseUrl}/topics/`;
  URL_ANSWERS_LIST = `${this.baseUrl}/answers/`;
  URL_ANSWERS_CREATE = `${this.baseUrl}/answers/`;
  URL_COMMENTS_LIST = `${this.baseUrl}/comments/`;
  URL_COMMENTS_CREATE = `${this.baseUrl}/comments/`;
  
  constructor() { }
  getUrlTopicCreate(userId: string) {
    const url = `${this.baseUrl}/topics/`;
    return url;
  }
  getUrlTopicDetail(topicId: string) {
    const url = `${this.baseUrl}/topics/${topicId}/`;
    return url;
  }
  getQuestionDeleteUrl(topicId: string) {
    const url = `${this.baseUrl}/topics/${topicId}`;
    return url;
  }
  getUrlAnswerDetail(id: string) {
    return `${this.baseUrl}/answers/${id}/`;
  }
  getUrlCommentDetail(id: string) {
    return `${this.baseUrl}/comments/${id}/`;
  }
}
