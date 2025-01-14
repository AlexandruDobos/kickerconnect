import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { ip, port, passwordValidator, confirmPasswordValidator } from '../core/utils';
import DateInput from './DateInput';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditProfileModal = ({ visible, onClose }) => {
    const { userData, updateUserData } = useUser();
    const [profileData, setProfileData] = useState({
        city: '',
        dateOfBirth: '',
        description: '',
        id: '',
        name: '',
        phoneNo: '',
        skills: [],
        availableDates: [],
        stars: 0,
        profileImage: '',
    });
    const [editableField, setEditableField] = useState(null);
    const [newSkill, setNewSkill] = useState('');
    const [newAvailableDate, setNewAvailableDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [currentPassword, setCurrentPassword] = useState({ value: '', error: '' });
    const [newPassword, setNewPassword] = useState({ value: '', error: '' });
    const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });

    useEffect(() => {
        if (visible) {
            const fetchUrl = `http://${ip}:${port}/user?user=${userData.id}`;

            fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.errorMessage) {
                        setProfileData({
                            city: data.city || '',
                            dateOfBirth: data.dateOfBirth || '',
                            description: data.description || '',
                            id: data.id || '',
                            name: data.name || '',
                            phoneNo: data.phoneNo || '',
                            skills: data.skills || [],
                            availableDates: data.availableDates || [],
                            stars: data.stars || 0,
                            profileImage: data.profileImage || '',
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                });
        }
    }, [visible]);

    const handleEdit = (field) => {
        setEditableField(field);
    };

    const handleSave = async () => {
        const fetchUrl = `http://${ip}:${port}/user?user=${userData.id}`;

        // Convert image to base64
        let profileImageBase64 = profileData.profileImage;
        if (profileImageBase64.startsWith('file://')) {
            profileImageBase64 = await FileSystem.readAsStringAsync(profileData.profileImage, {
                encoding: FileSystem.EncodingType.Base64,
            });
            profileImageBase64 = `data:image/jpeg;base64,${profileImageBase64}`;
        }

        const updatedProfileData = { ...profileData, profileImage: profileImageBase64 };

        fetch(fetchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProfileData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    setEditableField(null);
                    updateUserData(data);
                }
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            });
    };

    const handleChange = (field, value) => {
        setProfileData({ ...profileData, [field]: value });
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setProfileData((prevData) => ({
                ...prevData,
                skills: [...prevData.skills, newSkill.trim()],
            }));
            setNewSkill('');
            setEditableField(null);
        }
    };

    const handleDeleteSkill = (index) => {
        setProfileData((prevData) => ({
            ...prevData,
            skills: prevData.skills.filter((_, i) => i !== index),
        }));
        setEditableField(null);
    };

    const handleAddAvailableDate = () => {
        if (newAvailableDate >= new Date()) {
            setProfileData((prevData) => ({
                ...prevData,
                availableDates: [...prevData.availableDates, newAvailableDate.toISOString()],
            }));
            setNewAvailableDate(new Date());
            setShowDatePicker(false);
        }
    };

    const handleDeleteAvailableDate = (index) => {
        setProfileData((prevData) => ({
            ...prevData,
            availableDates: prevData.availableDates.filter((_, i) => i !== index),
        }));
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileData({ ...profileData, profileImage: result.assets[0].uri });
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileData({ ...profileData, profileImage: result.assets[0].uri });
        }
    };

    const handleResetPassword = () => {
        const currentPasswordError = passwordValidator(currentPassword.value);
        const newPasswordError = passwordValidator(newPassword.value);
        const confirmPasswordError = confirmPasswordValidator(newPassword.value, confirmPassword.value);

        if (currentPasswordError || newPasswordError || confirmPasswordError) {
            setCurrentPassword({ ...currentPassword, error: currentPasswordError });
            setNewPassword({ ...newPassword, error: newPasswordError });
            setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
            return;
        }

        const fetchUrl = `http://${ip}:${port}/user?user=${userData.id}`;

        fetch(fetchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: currentPassword.value,
                newPassword: newPassword.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    setShowPasswordReset(false);
                    setCurrentPassword({ value: '', error: '' });
                    setNewPassword({ value: '', error: '' });
                    setConfirmPassword({ value: '', error: '' });
                } else {
                    console.error('Error resetting password:', data.errorMessage);
                }
            })
            .catch((error) => {
                console.error('Error resetting password:', error);
            });
    };

    const fieldLabels = {
        city: 'Oraș',
        dateOfBirth: 'Data nașterii',
        description: 'Descriere',
        name: 'Nume',
        phoneNo: 'Număr telefon',
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close-circle" size={36} color="black" />
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <Text style={styles.text}>Pagina editare profil</Text>
                        <View style={styles.imageContainer}>
                            {profileData.profileImage ? (
                                <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
                            ) : (
                                <Text style={styles.profileImageText}>No Image</Text>
                            )}
                            <View style={styles.imageButtons}>
                                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                                    <Ionicons name="image-outline" size={24} color="black" />
                                    <Text style={styles.profileImageText}>Select from Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                                    <Ionicons name="camera-outline" size={24} color="black" />
                                    <Text style={styles.profileImageText}>Take Photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {Object.keys(profileData).map((key) => (
                            key !== 'id' && key !== 'skills' && key !== 'availableDates' && key !== 'stars' && key !== 'profileImage' && (
                                <View key={key} style={styles.fieldContainer}>
                                    <Text style={styles.label}>{fieldLabels[key]}</Text>
                                    {key === 'dateOfBirth' ? (
                                        <DateInput
                                            value={profileData[key]}
                                            onChange={(date) => handleChange('dateOfBirth', date)}
                                        />
                                    ) : (
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={[styles.input, editableField === key && styles.editableInput]}
                                                value={profileData[key]?.toString() || ''}
                                                onChangeText={(text) => handleChange(key, text)}
                                                editable={editableField === key}
                                                multiline={key === 'description'}
                                                numberOfLines={key === 'description' ? 4 : 1}
                                            />
                                            {editableField !== key && (
                                                <TouchableOpacity
                                                    style={styles.editButton}
                                                    onPress={() => handleEdit(key)}
                                                >
                                                    <Ionicons name="create-outline" size={24} color="black" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )
                        ))}
                        <View style={styles.skillsContainer}>
                            <Text style={styles.label}>Skills</Text>
                            <View style={styles.skillsList}>
                                {profileData.skills.map((skill, index) => (
                                    <View key={index} style={styles.skillItem}>
                                        <Text style={styles.skillText}>{skill}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteSkill(index)}>
                                            <Ionicons name="close-circle" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.addSkillContainer}>
                                <TextInput
                                    style={styles.addSkillInput}
                                    placeholder="Add a skill"
                                    value={newSkill}
                                    onChangeText={setNewSkill}
                                />
                                <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}>
                                    <Ionicons name="add-circle" size={24} color="green" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.availableDatesContainer}>
                            <Text style={styles.label}>Disponibilitate</Text>
                            <View style={styles.availableDatesList}>
                                {profileData.availableDates.map((date, index) => (
                                    <View key={index} style={styles.availableDateItem}>
                                        <Text style={styles.availableDateText}>{new Date(date).toLocaleString()}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteAvailableDate(index)}>
                                            <Ionicons name="close-circle" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.addAvailableDateContainer}>
                                <TouchableOpacity
                                    style={styles.addAvailableDateButton}
                                    onPress={() => setShowDatePicker(true)}
                                >

                                    <Text style={styles.label}>Add Available Date</Text>
                                    <Ionicons name="add-circle" size={24} color="green" />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <View>
                                        <DateTimePicker
                                            value={newAvailableDate}
                                            mode="datetime"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                const currentDate = selectedDate || newAvailableDate;
                                                setShowDatePicker(Platform.OS === 'ios');
                                                setNewAvailableDate(currentDate);
                                            }}
                                        />
                                    </View>
                                )}
                                {showDatePicker && <TouchableOpacity
                                    style={styles.confirmDateButton}
                                    onPress={handleAddAvailableDate}
                                >
                                    <Text style={styles.saveDateButton}>OK</Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                        
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>


                    </View>
                    <View style={styles.content}>
                        <Text style={styles.text}>Sectiune resetare parola</Text>
                    </View>
                    <TouchableOpacity style={styles.resetPasswordButton} onPress={() => setShowPasswordReset(!showPasswordReset)}>
                            <Text style={styles.resetPasswordButtonText}>Reset Password</Text>
                        </TouchableOpacity>
                        {showPasswordReset && (
                            <View style={styles.resetPasswordContainer}>
                                <TextInput
                                    style={[styles.resetPasswordInput, currentPassword.error && styles.errorInput]}
                                    placeholder="Current password"
                                    secureTextEntry={true}
                                    value={currentPassword.value}
                                    onChangeText={(text) => setCurrentPassword({ value: text, error: '' })}
                                />
                                {currentPassword.error ? <Text style={styles.errorText}>{currentPassword.error}</Text> : null}
                                <TextInput
                                    style={[styles.resetPasswordInput, newPassword.error && styles.errorInput]}
                                    placeholder="New password"
                                    secureTextEntry={true}
                                    value={newPassword.value}
                                    onChangeText={(text) => setNewPassword({ value: text, error: '' })}
                                />
                                {newPassword.error ? <Text style={styles.errorText}>{newPassword.error}</Text> : null}
                                <TextInput
                                    style={[styles.resetPasswordInput, confirmPassword.error && styles.errorInput]}
                                    placeholder="Confirm new password"
                                    secureTextEntry={true}
                                    value={confirmPassword.value}
                                    onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
                                />
                                {confirmPassword.error ? <Text style={styles.errorText}>{confirmPassword.error}</Text> : null}
                                <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 40,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1000,
    },
    content: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImageText:{
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333333',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    imageButtons: {
        flexDirection: 'row',
        alignItems:"center",
        justifyContent: "center",
    },
    imageButton: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        marginHorizontal: 10,
    },
    fieldContainer: {
        flexDirection: 'column',
        marginBottom: 10,
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flex: 1,
        marginRight: 10,
        padding: 5,
    },
    editableInput: {
        borderBottomColor: 'blue',
    },
    editButton: {
        padding: 10,
    },
    saveDateButton: {
        marginTop: 0,
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5,
        color: "white",
    },
    saveButton: {
        width: "30%",
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center",
    },
    skillsContainer: {
        width: '100%',
        marginTop: 20,
    },
    skillsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
    },
    skillText: {
        marginRight: 10,
    },
    addSkillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    addSkillInput: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flex: 1,
        marginRight: 10,
        padding: 5,
    },
    addSkillButton: {
        padding: 10,
    },
    availableDatesContainer: {
        width: '100%',
        marginTop: 20,
    },
    availableDatesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    availableDateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
    },
    availableDateText: {
        marginRight: 10,
    },
    addAvailableDateContainer: {
        flexDirection: 'column',
        alignItems: 'left',
        marginTop: 10,
    },
    addAvailableDateButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confirmDateButton: {
        padding: 10,
    },
    resetPasswordButton: {
        marginBottom: 40,
        backgroundColor: '#124076',
        padding: 15,
        borderRadius: 5,
        width: '50%',
        display: "flex",
        alignSelf: 'center',
    },
    resetPasswordButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    resetPasswordContainer: {
        display: "flex",
        alignSelf: 'center',
        marginTop: -20,
        width: '50%',
    },
    resetButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
        marginBottom: 30,
    },
    resetPasswordInput:{
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flex: 1,
        marginRight: 10,
        padding: 5,
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    errorInput: {
        borderBottomColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    textAreaContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        width: '100%',
    },
    textArea: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flex: 1,
        marginRight: 10,
        padding: 5,
        textAlignVertical: 'top',
    },
});

export default EditProfileModal;
