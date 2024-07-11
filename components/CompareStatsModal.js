import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';

const CompareStatsModal = ({ visible, onClose }) => {
    const [users, setUsers] = useState([]);
    const [user1, setUser1] = useState(null);
    const [user2, setUser2] = useState(null);
    const [user1Info, setUser1Info] = useState(null);
    const [user2Info, setUser2Info] = useState(null);
    const [searchUser1, setSearchUser1] = useState('');
    const [searchUser2, setSearchUser2] = useState('');
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);

    useEffect(() => {
        if (visible) {
            fetch(`http://${ip}:${port}/user/getAll`)
                .then(response => response.json())
                .then(data => {
                    const activeUsers = data.filter(user => user.active);
                    setUsers(activeUsers);
                })
                .catch(error => console.error('Error fetching users:', error));
        }
    }, [visible]);

    const handleSelectUser1 = (user) => {
        setUser1(user);
        setSearchUser1(user.username);
        setUser1Info(user);
        setShowDropdown1(false);
    };

    const handleSelectUser2 = (user) => {
        setUser2(user);
        setSearchUser2(user.username);
        setUser2Info(user);
        setShowDropdown2(false);
    };

    const filteredUsers1 = users.filter(user => user.username.toLowerCase().includes(searchUser1.toLowerCase()));
    const filteredUsers2 = users.filter(user => user.username.toLowerCase().includes(searchUser2.toLowerCase()));

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalContent}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close-circle" size={36} color="black" />
                </TouchableOpacity>
                <Text style={styles.text}>Pagina comparare statistici</Text>
                <View style={styles.searchContainer}>
                    <Text>Selectează utilizatorul 1:</Text>
                    <TouchableOpacity onPress={() => setShowDropdown1(!showDropdown1)}>
                        <TextInput
                            style={styles.input}
                            placeholder="Caută utilizatorul 1"
                            value={searchUser1}
                            onChangeText={setSearchUser1}
                            onFocus={() => setShowDropdown1(true)}
                        />
                    </TouchableOpacity>
                    {showDropdown1 && (
                        <FlatList
                            data={filteredUsers1}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectUser1(item)}>
                                    <Text style={styles.userItem}>{item.username}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.dropdown}
                        />
                    )}
                </View>
                <View style={styles.searchContainer}>
                    <Text>Selectează utilizatorul 2:</Text>
                    <TouchableOpacity onPress={() => setShowDropdown2(!showDropdown2)}>
                        <TextInput
                            style={styles.input}
                            placeholder="Caută utilizatorul 2"
                            value={searchUser2}
                            onChangeText={setSearchUser2}
                            onFocus={() => setShowDropdown2(true)}
                        />
                    </TouchableOpacity>
                    {showDropdown2 && (
                        <FlatList
                            data={filteredUsers2}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectUser2(item)}>
                                    <Text style={styles.userItem}>{item.username}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.dropdown}
                        />
                    )}
                </View>
                {user1Info && user2Info && (
                    <View style={styles.comparisonContainer}>
                        <Text style={styles.infoTitle}>Comparare statistici</Text>
                        <View style={styles.row}>
                            <Text style={styles.emptyLabel}></Text>
                            <Text style={styles.name}>{user1Info.username}</Text>
                            <Text style={styles.name}>{user2Info.username}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Vârstă:</Text>
                            <Text style={styles.value}>{user1Info.age}</Text>
                            <Text style={styles.value}>{user2Info.age}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Stars:</Text>
                            <Text style={styles.value}>{user1Info.stars}</Text>
                            <Text style={styles.value}>{user2Info.stars}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Număr grupuri:</Text>
                            <Text style={styles.value}>{user1Info.groupCount}</Text>
                            <Text style={styles.value}>{user2Info.groupCount}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Număr evenimente:</Text>
                            <Text style={styles.value}>{user1Info.eventCount}</Text>
                            <Text style={styles.value}>{user2Info.eventCount}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Număr ratinguri:</Text>
                            <Text style={styles.value}>{user1Info.ratingCount}</Text>
                            <Text style={styles.value}>{user2Info.ratingCount}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Număr skill-uri:</Text>
                            <Text style={styles.value}>{user1Info.skillCount}</Text>
                            <Text style={styles.value}>{user2Info.skillCount}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Număr date disponibile:</Text>
                            <Text style={styles.value}>{user1Info.availableDateCount}</Text>
                            <Text style={styles.value}>{user2Info.availableDateCount}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Oraș:</Text>
                            <Text style={styles.value}>{user1Info.city}</Text>
                            <Text style={styles.value}>{user2Info.city}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Număr telefon:</Text>
                            <Text style={styles.value}>{user1Info.phoneNo}</Text>
                            <Text style={styles.value}>{user2Info.phoneNo}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Last login date:</Text>
                            <Text style={styles.value}>{new Date(user1Info.lastLoginDate).toLocaleString()}</Text>
                            <Text style={styles.value}>{new Date(user2Info.lastLoginDate).toLocaleString()}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Data înscriere:</Text>
                            <Text style={styles.value}>{new Date(user1Info.registeredDate).toLocaleDateString()}</Text>
                            <Text style={styles.value}>{new Date(user2Info.registeredDate).toLocaleDateString()}</Text>
                        </View>
                    </View>
                )}
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    text: {
        fontSize: 24,
        textAlign: 'center',
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchContainer: {
        width: '80%',
        marginVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
    },
    dropdown: {
        width: '100%',
        maxHeight: 150,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    userItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    comparisonContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        flex: 1,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        textAlign: 'center',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    emptyLabel: {
        flex: 1,
    },
    name: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default CompareStatsModal;
