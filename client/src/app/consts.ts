
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
export type Question = /**модель Question */ {
  id?:string,
  type?:string
  user:User, /**Передаётся первичный ключ */
  topic: string,
  text?:string,
}
export type Answer = /**модель Answer */ {
  id?: string,
  type?:string
  question:string,
  user?: string,
  text?: string,
}
export type Comment = /**модель Comment */{
  id?: string,
  type?:string
  question?: string,
  answer?:string,
  user: string,
  text: string,
  
}