import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { usernameValidator, emailValidator, passwordValidator, confirmPasswordValidator, ip, port } from '../core/utils';
import { useNavigation } from '@react-navigation/native';

const RegisterForm = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState({ value: '', error: '' });
    const [username, setUsername] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [registerError, setRegisterError] = useState({ error: '' });
    const [registerSuccess, setRegisterSuccess] = useState('');

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handlePress = () => {
        navigation.navigate('LoginPage');
    };

    const handleRegister = () => {
        console.log('Registering...');
        console.log('Username', username);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);

        const usernameError = usernameValidator(username.value);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        const confirmPasswordError = confirmPasswordValidator(password.value, confirmPassword.value);

        if (usernameError || emailError || passwordError || confirmPasswordError) {
            setUsername({ ...username, error: usernameError });
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
        }
        console.log('Fetching...');
        const fetchUrl = `http://${ip}:${port}/user/register`;

        fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value,
                isAdmin: false,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log('User created:', data);
                if (data.errorMessage) {
                    setRegisterError({ error: data.errorMessage });
                } else {
                    setRegisterSuccess('Registration successful! Please check your email to confirm your account.');
                    setEmail({ value: '', error: '' });
                    setUsername({ value: '', error: '' });
                    setPassword({ value: '', error: '' });
                    setConfirmPassword({ value: '', error: '' });
                }
            })
            .catch((error) => {
                console.error('Error creating user:', error);
                setRegisterError({ error: 'Failed to register user. Please try again.' });
            });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoStyle}>
                    <Logo />
                </View>
                <Text style={styles.heading}>Create account</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username.value}
                    onChangeText={(username) => setUsername({ value: username, error: '' })}
                    error={!!username.error}
                />
                {username.error ? <Text style={styles.errorText}>{username.error}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email.value}
                    onChangeText={(email) => setEmail({ value: email, error: '' })}
                    error={!!email.error}
                    autoCapitalize='none'
                    autoComplete='email'
                    textContentType='emailAddress'
                    keyboardType='email-address'
                />
                {email.error ? <Text style={styles.errorText}>{email.error}</Text> : null}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password.value}
                        onChangeText={(password) => setPassword({ value: password, error: '' })}
                        error={!!password.error}
                    />
                    <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
                        <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {password.error ? <Text style={styles.errorText}>{password.error}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={!showPassword}
                    value={confirmPassword.value}
                    onChangeText={(password) => setConfirmPassword({ value: password, error: '' })}
                    error={!!confirmPassword.error}
                />
                {confirmPassword.error ? <Text style={styles.errorText}>{confirmPassword.error}</Text> : null}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleRegister} style={[styles.registerButton, styles.buttonMargin]}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
                {registerError.error ? <Text style={styles.errorText}>{registerError.error}</Text> : null}
                {registerSuccess ? <Text style={styles.successText}>{registerSuccess}</Text> : null}
                <View>
                    <Text style={styles.errorText}>Are you a registered user? Please{' '}
                        <Text style={[styles.signInText, styles.link]} onPress={handlePress}>
                            sign in.
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoStyle: {
        marginBottom: 12,
        marginTop: '40%'
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: '15%',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        color: '#124076',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '100%',
    },
    inputField: {
        flex: 1,
        height: 40,
    },
    showPasswordButton: {},
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        margin: 5,
        color: 'red',
    },
    successText: {
        margin: 5,
        color: 'green',
    },
    registerButton: {
        backgroundColor: '#124076',
        padding: 25,
        borderRadius: 5,
    },
    buttonMargin: {
        margin: 10,
    },
    signInText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    link: {
        textDecorationColor: 'blue',
    },
});

export default RegisterForm;
