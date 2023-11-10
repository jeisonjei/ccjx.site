
// коллекции в url указываются в единственном числе

export type ServerError = {
  public: string,
  private: string,
  detail?:string
}
export type User = {
  id: string,
  email?:string
}
// входящий и исходящий типы отличаются, см. serializers.py
export type Topic = /**модель Question */ {
  id?:string,
  slug?:string,
  type?:string
  user?:string, /**Передаётся первичный ключ */
  title: string,
  text?: string,
  is_article?: boolean,
  is_private?: boolean,
  date_created?: string,
  tags?: any,
  scores?: any,
  notify_me?:boolean
}
// входящий и исходящий типы отличаются, см. serializers.py
export type Answer = /**модель Answer */ {
  id?: string,
  type?:string
  topic:string,
  user?: string,
  text?: string,
}
export type Comment = /**модель Comment */{
  id?: string,
  type?:string
  topic?: string,
  answer?:string,
  user: string,
  text: string,

}
export interface Tag{
  id?: string,
  user?: string,
  name: string,
  is_private: boolean,
  description?: string,
  topics: string[],
  backgroundColor?: string;
}
export interface MessDial {
  title: string,
  message:string
}
export interface DelConfDial{
  title: string,
  message:string
}
