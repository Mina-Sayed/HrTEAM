export class ErorrResponse extends Error
{
  constructor(message: any, public status: any)
  {
    super(message);
    this.status = status;
  }
}
