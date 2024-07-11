import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ip, port } from '../core/utils';
const ConfirmEmail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [message, setMessage] = useState('Confirming your email...');

    useEffect(() => {
        const { token } = route.params;
        const confirmEmailUrl = `http://${ip}:${port}/user/confirm?token=${token}`;

        fetch(confirmEmailUrl)
            .then(response => response.text())
            .then(data => {
                setMessage('Email confirmed successfully! You can now log in.');
            })
            .catch(error => {
                setMessage('Invalid or expired token.');
            });
    }, [route.params]);

    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            {message === 'Email confirmed successfully! You can now log in.' && (
                <Button title="Go to Login" onPress={() => navigation.navigate('LoginPage')} />
            )}
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
    message: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default ConfirmEmail;
