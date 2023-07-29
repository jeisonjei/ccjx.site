import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
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

  constructor() {}
  getUrlTopicCreate(userId: string) {
    return `${this.baseUrl}/topics/`;
  }
  getUrlTopicDetail(topicId: string) {
    return `${this.baseUrl}/topics/${topicId}/`;
  }
  getUrlTopicLast(amount: number) {
    return `${this.baseUrl}/topics/last/${amount}/`;
  }
  getUrlTopicCount() {
    return `${this.baseUrl}/topics/count/`;
  }
  getUrlTopicListShort() {
    return `${this.baseUrl}/topics/short/`;
  }
  getUrlTopicListMy() {
    return `${this.baseUrl}/my-questions/`;
  }
  getQuestionDeleteUrl(topicId: string) {
    return `${this.baseUrl}/topics/${topicId}`;
  }
  getUrlAnswerDetail(id: string) {
    return `${this.baseUrl}/answers/${id}/`;
  }
  getUrlCommentDetail(id: string) {
    return `${this.baseUrl}/comments/${id}/`;
  }
  getUrlVoteList() {
    return `${this.baseUrl}/votes/`;
  }
  getUrlVoteCreate() {
    return `${this.baseUrl}/votes/`;  
  }
  getUrlTagList() {
    return `${this.baseUrl}/tags/`;
  }
  getUrlTagCreate() {
    return `${this.baseUrl}/tags/`;
  }
  getUrlTagRetrieve(id: string) {
    return `${this.baseUrl}/tags/${id}/`;
  }
  getUrlTagUpdate(id: string) {
    return `${this.baseUrl}/tags/${id}/`;
  }
  getUrlTagDelete(id: string) {
    return `${this.baseUrl}/tags/${id}/`;
  }
}
