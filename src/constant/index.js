const logo = [
  {
    id: 1,
    char: "T"
  }, 
  {
    id: 2,
    char: "a"
  }, 
  {
    id: 3,
    char: "l"
  }, 
  {
    id: 4,
    char: "k"
  }, 
  {
    id: 5,
    char: "s"
  }, 
  {
    id: 6,
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