import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SideMenu from './SideMenu';
import CreateGroupModal from './CreateGroupModal'; // Importăm noul fișier
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext'; // Importăm contextul utilizatorului

const BottomBar = ({ selected, onSelect }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] = useState(false);
    const { updateUserData } = useUser();
    const navigation = useNavigation();

    const toggleMenu = () => {
        console.log(updateUserData)
        setIsMenuVisible(!isMenuVisible);
    };

    const toggleCreateGroupModal = () => {
        setIsCreateGroupModalVisible(!isCreateGroupModalVisible);
    };

    const handleLogout = () => {
        updateUserData(null); // Șterge datele utilizatorului
        navigation.navigate('LoginPage'); // Redirecționează către pagina de login
    };

    return (
        <View style={styles.container}>
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.iconWithText}
                    onPress={toggleMenu}
                >
                    <Ionicons name="menu" size={24} color="black" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconWithText, selected === 'Creează grup' && styles.selected]}
                    onPress={toggleCreateGroupModal}
                >
                    <Ionicons name="add-circle" size={24} color="black" style={styles.icon} />
                    <Text style={styles.text}>Creează grup</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconWithText, selected === 'Logout' && styles.selected]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="black" style={styles.icon} />
                    <Text style={styles.text}>Logout</Text>
                </TouchableOpacity>
            </View>
            
            <Modal
                animationType="fade"
                transparent={true}
                visible={isMenuVisible}
                onRequestClose={toggleMenu}
            >
                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.sideMenuContainer}>
                                <SideMenu isVisible={isMenuVisible} onClose={toggleMenu} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <CreateGroupModal
                visible={isCreateGroupModalVisible}
                onClose={toggleCreateGroupModal}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
       // flex: 1,
        justifyContent: 'flex-end',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        width: '100%',
    },
    iconWithText: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    text: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    selected: {
        backgroundColor: '#DDF2FD',
    },
    icon: {
        fontSize: 24,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sideMenuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80%',
        height: '100%',
    },
});

export default BottomBar;
