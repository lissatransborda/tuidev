class UserWithoutArticles {
  id: string;
  username: string;
  password: string;
  name: string;

  constructor(id: string, username: string, password: string, name: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
  }
}

export { UserWithoutArticles };
