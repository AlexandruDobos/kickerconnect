import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { emailValidator, passwordValidator, confirmPasswordValidator, ip, port } from '../core/utils';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import BottomBar from '../components/BottomBar';
import ResetPasswordModal from '../components/ResetPasswordModal';


const LoginForm = () => {
    const { updateUserData } = useUser();
    const navigation = useNavigation();
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState({ error: '' });
    const [resetModalVisible, setResetModalVisible] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handlePress = () => {
        navigation.navigate('RegisterPage');
    };

    const handleLogin = () => {
        console.log('Logging...');
        console.log('Email:', email);
        console.log('Password:', password);

        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);

        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
        }
        console.log('Fetching...');
        const fetchUrl = "http://" + ip + ":" + port + "/user/login"

        fetch(fetchUrl, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        })
            .then((response) => {
                console.log("am intrat aici")
                return response.json();
            })
            .then((data) => {
                //console.log('User logged successful:', data);
                if (data.errorMessage) {
                    console.log("Eroarea este: " + data.errorMessage)
                    setLoginError({ error: data.errorMessage })
                } else {
                    updateUserData(data);


                    // fetch(fetchUrl, {

                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',

                    //     },
                    //     body: JSON.stringify({
                    //         email: email.value,
                    //         password: password.value,
                    //     }),
                    // })
                    //     .then((response) => {
                    //         console.log("am intrat aici")
                    //         // if (!response.ok) {
                    //         //     console.log(response)
                    //         //     throw new Error('Failed to create user');
                    //         // }
                    //         return response.json();
                    //     })
                    //     .then((data) => {
                    //         console.log('User logged successful:', data);
                    //         if (data.errorMessage) {
                    //             console.log("Eroarea este: " + data.errorMessage)
                    //             setLoginError({ error: data.errorMessage })
                    //         } else {
                    //             updateUserData(data);        
                    //             setEmail({ value: '', error: '' })
                    //             setPassword({ value: '', error: '' })
                    //             navigation.navigate('GroupsPage')
                    //         }
                    //         // Do something with the response, such as updating the UI or showing a success message
                    //     })
                    //     .catch((error) => {
                    //         console.error('Error logging user:', error);
                    //         // Handle the error, such as displaying an error message to the user
                    //     });
                    setEmail({ value: '', error: '' })
                    setPassword({ value: '', error: '' })
                    navigation.navigate('GroupsPage')
                }
            })
            .catch((error) => {
                console.error('Error logging user:', error);
            });



    };

    const handleResetPassword = () => {
        setResetModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <View style={styles.logoStyle}>
                    <Logo />
                </View>
                <Text style={styles.heading}>Login</Text>
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
                <TouchableOpacity onPress={handleResetPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleLogin} style={[styles.loginButton, styles.buttonMargin]}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                {loginError.error ? <Text style={styles.errorText}>{loginError.error}</Text> : null}
                <View>
                    <Text style={styles.errorText}>Don't have an account? Register{' '}
                        <Text style={[styles.signInText, styles.link]} onPress={handlePress}>
                            here.
                        </Text>

                    </Text>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={resetModalVisible}
                    onRequestClose={() => {
                        setResetModalVisible(!resetModalVisible);
                    }}
                >
                    <ResetPasswordModal onClose={() => setResetModalVisible(false)} />
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoStyle: {
        marginBottom: 12,
        marginTop: '40%'
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        color: '#124076',
        fontWeight: 'bold'
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
    showPasswordButton: {
        //padding: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'

    },
    errorText: {
        margin: 5,
        color: 'red'
    },
    loginButton: {
        backgroundColor: '#124076',
        padding: 25,
        borderRadius: 5
    },
    buttonMargin: {
        margin: 10,
    },
    signInText: {
        color: 'blue', // culoarea pentru textul "sign in"
        textDecorationLine: 'underline', // sublinierea textului
    },
    link: {
        textDecorationColor: 'blue', // culoarea sublinierii
    },
    forgotPasswordText: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginVertical: 10,
    },
});

export default LoginForm;
