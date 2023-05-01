class PublicUserWithoutArticles {
  id: string;
  username: string;
  name: string;

  constructor(id: string, username: string, name: string) {
    this.id = id;
    this.username = username;
    this.name = name;
  }
}

export { PublicUserWithoutArticles };
