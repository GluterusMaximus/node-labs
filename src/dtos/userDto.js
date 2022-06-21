export default class UserDto {
  id;
  name;
  email;
  isAdmin;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.isAdmin = model.isAdmin;
  }
}
