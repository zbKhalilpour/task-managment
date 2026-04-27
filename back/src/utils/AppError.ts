export class AppError extends Error{
  public statusCode: number;
  public isOprational: boolean

  constructor(message: string, statusCode = 500){
    super(message)
    this.statusCode=statusCode
    this.isOprational=true
  }
}