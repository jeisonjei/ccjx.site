
// коллекции в url указываются в единственном числе

export type ServerError = {
  public: string,
  private:string
}
export type User = {
  id: string,
  email?:string
}
export type Question = /**модель Question */ {
  id?:string,
  user:User, /**Передаётся первичный ключ */
  topic: string,
  text?:string,
  tags?: string[],
}
export type Answer = /**модель Answer */ {
  id?: string,
  question:Question,
  user?: string,
  text?: string,
  tags?:string[]
}