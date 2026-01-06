const logo = [
  {
    char: "T"
  }, 
  {
    char: "a"
  }, 
  {
    char: "l"
  }, 
  {
    char: "k"

  }, 
  {
    char: "s"
  }, 
  {
    char: "y"
  }]

const makeMessage = (text, user = "Sara") => ({
  id: crypto.randomUUID(),
  user,
  avatar: "/assets/profile.jpg",
  text,
  createdAt: Date.now(),
});

export default logo
export { makeMessage };