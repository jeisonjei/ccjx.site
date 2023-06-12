
// коллекции в url указываются в единственном числе

export type ServerError = {
  public: string,
  private:string
}
export type Question = /**модель Question */ {
  id?:string,
  user?:string, /**Передаётся первичный ключ */
  topic: string,
  text?:string,
  tags?: string[],
}
