import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { passwordValidator, confirmPasswordValidator, ip, port } from '../core/utils';

const ResetPasswordPage = ({ route, navigation }) => {
    const token = route.params?.token ?? ''; // Preia token-ul din parametrii rutei
    const [newPassword, setNewPassword] = useState({ value: '', error: '' });
    const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
    const [message, setMessage] = useState('');
    
    const handleConfirmResetPassword = () => {
        const passwordError = passwordValidator(newPassword.value);
        const confirmPasswordError = confirmPasswordValidator(newPassword.value, confirmPassword.value);
    
        if (passwordError || confirmPasswordError) {
            setNewPassword({ ...newPassword, error: passwordError });
            setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
            return;
        }
    
        const fetchUrl = `http://${ip}:${port}/user/confirm-reset-password?token=${token}&newPassword=${newPassword.value}`;
    
        fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    setMessage('Your password has been reset successfully.');
                    
                    setNewPassword({ value: '', error: '' });
                    setConfirmPassword({ value: '', error: '' });
                    navigation.navigate('LoginPage')
                } else {
                    setMessage('Failed to reset password.');
                }
            })
            .catch((error) => {
                console.error('Error resetting password:', error);
                setMessage('An error occurred. Please try again later.');
            });
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Reset Password</Text>
            <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry={true}
                value={newPassword.value}
                onChangeText={(text) => setNewPassword({ value: text, error: '' })}
                error={!!newPassword.error}
            />
            {newPassword.error ? <Text style={styles.errorText}>{newPassword.error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry={true}
                value={confirmPassword.value}
                onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
                error={!!confirmPassword.error}
            />
            {confirmPassword.error ? <Text style={styles.errorText}>{confirmPassword.error}</Text> : null}
            <TouchableOpacity onPress={handleConfirmResetPassword} style={styles.resetButton}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            {message ? <Text style={styles.messageText}>{message}</Text> : null}
        </View>
    );
    };
    
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
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
    resetButton: {
        backgroundColor: '#124076',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    messageText: {
        color: 'green',
        marginBottom: 10,
    },
    });
    
    export default ResetPasswordPage;
