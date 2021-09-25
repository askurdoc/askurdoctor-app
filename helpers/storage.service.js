export function getConfig() {
  return JSON.parse(localStorage.getItem('config'));
}

export function getRole() {
  const roles = localStorage.getItem('role');
  const rolesArray = roles.split(',');
  if (rolesArray.length > 1) {
    return rolesArray[1];
  }
  return rolesArray[0];
}

export function checkRole(role) {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user)
  const rolesArray = user.role;
  if (rolesArray.indexOf(role) > -1) {
    return true;
  }
  return false;
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user;
}
