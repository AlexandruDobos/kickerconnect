export const ip = //put your ip here

export const port = "8000"
export const chatPort="8001"
export const profilePort = "8000"

export const usernameValidator = (username) => {
    if (!username || username.length < 3) return 'Username must contain at least 3 characters.';

    return '';
};

export const emailValidator = (email) => {
    const re = /\S+@\S+\.\S+/;

    if (!email || email.length <= 0) return 'Email cannot be empty.';
    if (!re.test(email)) return 'Introduce a valid email address.';

    return '';
};

export const passwordValidator = (password) => {
    if (!password || password.length <= 0) return 'Password cannot be empty.';

    return '';
};

export const confirmPasswordValidator = (password, confirmPassword) => {
    if (!password || !confirmPassword) return 'Both passwords are required.';
    if (password !== confirmPassword) return 'Passwords are not the same.';

    return '';
};
