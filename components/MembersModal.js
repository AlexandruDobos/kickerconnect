import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileModal from './ProfileModal'; // Importăm componenta ProfileModal
import { ip, port } from '../core/utils';
const MembersModal = ({ visible, onClose, members }) => {
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(members);

    const handleOpenProfileModal = (userId, username) => {
        setSelectedUserId(userId);
        setSelectedUsername(username);
        setIsProfileModalVisible(true);
    }

    const handleCloseProfileModal = () => {
        setIsProfileModalVisible(false);
        setSelectedUserId(null);
        setSelectedUsername(null);
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = members.filter(member =>
                member.username.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredMembers(filtered);
        } else {
            setFilteredMembers(members);
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close-circle" size={36} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Aici sunt membri grupului:</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Căutați membri..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <FlatList
                    style={styles.flatListStyle}
                    data={filteredMembers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleOpenProfileModal(item.id, item.username)}>
                            <View style={styles.memberItem}>
                                <View style={styles.imageView}>
                                    <Image
                                        source={{ uri: item.profileImage ? `http://${ip}:${port}/uploads/${item.profileImage}` : 'https://cdn-icons-png.freepik.com/512/3106/3106773.png' }}
                                        style={styles.userIcon}
                                    />
                                </View>
                                <View style={styles.usernameView}>
                                    <Text style={styles.memberText}>{item.username}</Text>
                                    <Text style={styles.cityText}>{item.city}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            {selectedUserId && selectedUsername && (
                <ProfileModal
                    visible={isProfileModalVisible}
                    onClose={handleCloseProfileModal}
                    userId={selectedUserId}
                    username={selectedUsername}
                />
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
       // marginTop: 40,
        backgroundColor: '#F0F0F0',
    },
    flatListStyle: {
        width: "100%",
        display: "flex",
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
    },
    searchInput: {
        width: '90%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    memberItem: {
        width: "80%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center", 
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    imageView:{
        width: "30%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center", 
    },
    usernameView:{
        width: "70%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center", 
    },
    userIcon: {
        width: 75,
        height: 75,
        borderRadius: 100,
        marginRight: 10,
    },
    memberText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    cityText:{
        fontsize: 16,

    }
});

export default MembersModal;
