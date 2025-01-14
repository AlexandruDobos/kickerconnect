import React from 'react';
import { Button, View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';

function HomePage() {
    const navigation = useNavigation();
    const goToLoginPage = () => {
        navigation.navigate('LoginPage')
    }
    const goToRegisterPage = () => {
        navigation.navigate('RegisterPage')
    }
    return (
        <View style={styles.container}>
            <View style={styles.logoStyle}>
                <Logo />
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={goToLoginPage} style={[styles.loginButton, styles.buttonMargin]}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToRegisterPage} style={[styles.registerButton, styles.buttonMargin]}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    logoStyle: {
        marginBottom: 12,
        marginTop: '40%'
    },
    image: {
        //marginTop: 10,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,

    },
    loginButton: {
        width: "30%",
        backgroundColor: '#7F9F80',
        padding: 30,
        borderRadius: 5
    },
    registerButton: {
        width: "30%",
        backgroundColor: '#124076',
        padding: 30,
        borderRadius: 5
    },
    buttonMargin: {
        margin: 10, //Spatiul dintre butoane
    }
})

export default HomePage;