import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { emailValidator, ip, port } from '../core/utils';

const ResetPasswordModal = ({ onClose, navigation }) => {
    const [email, setEmail] = useState({ value: '', error: '' });
    const [message, setMessage] = useState('');

    const handleResetPassword = () => {
        const emailError = emailValidator(email.value);
        if (emailError) {
            setEmail({ ...email, error: emailError });
            return;
        }

        const fetchUrl = `http://${ip}:${port}/user/reset-password?email=${email.value}`;

        fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    setMessage('An email has been sent with instructions to reset your password.');
                    setEmail({ value: '', error: '' });
                } else {
                    setMessage('Failed to send reset password email.');
                }
            })
            .catch((error) => {
                console.error('Error sending reset password email:', error);
                setMessage('An error occurred. Please try again later.');
            });
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalHeading}>Reset Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email.value}
                    onChangeText={(text) => setEmail({ value: text, error: '' })}
                    error={!!email.error}
                    autoCapitalize='none'
                    autoComplete='email'
                    textContentType='emailAddress'
                    keyboardType='email-address'
                />
                {email.error ? <Text style={styles.errorText}>{email.error}</Text> : null}
                <TouchableOpacity onPress={handleResetPassword} style={styles.resetButton}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                {message ? <Text style={styles.messageText}>{message}</Text> : null}
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalHeading: {
        fontSize: 20,
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
    closeButton: {
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
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

export default ResetPasswordModal;
