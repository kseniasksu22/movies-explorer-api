const serverErr = {
  error: "Ошибка сервера."
};
const statusOk = {
  removeMovie: "Фильм успешно удален.",
};
const badRequestError = {
  fatal: "Невозможно обработать запрос.",
  findUser: "Пользователь не найден",
  createUserFatal: "Передайте почту или пароль",
  loginFatal: "Неккоректные данные. Передайте правильные почту или пароль"
};
const unautorizedErr = {
  needAutorization: "Необходима авторизация. Пожалуйста, зарегистрируйтесь или войдите в аккаунт.",
  wrongData: "Неправильные почта или пароль.",
};
const forbiddenErr = {
  deleteMovie: "Запрещено удалять фильмы, созданные другими пользователями.",
};
const notFoundErr = {
  movieId: "Фильм с указанным id не найден.",
  userId: "Пользователь с указанным id не существует.",
  notFoundPage: "Запрашиваемый ресурс не найден.",
};
const conflictErr = {
  conflictEmail: "Пользователь с таким email уже существует. Используйте другую почту для регистрации",
};

module.exports = {
  serverErr,
  statusOk,
  badRequestError,
  unautorizedErr,
  forbiddenErr,
  notFoundErr,
  conflictErr,
};
