function articleURLGenerate(username: string, title: string) {
  const randomNumber = Math.floor(Math.random() * (9999 - 1000) + 1000);

  return `${username}/${title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(" ", "-")}-${randomNumber}`;
}

export { articleURLGenerate };
